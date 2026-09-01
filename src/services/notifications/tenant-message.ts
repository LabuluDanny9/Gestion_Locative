import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { parseServerEnv } from "@/lib/env";
import type { Database } from "@/types/database.types";

import { normalizePhoneNumber, type NotificationProvider, type ProviderChannel } from "./provider";
import { TextBeeSmsProvider } from "./textbee-sms-provider";
import { WhatsAppCloudProvider } from "./whatsapp-cloud-provider";

type Client = SupabaseClient<Database>;

export async function sendTenantMessage(supabase: Client, organizationId: string, input: { tenantId: string; channel: ProviderChannel; body: string }) {
  const environment = parseServerEnv();
  const { data: tenant, error: tenantError } = await supabase.from("tenants")
    .select("first_name, last_name, phone, whatsapp_phone")
    .eq("organization_id", organizationId).eq("id", input.tenantId).is("archived_at", null).single();
  if (tenantError) throw tenantError;

  const tenantName = `${tenant.first_name} ${tenant.last_name}`.trim();
  const provider: NotificationProvider = input.channel === "whatsapp"
    ? new WhatsAppCloudProvider(environment)
    : new TextBeeSmsProvider(environment);
  const recipient = input.channel === "whatsapp" ? tenant.whatsapp_phone ?? tenant.phone : tenant.phone;
  const normalizedRecipient = normalizePhoneNumber(recipient, environment.DEFAULT_PHONE_COUNTRY_CODE);
  const { data: notification, error: notificationError } = await supabase.from("notifications").insert({
    organization_id: organizationId,
    tenant_id: input.tenantId,
    notification_type: "system",
    title: `Message ${input.channel === "whatsapp" ? "WhatsApp" : "SMS"} à ${tenantName}`,
    body: input.body,
    metadata: { source: "manual_message", channel: input.channel },
  }).select("id").single();
  if (notificationError) throw notificationError;

  const { data: log, error: logError } = await supabase.from("notification_logs").insert({
    organization_id: organizationId,
    notification_id: notification.id,
    channel: input.channel,
    recipient: normalizedRecipient,
    provider: provider.name,
    status: "pending",
  }).select("id").single();
  if (logError) throw logError;

  try {
    if (!provider.isConfigured()) throw new Error(`${provider.name} n’est pas configuré dans Vercel.`);
    if (input.channel === "whatsapp" && !environment.WHATSAPP_MESSAGE_TEMPLATE_NAME) throw new Error("WhatsApp : le modèle de messagerie manuelle n’est pas configuré dans Vercel.");
    const result = await provider.send({
      recipient,
      body: input.body,
      templateName: input.channel === "whatsapp" ? environment.WHATSAPP_MESSAGE_TEMPLATE_NAME : undefined,
      templateParameters: input.channel === "whatsapp" ? [tenantName, input.body] : undefined,
    });
    const { error } = await supabase.from("notification_logs").update({
      status: "sent",
      sent_at: new Date().toISOString(),
      provider_message_id: result.providerMessageId,
    }).eq("organization_id", organizationId).eq("id", log.id);
    if (error) throw error;
    return { channel: input.channel, tenantName };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "Échec inconnu du fournisseur.";
    await supabase.from("notification_logs").update({
      status: "failed",
      failed_at: new Date().toISOString(),
      error_message: message.slice(0, 1000),
    }).eq("organization_id", organizationId).eq("id", log.id);
    throw cause;
  }
}
