import type { Database } from "@/types/database.types";

export type NotificationType = Database["public"]["Enums"]["notification_type"];
export type NotificationRow = Database["public"]["Tables"]["notifications"]["Row"];

export const notificationLabels: Record<NotificationType, string> = {
  payment_received: "Paiement reçu",
  payment_partial: "Paiement partiel",
  payment_due_soon: "Échéance proche",
  payment_due_today: "Échéance aujourd’hui",
  payment_late: "Paiement en retard",
  payment_overdue: "Arriéré",
  lease_expiring: "Contrat à renouveler",
  system: "Système",
};

export function filterNotifications(rows: NotificationRow[], status?: string, type?: string) {
  return rows.filter((row) =>
    (status !== "unread" || row.read_at === null)
    && (!type || type === "all" || row.notification_type === type));
}
