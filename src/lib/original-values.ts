import { createContext, useContext } from "react";
import type { CompanyFormValues } from "@/lib/validation";

const OriginalValuesContext = createContext<CompanyFormValues | null>(null);

export const OriginalValuesProvider = OriginalValuesContext.Provider;

export function useOriginalValues(): CompanyFormValues | null {
  return useContext(OriginalValuesContext);
}

/**
 * Normalize a value for comparison so that different representations
 * of the same data (e.g. 1234 vs "1234" vs "1234.") are treated as equal.
 */
export function normalizeValue(v: unknown): string {
  if (v == null || v === "") return "";
  const s = String(v);
  const n = Number(s);
  return !isNaN(n) && isFinite(n) ? String(n) : s;
}

/**
 * Retrieve a value from the original data by dot-notation path.
 * Supports paths like "name", "directors.0.email", "locations.2.city".
 */
export function getByPath(obj: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc == null || typeof acc !== "object") return undefined;
    if (!Object.hasOwn(acc as object, key)) return undefined;
    return (acc as Record<string, unknown>)[key];
  }, obj);
}

const ARRAY_ITEM_RE = /^(\w+)\.(\d+)\.(.+)$/;

/**
 * Like getByPath, but for array item paths (e.g. "directors.0.name")
 * looks up the original item by id instead of index. This prevents
 * false "edited" flags when items are added or removed.
 */
export function getOriginalValue(
  original: Record<string, unknown>,
  fieldPath: string,
  currentId: string | undefined,
): unknown {
  const match = fieldPath.match(ARRAY_ITEM_RE);
  if (match && currentId) {
    const [, arrayName, , fieldName] = match;
    const array = original[arrayName];
    if (Array.isArray(array)) {
      const item = array.find(
        (entry: Record<string, unknown>) => entry.id === currentId
      );
      if (item) return getByPath(item as Record<string, unknown>, fieldName);
      return undefined;
    }
  }
  return getByPath(original, fieldPath);
}
