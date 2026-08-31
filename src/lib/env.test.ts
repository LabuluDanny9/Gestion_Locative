import { describe, expect, it } from "vitest";

import { parseServerEnv } from "./env";

describe("parseServerEnv", () => {
  it("applique les valeurs metier par defaut sans exiger les secrets en Phase 1", () => {
    const environment = parseServerEnv({});

    expect(environment.APP_TIMEZONE).toBe("Africa/Lubumbashi");
    expect(environment.DEFAULT_CURRENCY).toBe("USD");
    expect(environment.SUPABASE_SECRET_KEY).toBeUndefined();
    expect(environment.DEFAULT_PHONE_COUNTRY_CODE).toBe("243");
  });

  it("valide la version Graph API et l’identifiant SIM", () => {
    const environment = parseServerEnv({
      WHATSAPP_GRAPH_API_VERSION: "v23.0",
      TEXTBEE_SIM_SUBSCRIPTION_ID: "2",
    });
    expect(environment.WHATSAPP_GRAPH_API_VERSION).toBe("v23.0");
    expect(environment.TEXTBEE_SIM_SUBSCRIPTION_ID).toBe(2);
  });

  it("refuse une URL publique invalide", () => {
    expect(() =>
      parseServerEnv({ NEXT_PUBLIC_SUPABASE_URL: "supabase-invalide" }),
    ).toThrow();
  });
});
