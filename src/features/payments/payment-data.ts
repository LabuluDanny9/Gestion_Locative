export type PaymentMode = "cash" | "mobile" | "bank" | "card";
export type PaymentStatus = "paid" | "partial" | "cancelled";

export type PaymentAllocation = { period: string; amount: number };

export type Payment = {
  id: string;
  reference: string;
  receiptId: string;
  receiptNumber: string;
  tenantId: string;
  tenantName: string;
  unitId: string;
  unitLabel: string;
  propertyName: string;
  period: string;
  amount: number;
  currency: "USD" | "CDF";
  mode: PaymentMode;
  date: string;
  time: string;
  status: PaymentStatus;
  agent: string;
  balanceBefore: number;
  balanceAfter: number;
  allocations: PaymentAllocation[];
  note?: string;
};

export const payments: Payment[] = [
  { id: "pay-2026-00332", reference: "PAY-2026-00332", receiptId: "rec-2026-00332", receiptNumber: "REC-2026-00332", tenantId: "jean-kabulo", tenantName: "Jean Kabulo", unitId: "appartement-a03", unitLabel: "Appartement A03", propertyName: "Résidence Grâce", period: "Août 2026", amount: 350, currency: "USD", mode: "mobile", date: "05 août 2026", time: "10:42", status: "paid", agent: "Danny Labulu", balanceBefore: 350, balanceAfter: 0, allocations: [{ period: "Août 2026", amount: 350 }] },
  { id: "pay-2026-00329", reference: "PAY-2026-00329", receiptId: "rec-2026-00329", receiptNumber: "REC-2026-00329", tenantId: "grace-tshibangu", tenantName: "Grâce Tshibangu", unitId: "studio-b01", unitLabel: "Studio B01", propertyName: "Résidence Grâce", period: "Août 2026", amount: 160, currency: "USD", mode: "cash", date: "08 août 2026", time: "14:18", status: "partial", agent: "Sarah Kanku", balanceBefore: 240, balanceAfter: 80, allocations: [{ period: "Août 2026", amount: 160 }], note: "Paiement partiel, solde annoncé pour la semaine suivante." },
  { id: "pay-2026-00301", reference: "PAY-2026-00301", receiptId: "rec-2026-00301", receiptNumber: "REC-2026-00301", tenantId: "jean-kabulo", tenantName: "Jean Kabulo", unitId: "appartement-a03", unitLabel: "Appartement A03", propertyName: "Résidence Grâce", period: "Juillet 2026", amount: 350, currency: "USD", mode: "bank", date: "04 juillet 2026", time: "09:11", status: "paid", agent: "Danny Labulu", balanceBefore: 350, balanceAfter: 0, allocations: [{ period: "Juillet 2026", amount: 350 }] },
  { id: "pay-2026-00297", reference: "PAY-2026-00297", receiptId: "rec-2026-00297", receiptNumber: "REC-2026-00297", tenantId: "grace-tshibangu", tenantName: "Grâce Tshibangu", unitId: "studio-b01", unitLabel: "Studio B01", propertyName: "Résidence Grâce", period: "Juillet 2026", amount: 240, currency: "USD", mode: "mobile", date: "09 juillet 2026", time: "16:05", status: "paid", agent: "Sarah Kanku", balanceBefore: 240, balanceAfter: 0, allocations: [{ period: "Juillet 2026", amount: 240 }] },
  { id: "pay-2026-00263", reference: "PAY-2026-00263", receiptId: "rec-2026-00263", receiptNumber: "REC-2026-00263", tenantId: "patrick-mwamba", tenantName: "Patrick Mwamba", unitId: "villa-m01", unitLabel: "Villa M01", propertyName: "Villa Mwezi", period: "Juillet 2026", amount: 1200, currency: "USD", mode: "card", date: "03 juillet 2026", time: "11:27", status: "paid", agent: "Danny Labulu", balanceBefore: 1200, balanceAfter: 0, allocations: [{ period: "Juillet 2026", amount: 1200 }] },
];

export function getPayment(id: string) {
  return payments.find((payment) => payment.id === id);
}

export function getReceipt(id: string) {
  return payments.find((payment) => payment.receiptId === id);
}
