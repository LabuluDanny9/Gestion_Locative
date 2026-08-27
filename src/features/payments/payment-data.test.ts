import { describe, expect, it } from "vitest";

import { getPayment, getReceipt, payments } from "./payment-data";

describe("payment demo data", () => {
  it("links payments and receipts", () => {
    const payment = getPayment("pay-2026-00332");
    expect(getReceipt(payment?.receiptId ?? "")?.reference).toBe(payment?.reference);
  });

  it("keeps allocations and balances coherent", () => {
    expect(payments.every((payment) => payment.allocations.reduce((sum, allocation) => sum + allocation.amount, 0) === payment.amount)).toBe(true);
    expect(payments.every((payment) => payment.balanceAfter >= 0)).toBe(true);
  });
});
