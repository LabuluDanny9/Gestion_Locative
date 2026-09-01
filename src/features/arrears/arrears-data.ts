export type ArrearsAgeBand = "all" | "1-30" | "31-60" | "61-90" | "90+";

export type ArrearsInstallment = {
  id: string;
  reference: string;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  amountDue: number;
  amountPaid: number;
  balance: number;
  daysLate: number;
};

export type ArrearsAccount = {
  id: string;
  tenantId: string;
  tenantName: string;
  phone: string;
  leaseId: string;
  unitId: string;
  unitLabel: string;
  propertyId: string;
  propertyName: string;
  currency: "USD" | "CDF";
  totalBalance: number;
  invoiceCount: number;
  oldestDueDate: string;
  maximumDaysLate: number;
  installments: ArrearsInstallment[];
};

export function arrearsAgeBand(daysLate: number): Exclude<ArrearsAgeBand, "all"> {
  if (daysLate <= 30) return "1-30";
  if (daysLate <= 60) return "31-60";
  if (daysLate <= 90) return "61-90";
  return "90+";
}
