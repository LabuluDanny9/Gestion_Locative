import { z } from "zod";

const optionalUrl = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().url().optional(),
);

const optionalSecret = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.string().min(1).optional(),
);

export const serverEnvSchema = z.object({
  NEXT_PUBLIC_APP_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_URL: optionalUrl,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: optionalSecret,
  SUPABASE_PROJECT_ID: optionalSecret,
  SUPABASE_SECRET_KEY: optionalSecret,
  APP_TIMEZONE: z.string().min(1).default("Africa/Lubumbashi"),
  DEFAULT_CURRENCY: z.enum(["USD", "CDF"]).default("USD"),
  DEFAULT_PHONE_COUNTRY_CODE: z.string().regex(/^\d{1,4}$/).default("243"),
  TEXTBEE_API_KEY: optionalSecret,
  TEXTBEE_DEVICE_ID: optionalSecret,
  TEXTBEE_SIM_SUBSCRIPTION_ID: z.preprocess(
    (value) => (value === "" || value === undefined ? undefined : Number(value)),
    z.number().int().nonnegative().optional(),
  ),
  INFOBIP_API_KEY: optionalSecret,
  INFOBIP_BASE_URL: optionalSecret,
  INFOBIP_SMS_SENDER: optionalSecret,
  INFOBIP_WHATSAPP_SENDER: optionalSecret,
  INFOBIP_WHATSAPP_MESSAGE_TEMPLATE_NAME: optionalSecret,
  INFOBIP_WHATSAPP_PAYMENT_TEMPLATE_NAME: optionalSecret,
  INFOBIP_WHATSAPP_TEMPLATE_LANGUAGE: z.string().min(2).default("fr"),
  WHATSAPP_ACCESS_TOKEN: optionalSecret,
  WHATSAPP_PHONE_NUMBER_ID: optionalSecret,
  WHATSAPP_GRAPH_API_VERSION: z.preprocess(
    (value) => (value === "" ? undefined : value),
    z.string().regex(/^v\d+\.\d+$/).optional(),
  ),
  WHATSAPP_PAYMENT_TEMPLATE_NAME: optionalSecret,
  WHATSAPP_MESSAGE_TEMPLATE_NAME: optionalSecret,
  WHATSAPP_TEMPLATE_LANGUAGE: z.string().min(2).default("fr"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

export function parseServerEnv(
  environment: Record<string, string | undefined> = process.env,
): ServerEnv {
  return serverEnvSchema.parse(environment);
}
