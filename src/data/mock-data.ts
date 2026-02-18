import { z } from "zod";
import type { Company, NaicsReference } from "@/types/company";
import rawData from "./mock-data.json";

const data = rawData as { naicsReference: NaicsReference[]; companies: Company[] };
export const { naicsReference, companies } = data;

// Dev-only: validate mock data shape on load
if (import.meta.env.DEV) {
  const companyShape = z.object({
    id: z.string(),
    name: z.string(),
    legalName: z.string(),
    directors: z.array(z.object({ id: z.string(), name: z.string() })).min(1),
    locations: z.array(z.object({ id: z.string(), name: z.string() })).min(1),
  });
  const mockDataShape = z.object({
    naicsReference: z.array(z.object({ vertical: z.string(), subVerticals: z.array(z.string()) })),
    companies: z.array(companyShape),
  });
  const result = mockDataShape.safeParse(rawData);
  if (!result.success) {
    console.error("Mock data validation failed:", result.error.issues);
  }
}
