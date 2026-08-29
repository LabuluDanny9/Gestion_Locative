export type ContractStatus = "active" | "expiring" | "draft" | "expired";
export type Contract = { id: string; reference: string; tenantId: string; tenantName: string; unitId: string; unitLabel: string; propertyName: string; startDate: string; endDate: string; rent: number; guarantee: number; currency: "USD" | "CDF"; dueDay: number; frequency: string; status: ContractStatus; signedAt?: string; nextDueDate: string; noticePeriod: string; documents: { id: string; name: string; type: string; url?: string }[]; clauses: string[] };

export const contracts: Contract[] = [];
export const getContract = (id: string) => contracts.find((contract) => contract.id === id);
