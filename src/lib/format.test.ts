import { describe, it, expect } from "vitest";
import { formatRevenue, formatRevenueFull, formatStatusLabel } from "./format";

describe("formatRevenue", () => {
  it("formats millions with compact notation", () => {
    expect(formatRevenue(500_000_000)).toBe("$500M");
  });

  it("formats thousands with compact notation", () => {
    expect(formatRevenue(50_000)).toBe("$50K");
  });

  it("formats zero", () => {
    expect(formatRevenue(0)).toBe("$0");
  });
});

describe("formatRevenueFull", () => {
  it("formats with full dollar amount", () => {
    expect(formatRevenueFull(1234567)).toBe("$1,234,567");
  });

  it("formats zero", () => {
    expect(formatRevenueFull(0)).toBe("$0");
  });
});

describe("formatStatusLabel", () => {
  it("capitalizes single word", () => {
    expect(formatStatusLabel("active")).toBe("Active");
  });

  it("replaces hyphens and capitalizes each word", () => {
    expect(formatStatusLabel("series-a")).toBe("Series A");
  });

  it("handles private-equity", () => {
    expect(formatStatusLabel("private-equity")).toBe("Private Equity");
  });
});
