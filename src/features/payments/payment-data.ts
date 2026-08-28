export type PaymentMode = "cash" | "mobile" | "bank" | "card";
export type PaymentStatus = "paid" | "partial" | "cancelled";
export type PaymentAllocation = { period: string; amount: number };
export type Payment = { id: string; reference: string; receiptId: string; receiptNumber: string; tenantId: string; tenantName: string; unitId: string; unitLabel: string; propertyName: string; period: string; amount: number; currency: "USD" | "CDF"; mode: PaymentMode; date: string; time: string; status: PaymentStatus; agent: string; balanceBefore: number; balanceAfter: number; allocations: PaymentAllocation[]; note?: string };

export const payments: Payment[] = [];
export const getPayment = (id: string) => payments.find((payment) => payment.id === id);
export const getReceipt = (id: string) => payments.find((payment) => payment.receiptId === id);
