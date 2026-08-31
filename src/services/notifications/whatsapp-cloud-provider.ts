import "server-only";

import type { ServerEnv } from "@/lib/env";

import { NotificationProviderError, normalizePhoneNumber, providerError, type NotificationMessage, type NotificationProvider } from "./provider";

export class WhatsAppCloudProvider implements NotificationProvider {
  readonly channel = "whatsapp" as const;
  readonly name = "meta_whatsapp_cloud";

  constructor(private readonly environment: ServerEnv, private readonly fetcher: typeof fetch = fetch) {}

  isConfigured() {
    return Boolean(
      this.environment.WHATSAPP_ACCESS_TOKEN
      && this.environment.WHATSAPP_PHONE_NUMBER_ID
      && this.environment.WHATSAPP_GRAPH_API_VERSION
      && this.environment.WHATSAPP_PAYMENT_TEMPLATE_NAME,
    );
  }

  async send(message: NotificationMessage) {
    const { WHATSAPP_ACCESS_TOKEN: token, WHATSAPP_PHONE_NUMBER_ID: phoneId, WHATSAPP_GRAPH_API_VERSION: version, WHATSAPP_PAYMENT_TEMPLATE_NAME: template } = this.environment;
    if (!token || !phoneId || !version || !template) throw new NotificationProviderError("WhatsApp Cloud API n’est pas configuré.");
    const response = await this.fetcher(`https://graph.facebook.com/${version}/${phoneId}/messages`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: normalizePhoneNumber(message.recipient, this.environment.DEFAULT_PHONE_COUNTRY_CODE).slice(1),
        type: "template",
        template: {
          name: template,
          language: { code: this.environment.WHATSAPP_TEMPLATE_LANGUAGE },
          components: [{ type: "body", parameters: (message.templateParameters ?? []).map((text) => ({ type: "text", text })) }],
        },
      }),
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) await providerError(response, "WhatsApp Cloud API");
    const result = await response.json() as { messages?: Array<{ id?: string }> };
    const providerMessageId = result.messages?.[0]?.id;
    if (!providerMessageId) throw new NotificationProviderError("WhatsApp n’a retourné aucun identifiant de message.");
    return { providerMessageId };
  }
}
