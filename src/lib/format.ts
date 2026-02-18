const compactFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

const fullFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

export function formatRevenue(value: number): string {
  return compactFormatter.format(value);
}

export function formatRevenueFull(value: number): string {
  return fullFormatter.format(value);
}

export function formatStatusLabel(value: string): string {
  return value
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
