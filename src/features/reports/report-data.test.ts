import { describe, expect, it } from "vitest";

import { createReportData, parseReportFilters, type ReportInput } from "./report-data";

const input: ReportInput = {
  properties: [{ id: "property-1", name: "Résidence", type: "Résidence", city: "Lubumbashi", address: "Centre", units: 1, occupied: 1, available: 0, monthlyRevenue: 300, currency: "USD", buildings: 1, floors: 1, status: "active", image: "", description: "" }],
  units: [{ id: "unit-1", code: "A1", type: "Appartement", propertyId: "property-1", propertyName: "Résidence", building: "A", floor: "1", bedrooms: 1, livingRooms: 1, bathrooms: 1, kitchens: 1, area: 40, rent: 300, currency: "USD", status: "occupied", image: "" }],
  tenants: [{ id: "tenant-1", code: "LOC-1", name: "Client Test", phone: "+243000000000", email: "", propertyId: "property-1", propertyName: "Résidence", unitId: "unit-1", unitLabel: "A1", rent: 300, currency: "USD", nextDueDate: "05/09/2026", balance: 100, guarantee: 300, status: "partial", contractStart: "01/01/2026", contractEnd: "—", contractId: "lease-1", identityType: "—", identityNumber: "—", address: "—", emergencyContact: "—", payments: [], documents: [] }],
  payments: [{ id: "payment-1", reference: "PAY-1", receiptId: "receipt-1", receiptNumber: "REC-1", tenantId: "tenant-1", tenantName: "Client Test", unitId: "unit-1", unitLabel: "A1", propertyName: "Résidence", period: "septembre 2026", amount: 200, currency: "USD", mode: "cash", date: "02/09/2026", paidAtIso: "2026-09-02T08:00:00Z", time: "08:00", status: "partial", agent: "Agent", balanceBefore: 300, balanceAfter: 100, allocations: [{ period: "septembre 2026", amount: 200 }] }],
  invoices: [{ id: "invoice-1", reference: "ECH-1", leaseId: "lease-1", tenantId: "tenant-1", tenantName: "Client Test", unitId: "unit-1", unitLabel: "A1", propertyName: "Résidence", period: "septembre 2026", periodStart: "2026-09-01", periodEnd: "2026-09-30", dueDate: "05/09/2026", dueDateIso: "2026-09-05", amountDue: 300, amountPaid: 200, balance: 100, currency: "USD", status: "partial", daysLate: 0 }],
  arrears: [{ id: "arrears-1", tenantId: "tenant-1", tenantName: "Client Test", phone: "+243000000000", leaseId: "lease-1", unitId: "unit-1", unitLabel: "A1", propertyId: "property-1", propertyName: "Résidence", currency: "USD", totalBalance: 100, invoiceCount: 1, oldestDueDate: "2026-09-05", maximumDaysLate: 10, installments: [] }],
};

describe("rapports financiers", () => {
  it("calcule les indicateurs dans une seule devise sans données de démonstration", () => {
    const data = createReportData(input, { startDate: "2026-09-01", endDate: "2026-09-30", currency: "USD" });
    expect(data.summary).toMatchObject({ expected: 300, collected: 200, outstanding: 100, arrears: 100, paymentCount: 1, partialCount: 1 });
    expect(data.summary.recovery).toBeCloseTo(66.67, 1);
    expect(data.propertyRows).toHaveLength(1);
    expect(data.tenantRows).toHaveLength(1);
  });

  it("normalise une période inversée et refuse une devise inconnue", () => {
    expect(parseReportFilters({ debut: "2026-09-30", fin: "2026-09-01", devise: "EUR" }, new Date("2026-09-15T00:00:00Z"))).toMatchObject({ startDate: "2026-09-01", endDate: "2026-09-30", currency: "USD" });
  });
});
