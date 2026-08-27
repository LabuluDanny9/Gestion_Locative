export type TenantStatus = "current" | "partial" | "late" | "arrears";

export type TenantPayment = {
  id: string;
  period: string;
  amount: number;
  currency: "USD" | "CDF";
  paidAt: string;
  receipt: string;
  receiptId?: string;
  status: "paid" | "partial";
};

export type Tenant = {
  id: string;
  code: string;
  name: string;
  phone: string;
  email: string;
  propertyId: string;
  propertyName: string;
  unitId: string;
  unitLabel: string;
  rent: number;
  currency: "USD" | "CDF";
  nextDueDate: string;
  balance: number;
  guarantee: number;
  status: TenantStatus;
  contractStart: string;
  contractEnd: string;
  contractId: string;
  identityType: string;
  identityNumber: string;
  address: string;
  emergencyContact: string;
  payments: TenantPayment[];
};

export const tenants: Tenant[] = [
  {
    id: "jean-kabulo",
    code: "LOC-2026-0023",
    name: "Locataire Démo 01",
    phone: "+243 000 000 001",
    email: "locataire01@example.invalid",
    propertyId: "residence-grace",
    propertyName: "Résidence Grâce",
    unitId: "appartement-a03",
    unitLabel: "Appartement A03",
    rent: 350,
    currency: "USD",
    nextDueDate: "15 septembre 2026",
    balance: 0,
    guarantee: 700,
    status: "current",
    contractStart: "01 septembre 2026",
    contractEnd: "31 août 2027",
    contractId: "ctr-2026-0042",
    identityType: "Passeport",
    identityNumber: "DEMO-ID-001",
    address: "Adresse fictive 01, Lubumbashi",
    emergencyContact: "Contact Démo 01 · +243 000 100 001",
    payments: [
      { id: "pay-332", period: "Août 2026", amount: 350, currency: "USD", paidAt: "05 août 2026", receipt: "REC-2026-00332", receiptId: "rec-2026-00332", status: "paid" },
      { id: "pay-301", period: "Juillet 2026", amount: 350, currency: "USD", paidAt: "04 juillet 2026", receipt: "REC-2026-00301", receiptId: "rec-2026-00301", status: "paid" },
      { id: "pay-278", period: "Juin 2026", amount: 350, currency: "USD", paidAt: "06 juin 2026", receipt: "REC-2026-00278", status: "paid" },
    ],
  },
  {
    id: "grace-tshibangu",
    code: "LOC-2026-0018",
    name: "Locataire Démo 02",
    phone: "+243 000 000 002",
    email: "locataire02@example.invalid",
    propertyId: "residence-grace",
    propertyName: "Résidence Grâce",
    unitId: "studio-b01",
    unitLabel: "Studio B01",
    rent: 240,
    currency: "USD",
    nextDueDate: "10 septembre 2026",
    balance: 80,
    guarantee: 480,
    status: "partial",
    contractStart: "01 juillet 2026",
    contractEnd: "30 juin 2027",
    contractId: "ctr-2026-0031",
    identityType: "Carte d'électeur",
    identityNumber: "DEMO-ID-002",
    address: "Adresse fictive 02, Lubumbashi",
    emergencyContact: "Contact Démo 02 · +243 000 100 002",
    payments: [
      { id: "pay-329", period: "Août 2026", amount: 160, currency: "USD", paidAt: "08 août 2026", receipt: "REC-2026-00329", receiptId: "rec-2026-00329", status: "partial" },
      { id: "pay-297", period: "Juillet 2026", amount: 240, currency: "USD", paidAt: "09 juillet 2026", receipt: "REC-2026-00297", receiptId: "rec-2026-00297", status: "paid" },
    ],
  },
  {
    id: "patrick-mwamba",
    code: "LOC-2025-0096",
    name: "Locataire Démo 03",
    phone: "+243 000 000 003",
    email: "locataire03@example.invalid",
    propertyId: "villa-mwezi",
    propertyName: "Villa Mwezi",
    unitId: "villa-m01",
    unitLabel: "Villa M01",
    rent: 1200,
    currency: "USD",
    nextDueDate: "01 septembre 2026",
    balance: 1200,
    guarantee: 2400,
    status: "late",
    contractStart: "01 décembre 2025",
    contractEnd: "30 novembre 2026",
    contractId: "ctr-2025-0096",
    identityType: "Passeport",
    identityNumber: "DEMO-ID-003",
    address: "Adresse fictive 03, Lubumbashi",
    emergencyContact: "Contact Démo 03 · +243 000 100 003",
    payments: [{ id: "pay-263", period: "Juillet 2026", amount: 1200, currency: "USD", paidAt: "03 juillet 2026", receipt: "REC-2026-00263", receiptId: "rec-2026-00263", status: "paid" }],
  },
  {
    id: "amina-kasongo",
    code: "LOC-2025-0072",
    name: "Locataire Démo 04",
    phone: "+243 000 000 004",
    email: "locataire04@example.invalid",
    propertyId: "immeuble-upemba",
    propertyName: "Immeuble Upemba",
    unitId: "appartement-u12",
    unitLabel: "Appartement U12",
    rent: 420,
    currency: "USD",
    nextDueDate: "05 septembre 2026",
    balance: 840,
    guarantee: 840,
    status: "arrears",
    contractStart: "05 novembre 2025",
    contractEnd: "04 novembre 2026",
    contractId: "ctr-2026-0058",
    identityType: "Permis de conduire",
    identityNumber: "DEMO-ID-004",
    address: "Adresse fictive 04, Lubumbashi",
    emergencyContact: "Contact Démo 04 · +243 000 100 004",
    payments: [{ id: "pay-214", period: "Juin 2026", amount: 420, currency: "USD", paidAt: "11 juin 2026", receipt: "REC-2026-00214", status: "paid" }],
  },
];

export function getTenant(id: string) {
  return tenants.find((tenant) => tenant.id === id);
}

export function getTenantByCode(code: string) {
  return tenants.find((tenant) => tenant.code === code);
}
