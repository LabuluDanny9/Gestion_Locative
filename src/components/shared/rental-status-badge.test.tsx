import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RentalStatusBadge, rentalStatuses } from "./rental-status-badge";

describe("RentalStatusBadge", () => {
  it.each(Object.entries(rentalStatuses))(
    "affiche le libellé du statut %s",
    (status, config) => {
      render(
        <RentalStatusBadge status={status as keyof typeof rentalStatuses} />,
      );

      expect(screen.getByText(config.label)).toHaveAttribute("data-status", status);
    },
  );
});
