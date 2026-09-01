import { describe, expect, it, vi } from "vitest";

import { parseServerEnv } from "@/lib/env";

import { InfobipSmsProvider, InfobipWhatsAppProvider } from "./infobip-provider";
import { normalizePhoneNumber } from "./provider";
import { TextBeeSmsProvider } from "./textbee-sms-provider";
import { WhatsAppCloudProvider } from "./whatsapp-cloud-provider";

describe("fournisseurs de notifications", () => {
  it("normalise les numéros congolais au format E.164", () => {
    expect(normalizePhoneNumber("097 000 00 00", "243")).toBe("+243970000000");
    expect(normalizePhoneNumber("+243 970 000 000", "243")).toBe("+243970000000");
  });

  it("respecte le contrat HTTP TextBee", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ data: { success: true, smsBatchId: "batch-1" } }), { status: 200 }));
    const provider = new TextBeeSmsProvider(parseServerEnv({ TEXTBEE_API_KEY: "secret", DEFAULT_PHONE_COUNTRY_CODE: "243" }), fetcher);
    await expect(provider.send({ recipient: "0970000000", body: "Paiement reçu" })).resolves.toEqual({ providerMessageId: "batch-1" });
    expect(fetcher).toHaveBeenCalledWith("https://api.textbee.dev/api/v1/gateway/send-sms", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ message: "Paiement reçu", recipients: ["+243970000000"] }),
    }));
  });

  it("respecte le contrat HTTP Infobip SMS", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ messages: [{ messageId: "sms-1" }] }), { status: 200 }));
    const provider = new InfobipSmsProvider(parseServerEnv({
      DEFAULT_PHONE_COUNTRY_CODE: "243", INFOBIP_API_KEY: "secret", INFOBIP_BASE_URL: "tenant.api.infobip.com", INFOBIP_SMS_SENDER: "ServiceSMS",
    }), fetcher);
    await expect(provider.send({ recipient: "0970000000", body: "Rappel" })).resolves.toEqual({ providerMessageId: "sms-1" });
    expect(fetcher).toHaveBeenCalledWith("https://tenant.api.infobip.com/sms/3/messages", expect.objectContaining({
      method: "POST", body: expect.stringContaining('"sender":"ServiceSMS"'),
    }));
  });

  it("respecte le contrat HTTP Infobip WhatsApp", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ messages: [{ messageId: "wa-1" }] }), { status: 200 }));
    const environment = parseServerEnv({
      DEFAULT_PHONE_COUNTRY_CODE: "243", INFOBIP_API_KEY: "secret", INFOBIP_BASE_URL: "https://tenant.api.infobip.com",
      INFOBIP_WHATSAPP_SENDER: "+243970000001", INFOBIP_WHATSAPP_TEMPLATE_LANGUAGE: "fr",
    });
    const provider = new InfobipWhatsAppProvider(environment, "message_locataire", fetcher);
    await expect(provider.send({ recipient: "+243970000000", body: "Rappel", templateParameters: ["Danny", "Rappel"] })).resolves.toEqual({ providerMessageId: "wa-1" });
    expect(fetcher).toHaveBeenCalledWith("https://tenant.api.infobip.com/whatsapp/1/message/template", expect.objectContaining({
      method: "POST", body: expect.stringContaining('"templateName":"message_locataire"'),
    }));
  });

  it("respecte le contrat WhatsApp Cloud API", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ messages: [{ id: "wamid.1" }] }), { status: 200 }));
    const provider = new WhatsAppCloudProvider(parseServerEnv({
      DEFAULT_PHONE_COUNTRY_CODE: "243",
      WHATSAPP_ACCESS_TOKEN: "token",
      WHATSAPP_PHONE_NUMBER_ID: "123",
      WHATSAPP_GRAPH_API_VERSION: "v23.0",
      WHATSAPP_PAYMENT_TEMPLATE_NAME: "confirmation_paiement",
      WHATSAPP_TEMPLATE_LANGUAGE: "fr",
    }), fetcher);
    await expect(provider.send({ recipient: "+243970000000", body: "Paiement reçu", templateParameters: ["Danny", "100", "USD"] })).resolves.toEqual({ providerMessageId: "wamid.1" });
    expect(fetcher).toHaveBeenCalledWith("https://graph.facebook.com/v23.0/123/messages", expect.objectContaining({ method: "POST" }));
  });

  it("permet un modèle WhatsApp dédié à la messagerie manuelle", async () => {
    const fetcher = vi.fn<typeof fetch>().mockResolvedValue(new Response(JSON.stringify({ messages: [{ id: "wamid.2" }] }), { status: 200 }));
    const provider = new WhatsAppCloudProvider(parseServerEnv({
      DEFAULT_PHONE_COUNTRY_CODE: "243", WHATSAPP_ACCESS_TOKEN: "token", WHATSAPP_PHONE_NUMBER_ID: "123",
      WHATSAPP_GRAPH_API_VERSION: "v23.0", WHATSAPP_TEMPLATE_LANGUAGE: "fr",
    }), fetcher);
    await provider.send({ recipient: "+243970000000", body: "Rappel", templateName: "message_locataire", templateParameters: ["Danny", "Rappel"] });
    expect(fetcher).toHaveBeenCalledWith("https://graph.facebook.com/v23.0/123/messages", expect.objectContaining({
      body: expect.stringContaining('"name":"message_locataire"'),
    }));
  });
});
