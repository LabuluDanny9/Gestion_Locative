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
    name: "Jean Kabulo",
    phone: "+243 970 123 456",
    email: "jean.kabulo@email.com",
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
    identityNumber: "OP-0912846",
    address: "Quartier Golf, Lubumbashi",
    emergencyContact: "Cécile Kabulo · +243 991 020 304",
    payments: [
      { id: "pay-332", period: "Août 2026", amount: 350, currency: "USD", paidAt: "05 août 2026", receipt: "REC-2026-00332", receiptId: "rec-2026-00332", status: "paid" },
      { id: "pay-301", period: "Juillet 2026", amount: 350, currency: "USD", paidAt: "04 juillet 2026", receipt: "REC-2026-00301", receiptId: "rec-2026-00301", status: "paid" },
      { id: "pay-278", period: "Juin 2026", amount: 350, currency: "USD", paidAt: "06 juin 2026", receipt: "REC-2026-00278", status: "paid" },
    ],
  },
  {
    id: "grace-tshibangu",
    code: "LOC-2026-0018",
    name: "Grâce Tshibangu",
    phone: "+243 998 445 182",
    email: "grace.tshibangu@email.com",
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
    identityNumber: "CD-20877411",
    address: "Kamalondo, Lubumbashi",
    emergencyContact: "David Tshibangu · +243 971 112 030",
    payments: [
      { id: "pay-329", period: "Août 2026", amount: 160, currency: "USD", paidAt: "08 août 2026", receipt: "REC-2026-00329", receiptId: "rec-2026-00329", status: "partial" },
      { id: "pay-297", period: "Juillet 2026", amount: 240, currency: "USD", paidAt: "09 juillet 2026", receipt: "REC-2026-00297", receiptId: "rec-2026-00297", status: "paid" },
    ],
  },
  {
    id: "patrick-mwamba",
    code: "LOC-2025-0096",
    name: "Patrick Mwamba",
    phone: "+243 821 330 541",
    email: "patrick.mwamba@email.com",
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
    identityNumber: "OP-0756320",
    address: "Golf Météo, Lubumbashi",
    emergencyContact: "Sarah Mwamba · +243 978 552 104",
    payments: [{ id: "pay-263", period: "Juillet 2026", amount: 1200, currency: "USD", paidAt: "03 juillet 2026", receipt: "REC-2026-00263", receiptId: "rec-2026-00263", status: "paid" }],
  },
  {
    id: "amina-kasongo",
    code: "LOC-2025-0072",
    name: "Amina Kasongo",
    phone: "+243 990 710 228",
    email: "amina.kasongo@email.com",
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
    identityNumber: "PC-882041",
    address: "Manika, Kolwezi",
    emergencyContact: "Hassan Kasongo · +243 812 009 714",
    payments: [{ id: "pay-214", period: "Juin 2026", amount: 420, currency: "USD", paidAt: "11 juin 2026", receipt: "REC-2026-00214", status: "paid" }],
  },
];

export function getTenant(id: string) {
  return tenants.find((tenant) => tenant.id === id);
}

export function getTenantByCode(code: string) {
  return tenants.find((tenant) => tenant.code === code);
}
