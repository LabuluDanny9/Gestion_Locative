export type TenantStatus = "current" | "partial" | "late" | "arrears";
export type TenantPayment = { id: string; period: string; amount: number; currency: "USD" | "CDF"; paidAt: string; receipt: string; receiptId?: string; status: "paid" | "partial" };
export type Tenant = { id: string; code: string; name: string; phone: string; email: string; propertyId: string; propertyName: string; unitId: string; unitLabel: string; rent: number; currency: "USD" | "CDF"; nextDueDate: string; balance: number; guarantee: number; status: TenantStatus; contractStart: string; contractEnd: string; contractId: string; identityType: string; identityNumber: string; address: string; emergencyContact: string; payments: TenantPayment[] };

export const tenants: Tenant[] = [];
export const getTenant = (id: string) => tenants.find((tenant) => tenant.id === id);
export const getTenantByCode = (code: string) => tenants.find((tenant) => tenant.code === code);
