import type { ServerEnv } from "@/lib/env";

import { InfobipSmsProvider, InfobipWhatsAppProvider } from "./infobip-provider";
import type { NotificationProvider } from "./provider";
import { TextBeeSmsProvider } from "./textbee-sms-provider";
import { WhatsAppCloudProvider } from "./whatsapp-cloud-provider";

export function smsProvider(environment: ServerEnv): NotificationProvider {
  const infobip = new InfobipSmsProvider(environment);
  return infobip.isConfigured() ? infobip : new TextBeeSmsProvider(environment);
}

export function manualWhatsAppProvider(environment: ServerEnv): NotificationProvider {
  const infobip = new InfobipWhatsAppProvider(environment, environment.INFOBIP_WHATSAPP_MESSAGE_TEMPLATE_NAME);
  return infobip.isConfigured() ? infobip : new WhatsAppCloudProvider(environment);
}

export function paymentWhatsAppProvider(environment: ServerEnv): NotificationProvider {
  const infobip = new InfobipWhatsAppProvider(environment, environment.INFOBIP_WHATSAPP_PAYMENT_TEMPLATE_NAME);
  return infobip.isConfigured() ? infobip : new WhatsAppCloudProvider(environment);
}
