import "server-only";

import type { ServerEnv } from "@/lib/env";

import { NotificationProviderError, normalizePhoneNumber, providerError, type NotificationMessage, type NotificationProvider } from "./provider";

function endpoint(environment: ServerEnv, path: string) {
  const raw = environment.INFOBIP_BASE_URL?.trim().replace(/\/$/, "");
  if (!raw) throw new NotificationProviderError("Infobip : URL de base manquante.");
  return `${/^https?:\/\//i.test(raw) ? raw : `https://${raw}`}${path}`;
}

function headers(apiKey: string) {
  return { authorization: `App ${apiKey}`, "content-type": "application/json", accept: "application/json" };
}

export class InfobipSmsProvider implements NotificationProvider {
  readonly channel = "sms" as const;
  readonly name = "infobip_sms";

  constructor(private readonly environment: ServerEnv, private readonly fetcher: typeof fetch = fetch) {}

  isConfigured() {
    return Boolean(this.environment.INFOBIP_API_KEY && this.environment.INFOBIP_BASE_URL);
  }

  async send(message: NotificationMessage) {
    const apiKey = this.environment.INFOBIP_API_KEY;
    if (!apiKey) throw new NotificationProviderError("Infobip SMS n’est pas configuré.");
    const response = await this.fetcher(endpoint(this.environment, "/sms/3/messages"), {
      method: "POST",
      headers: headers(apiKey),
      body: JSON.stringify({
        messages: [{
          sender: this.environment.INFOBIP_SMS_SENDER ?? "ServiceSMS",
          destinations: [{ to: normalizePhoneNumber(message.recipient, this.environment.DEFAULT_PHONE_COUNTRY_CODE).slice(1) }],
          content: { text: message.body },
        }],
      }),
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) await providerError(response, "Infobip SMS");
    const result = await response.json() as { messages?: Array<{ messageId?: string }> };
    const providerMessageId = result.messages?.[0]?.messageId;
    if (!providerMessageId) throw new NotificationProviderError("Infobip SMS n’a retourné aucun identifiant de message.");
    return { providerMessageId };
  }
}

export class InfobipWhatsAppProvider implements NotificationProvider {
  readonly channel = "whatsapp" as const;
  readonly name = "infobip_whatsapp";

  constructor(private readonly environment: ServerEnv, private readonly defaultTemplateName?: string, private readonly fetcher: typeof fetch = fetch) {}

  isConfigured() {
    return Boolean(this.environment.INFOBIP_API_KEY && this.environment.INFOBIP_BASE_URL && this.environment.INFOBIP_WHATSAPP_SENDER && this.defaultTemplateName);
  }

  async send(message: NotificationMessage) {
    const apiKey = this.environment.INFOBIP_API_KEY;
    const sender = this.environment.INFOBIP_WHATSAPP_SENDER;
    const templateName = message.templateName ?? this.defaultTemplateName;
    if (!apiKey || !sender || !templateName) throw new NotificationProviderError("Infobip WhatsApp n’est pas configuré.");
    const response = await this.fetcher(endpoint(this.environment, "/whatsapp/1/message/template"), {
      method: "POST",
      headers: headers(apiKey),
      body: JSON.stringify({
        messages: [{
          from: normalizePhoneNumber(sender, this.environment.DEFAULT_PHONE_COUNTRY_CODE).slice(1),
          to: normalizePhoneNumber(message.recipient, this.environment.DEFAULT_PHONE_COUNTRY_CODE).slice(1),
          content: {
            templateName,
            templateData: { body: { placeholders: message.templateParameters ?? [] } },
            language: this.environment.INFOBIP_WHATSAPP_TEMPLATE_LANGUAGE,
          },
        }],
      }),
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) await providerError(response, "Infobip WhatsApp");
    const result = await response.json() as { messages?: Array<{ messageId?: string }> };
    const providerMessageId = result.messages?.[0]?.messageId;
    if (!providerMessageId) throw new NotificationProviderError("Infobip WhatsApp n’a retourné aucun identifiant de message.");
    return { providerMessageId };
  }
}
