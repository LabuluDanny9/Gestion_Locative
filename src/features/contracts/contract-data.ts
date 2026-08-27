export type ContractStatus = "active" | "expiring" | "draft" | "expired";

export type Contract = {
  id: string;
  reference: string;
  tenantId: string;
  tenantName: string;
  unitId: string;
  unitLabel: string;
  propertyName: string;
  startDate: string;
  endDate: string;
  rent: number;
  guarantee: number;
  currency: "USD" | "CDF";
  dueDay: number;
  frequency: string;
  status: ContractStatus;
  signedAt?: string;
  nextDueDate: string;
  noticePeriod: string;
  documents: { id: string; name: string; type: string }[];
  clauses: string[];
};

export const contracts: Contract[] = [
  {
    id: "ctr-2026-0042", reference: "CTR-2026-0042", tenantId: "jean-kabulo", tenantName: "Locataire Démo 01", unitId: "appartement-a03", unitLabel: "Appartement A03", propertyName: "Résidence Grâce", startDate: "01 septembre 2026", endDate: "31 août 2027", rent: 350, guarantee: 700, currency: "USD", dueDay: 15, frequency: "Mensuel", status: "active", signedAt: "24 août 2026", nextDueDate: "15 septembre 2026", noticePeriod: "30 jours", documents: [{ id: "doc-1", name: "Contrat signé.pdf", type: "Contrat" }, { id: "doc-2", name: "État des lieux.pdf", type: "Annexe" }], clauses: ["Loyer payable au plus tard le 15 de chaque mois.", "Garantie équivalente à deux mois de loyer.", "Usage exclusivement résidentiel."],
  },
  {
    id: "ctr-2026-0031", reference: "CTR-2026-0031", tenantId: "grace-tshibangu", tenantName: "Locataire Démo 02", unitId: "studio-b01", unitLabel: "Studio B01", propertyName: "Résidence Grâce", startDate: "01 juillet 2026", endDate: "30 juin 2027", rent: 240, guarantee: 480, currency: "USD", dueDay: 10, frequency: "Mensuel", status: "active", signedAt: "28 juin 2026", nextDueDate: "10 septembre 2026", noticePeriod: "30 jours", documents: [{ id: "doc-3", name: "Bail démo 02.pdf", type: "Contrat" }], clauses: ["Loyer payable au plus tard le 10 de chaque mois.", "Eau comprise dans le montant mensuel."],
  },
  {
    id: "ctr-2025-0096", reference: "CTR-2025-0096", tenantId: "patrick-mwamba", tenantName: "Locataire Démo 03", unitId: "villa-m01", unitLabel: "Villa M01", propertyName: "Villa Mwezi", startDate: "01 décembre 2025", endDate: "30 novembre 2026", rent: 1200, guarantee: 2400, currency: "USD", dueDay: 1, frequency: "Mensuel", status: "expiring", signedAt: "20 novembre 2025", nextDueDate: "01 septembre 2026", noticePeriod: "60 jours", documents: [{ id: "doc-4", name: "Contrat Villa Mwezi.pdf", type: "Contrat" }], clauses: ["Entretien du jardin à charge du locataire.", "Préavis de soixante jours avant départ."],
  },
  {
    id: "ctr-2026-0058", reference: "CTR-2026-0058", tenantId: "amina-kasongo", tenantName: "Locataire Démo 04", unitId: "appartement-u12", unitLabel: "Appartement U12", propertyName: "Immeuble Upemba", startDate: "05 septembre 2026", endDate: "04 septembre 2027", rent: 420, guarantee: 840, currency: "USD", dueDay: 5, frequency: "Mensuel", status: "draft", nextDueDate: "05 septembre 2026", noticePeriod: "30 jours", documents: [], clauses: ["Contrat en attente de signature des parties."],
  },
];

export function getContract(id: string) {
  return contracts.find((contract) => contract.id === id);
}
