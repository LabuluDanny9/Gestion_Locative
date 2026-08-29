import type { Database } from "@/types/database.types";

export type InvoiceStatus = Database["public"]["Enums"]["invoice_status"];

export type RentInvoice = {
  id: string;
  reference: string;
  leaseId: string;
  tenantId: string;
  tenantName: string;
  unitId: string;
  unitLabel: string;
  propertyName: string;
  period: string;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  dueDateIso: string;
  amountDue: number;
  amountPaid: number;
  balance: number;
  currency: "USD" | "CDF";
  status: InvoiceStatus;
  daysLate: number;
};
