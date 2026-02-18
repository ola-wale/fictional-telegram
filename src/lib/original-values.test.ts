import { describe, it, expect } from "vitest";
import { getByPath, getOriginalValue, normalizeValue } from "./original-values";

describe("getByPath", () => {
  const obj = {
    name: "Acme",
    directors: [
      { id: "d1", name: "Alice", email: "alice@example.com" },
      { id: "d2", name: "Bob", email: "bob@example.com" },
    ],
    nested: { deep: { value: 42 } },
  };

  it("retrieves top-level field", () => {
    expect(getByPath(obj, "name")).toBe("Acme");
  });

  it("retrieves nested array element field", () => {
    expect(getByPath(obj, "directors.1.email")).toBe("bob@example.com");
  });

  it("retrieves deeply nested value", () => {
    expect(getByPath(obj, "nested.deep.value")).toBe(42);
  });

  it("returns undefined for missing path", () => {
    expect(getByPath(obj, "nonexistent.path")).toBeUndefined();
  });

  it("returns undefined for out-of-bounds index", () => {
    expect(getByPath(obj, "directors.5.name")).toBeUndefined();
  });
});

describe("getOriginalValue", () => {
  const original = {
    name: "Acme",
    directors: [
      { id: "d1", name: "Alice", email: "alice@example.com" },
      { id: "d2", name: "Bob", email: "bob@example.com" },
    ],
  };

  it("falls back to getByPath for non-array paths", () => {
    expect(getOriginalValue(original, "name", undefined)).toBe("Acme");
  });

  it("looks up array item by id instead of index", () => {
    expect(getOriginalValue(original, "directors.0.name", "d2")).toBe("Bob");
  });

  it("returns undefined for a new item not in original", () => {
    expect(getOriginalValue(original, "directors.2.name", "d-new")).toBeUndefined();
  });

  it("handles deleted items shifting indices", () => {
    expect(getOriginalValue(original, "directors.0.email", "d2")).toBe("bob@example.com");
  });
});

describe("normalizeValue", () => {
  it("treats null and undefined as empty", () => {
    expect(normalizeValue(null)).toBe("");
    expect(normalizeValue(undefined)).toBe("");
  });

  it("treats empty string as empty", () => {
    expect(normalizeValue("")).toBe("");
  });

  it("normalizes number and equivalent string to same value", () => {
    expect(normalizeValue(1234)).toBe(normalizeValue("1234"));
  });

  it("normalizes trailing dot during typing", () => {
    expect(normalizeValue("1234.")).toBe("1234");
  });

  it("preserves decimal values", () => {
    expect(normalizeValue("1234.5")).toBe("1234.5");
  });

  it("passes through non-numeric strings", () => {
    expect(normalizeValue("hello")).toBe("hello");
  });
});
