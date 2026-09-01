import "server-only";

import type { SupabaseClient } from "@supabase/supabase-js";

import { parseServerEnv } from "@/lib/env";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database.types";

import { normalizePhoneNumber, type NotificationProvider } from "./provider";
import { paymentWhatsAppProvider, smsProvider } from "./provider-selection";

type PaymentNotificationInput = {
  organizationId: string;
  tenantId: string;
  tenantName: string;
  phone: string;
  whatsappPhone: string | null;
  paymentId: string;
  amount: number;
  currency: Database["public"]["Enums"]["currency_code"];
  partial: boolean;
};

export async function deliverPaymentNotification(input: PaymentNotificationInput, authenticatedClient?: SupabaseClient<Database>) {
  const environment = parseServerEnv();
  const supabase = environment.SUPABASE_SECRET_KEY ? createAdminSupabaseClient() : authenticatedClient;
  if (!supabase) throw new Error("Client Supabase serveur indisponible pour les notifications.");
  const notificationType = input.partial ? "payment_partial" : "payment_received";
  const title = input.partial ? "Paiement partiel enregistré" : "Paiement reçu";
  const amount = new Intl.NumberFormat("fr-CD", { maximumFractionDigits: 2 }).format(input.amount);
  const body = `AMIRANDA EMPIRE confirme la réception de ${amount} ${input.currency}. Merci ${input.tenantName}.`;
  const { data: notification, error: notificationError } = await supabase.from("notifications").insert({
    organization_id: input.organizationId,
    tenant_id: input.tenantId,
    notification_type: notificationType,
    title,
    body,
    metadata: { payment_id: input.paymentId, amount: input.amount, currency: input.currency },
  }).select("id").single();
  if (notificationError) throw notificationError;

  const candidates: Array<{ provider: NotificationProvider; recipient: string }> = [];
  if (input.whatsappPhone) candidates.push({ provider: paymentWhatsAppProvider(environment), recipient: input.whatsappPhone });
  candidates.push({ provider: smsProvider(environment), recipient: input.phone });

  for (const { provider, recipient } of candidates) {
    const normalizedRecipient = normalizePhoneNumber(recipient, environment.DEFAULT_PHONE_COUNTRY_CODE);
    const { data: log, error: logError } = await supabase.from("notification_logs").insert({
      organization_id: input.organizationId,
      notification_id: notification.id,
      channel: provider.channel,
      recipient: normalizedRecipient,
      provider: provider.name,
      status: "pending",
    }).select("id").single();
    if (logError) throw logError;
    try {
      if (!provider.isConfigured()) throw new Error(`${provider.name} n’est pas configuré.`);
      const result = await provider.send({
        recipient,
        body,
        templateParameters: [input.tenantName, amount, input.currency],
      });
      const { error } = await supabase.from("notification_logs").update({ status: "sent", sent_at: new Date().toISOString(), provider_message_id: result.providerMessageId }).eq("id", log.id);
      if (error) throw error;
      return;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : "Échec inconnu du fournisseur.";
      await supabase.from("notification_logs").update({
        status: "failed",
        failed_at: new Date().toISOString(),
        error_message: message.slice(0, 1000),
      }).eq("id", log.id);
    }
  }
}
