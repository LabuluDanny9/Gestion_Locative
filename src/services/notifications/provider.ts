import "server-only";

export type ProviderChannel = "sms" | "whatsapp";

export type NotificationMessage = {
  recipient: string;
  body: string;
  templateParameters?: string[];
};

export type ProviderSendResult = {
  providerMessageId: string | null;
};

export interface NotificationProvider {
  readonly channel: ProviderChannel;
  readonly name: string;
  isConfigured(): boolean;
  send(message: NotificationMessage): Promise<ProviderSendResult>;
}

export class NotificationProviderError extends Error {
  constructor(message: string, readonly status?: number) {
    super(message);
    this.name = "NotificationProviderError";
  }
}

export function normalizePhoneNumber(value: string, countryCode = "243") {
  const cleaned = value.trim().replace(/[^\d+]/g, "");
  const international = cleaned.startsWith("+")
    ? cleaned
    : cleaned.startsWith("00")
      ? `+${cleaned.slice(2)}`
      : cleaned.startsWith("0")
        ? `+${countryCode}${cleaned.slice(1)}`
        : `+${cleaned}`;
  if (!/^\+[1-9]\d{7,14}$/.test(international)) throw new NotificationProviderError("Numéro de téléphone invalide.");
  return international;
}

export async function providerError(response: Response, provider: string) {
  const raw = await response.text();
  let detail = raw;
  try {
    const parsed = JSON.parse(raw) as { message?: string; error?: { message?: string } };
    detail = parsed.error?.message ?? parsed.message ?? raw;
  } catch {
    // La réponse non JSON est conservée, sans inclure les en-têtes ni les secrets.
  }
  throw new NotificationProviderError(`${provider}: ${detail.slice(0, 500) || `HTTP ${response.status}`}`, response.status);
}
