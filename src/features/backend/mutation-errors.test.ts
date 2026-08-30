import { describe, expect, it } from "vitest";

import { mutationMessage } from "./mutation-errors";

describe("mutationMessage", () => {
  it("reads PostgREST errors even though they are not Error instances", () => {
    expect(mutationMessage({
      code: "PGRST202",
      message: "Could not find the function public.create_open_lease_and_invoices in the schema cache",
    })).toBe("Le service de création du contrat est indisponible. Actualisez la page puis réessayez.");
  });

  it("maps database permission errors", () => {
    expect(mutationMessage({ code: "42501", message: "Insufficient permission" }))
      .toBe("Votre compte ne possède pas l’autorisation requise.");
  });
});
