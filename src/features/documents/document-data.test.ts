import { describe, expect, it } from "vitest";

import { formatFileSize, parseDocumentFilters } from "./document-data";

describe("document filters", () => {
  it("keeps supported filters and trims search text", () => {
    expect(parseDocumentFilters({ q: "  bail  ", type: "lease_document", lien: "lease" })).toEqual({
      query: "bail",
      kind: "lease_document",
      link: "lease",
    });
  });

  it("ignores unknown filter values", () => {
    expect(parseDocumentFilters({ type: "fake", lien: "fake" })).toEqual({ query: "", kind: undefined, link: undefined });
  });
});

describe("file sizes", () => {
  it("formats storage sizes for the French interface", () => {
    expect(formatFileSize(1536)).toBe("2 Ko");
    expect(formatFileSize(1_572_864)).toBe("1,5 Mo");
  });
});
