import { describe, it, expect } from "vitest";
import { createCompanySchema, directorSchema, createLocationSchema } from "./validation";
import type { NaicsReference } from "@/types/company";

const naicsReference: NaicsReference[] = [
  { vertical: "Finance and Insurance", subVerticals: ["Insurance Agencies and Brokerages", "Real Estate Credit"] },
  { vertical: "Utilities", subVerticals: ["Electric Power Distribution"] },
];

const countryCodes = ["US", "SE", "GB"] as const;

const schema = createCompanySchema(naicsReference, countryCodes);

function validCompany(overrides: Record<string, unknown> = {}) {
  return {
    id: "c1",
    name: "Acme Corp",
    legalName: "Acme Corporation Inc.",
    description: "A test company",
    websiteUrl: "https://acme.example.com",
    companyStatus: "active",
    entityType: "Corporation",
    vertical: "Finance and Insurance",
    subVertical: "Insurance Agencies and Brokerages",
    annualRevenueUsd: 1000000,
    fundingStage: "series-a",
    ticker: null,
    stockExchange: null,
    parentCompanyId: null,
    directors: [{ id: "d1", name: "Jane Doe", email: "jane@example.com", phone: "+1-555-000-1234" }],
    locations: [{ id: "l1", name: "HQ", addressLine1: "123 Main St", city: "NYC", region: "NY", postalCode: "10001", countryCode: "US" }],
    ...overrides,
  };
}

describe("createCompanySchema", () => {
  it("accepts valid company data", () => {
    const result = schema.safeParse(validCompany());
    expect(result.success).toBe(true);
  });

  it("rejects empty company name", () => {
    const result = schema.safeParse(validCompany({ name: "" }));
    expect(result.success).toBe(false);
  });

  it("rejects invalid website URL", () => {
    const result = schema.safeParse(validCompany({ websiteUrl: "not-a-url" }));
    expect(result.success).toBe(false);
  });

  it("rejects ftp:// URLs", () => {
    const result = schema.safeParse(validCompany({ websiteUrl: "ftp://files.example.com" }));
    expect(result.success).toBe(false);
  });

  it("coerces string revenue to number", () => {
    const result = schema.safeParse(validCompany({ annualRevenueUsd: "500000" }));
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.annualRevenueUsd).toBe(500000);
    }
  });

  it("rejects negative revenue", () => {
    const result = schema.safeParse(validCompany({ annualRevenueUsd: -1 }));
    expect(result.success).toBe(false);
  });

  it("rejects mismatched vertical/subVertical", () => {
    const result = schema.safeParse(validCompany({ vertical: "Utilities", subVertical: "Insurance Agencies and Brokerages" }));
    expect(result.success).toBe(false);
  });

  it("accepts valid vertical/subVertical pairing", () => {
    const result = schema.safeParse(validCompany({ vertical: "Utilities", subVertical: "Electric Power Distribution" }));
    expect(result.success).toBe(true);
  });

  it("requires ticker and stockExchange for public companies", () => {
    const result = schema.safeParse(validCompany({ fundingStage: "public", ticker: null, stockExchange: null }));
    expect(result.success).toBe(false);
    if (!result.success) {
      const paths = result.error.issues.map((i) => i.path.join("."));
      expect(paths).toContain("ticker");
      expect(paths).toContain("stockExchange");
    }
  });

  it("accepts public company with ticker and exchange", () => {
    const result = schema.safeParse(validCompany({ fundingStage: "public", ticker: "ACME", stockExchange: "NYSE" }));
    expect(result.success).toBe(true);
  });

  it("requires at least one director", () => {
    const result = schema.safeParse(validCompany({ directors: [] }));
    expect(result.success).toBe(false);
  });

  it("requires at least one location", () => {
    const result = schema.safeParse(validCompany({ locations: [] }));
    expect(result.success).toBe(false);
  });

  it("transforms empty ticker string to null", () => {
    const result = schema.safeParse(validCompany({ ticker: "" }));
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.ticker).toBeNull();
    }
  });
});

describe("directorSchema", () => {
  it("accepts valid director", () => {
    const result = directorSchema.safeParse({ id: "d1", name: "Jane", email: "j@x.com", phone: "+1-555-1234" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid email", () => {
    const result = directorSchema.safeParse({ id: "d1", name: "Jane", email: "bad", phone: "+1-555-1234" });
    expect(result.success).toBe(false);
  });

  it("rejects invalid phone", () => {
    const result = directorSchema.safeParse({ id: "d1", name: "Jane", email: "j@x.com", phone: "ab" });
    expect(result.success).toBe(false);
  });
});

describe("createLocationSchema", () => {
  const locationSchema = createLocationSchema(countryCodes);

  it("accepts valid location", () => {
    const result = locationSchema.safeParse({ id: "l1", name: "HQ", addressLine1: "1 St", city: "NYC", region: "NY", postalCode: "10001", countryCode: "US" });
    expect(result.success).toBe(true);
  });

  it("rejects invalid country code", () => {
    const result = locationSchema.safeParse({ id: "l1", name: "HQ", addressLine1: "1 St", city: "NYC", region: "NY", postalCode: "10001", countryCode: "ZZ" });
    expect(result.success).toBe(false);
  });
});
