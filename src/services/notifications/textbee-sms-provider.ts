import "server-only";

import type { ServerEnv } from "@/lib/env";

import { NotificationProviderError, normalizePhoneNumber, providerError, type NotificationMessage, type NotificationProvider } from "./provider";

export class TextBeeSmsProvider implements NotificationProvider {
  readonly channel = "sms" as const;
  readonly name = "textbee";

  constructor(private readonly environment: ServerEnv, private readonly fetcher: typeof fetch = fetch) {}

  isConfigured() {
    return Boolean(this.environment.TEXTBEE_API_KEY);
  }

  async send(message: NotificationMessage) {
    if (!this.environment.TEXTBEE_API_KEY) throw new NotificationProviderError("TextBee n’est pas configuré.");
    const payload: Record<string, unknown> = {
      message: message.body,
      recipients: [normalizePhoneNumber(message.recipient, this.environment.DEFAULT_PHONE_COUNTRY_CODE)],
    };
    if (this.environment.TEXTBEE_DEVICE_ID) payload.deviceId = this.environment.TEXTBEE_DEVICE_ID;
    if (this.environment.TEXTBEE_SIM_SUBSCRIPTION_ID !== undefined) payload.simSubscriptionId = this.environment.TEXTBEE_SIM_SUBSCRIPTION_ID;

    const response = await this.fetcher("https://api.textbee.dev/api/v1/gateway/send-sms", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": this.environment.TEXTBEE_API_KEY },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(12_000),
    });
    if (!response.ok) await providerError(response, "TextBee");
    const result = await response.json() as { data?: { smsBatchId?: string; success?: boolean; successCount?: number } };
    const accepted = result.data?.success === true || Boolean(result.data?.smsBatchId) || (result.data?.successCount ?? 0) > 0;
    if (!result.data || !accepted) throw new NotificationProviderError("TextBee a refusé l’envoi.");
    return { providerMessageId: result.data.smsBatchId ?? null };
  }
}
