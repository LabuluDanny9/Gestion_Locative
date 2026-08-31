import { describe, expect, it } from "vitest";

import { filterNotifications, type NotificationRow } from "./notification-data";

const base: NotificationRow = {
  id: "00000000-0000-4000-8000-000000000001",
  organization_id: "00000000-0000-4000-8000-000000000002",
  recipient_user_id: "00000000-0000-4000-8000-000000000003",
  tenant_id: null,
  notification_type: "system",
  title: "Alerte",
  body: "Message",
  metadata: {},
  scheduled_at: null,
  read_at: null,
  created_at: "2026-08-31T10:00:00.000Z",
  updated_at: "2026-08-31T10:00:00.000Z",
};

describe("filterNotifications", () => {
  it("filtre les notifications non lues sans inventer de ligne", () => {
    const read = { ...base, id: "00000000-0000-4000-8000-000000000004", read_at: "2026-08-31T11:00:00.000Z" };
    expect(filterNotifications([base, read], "unread", "all")).toEqual([base]);
  });

  it("filtre par type métier", () => {
    const payment = { ...base, id: "00000000-0000-4000-8000-000000000005", notification_type: "payment_received" as const };
    expect(filterNotifications([base, payment], "all", "payment_received")).toEqual([payment]);
  });
});
