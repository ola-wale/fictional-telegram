import { z } from "zod";
import {
  COMPANY_STATUSES,
  ENTITY_TYPES,
  FUNDING_STAGES,
  type NaicsReference,
} from "@/types/company";

export const directorSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name is required"),
  email: z.email("Valid email is required"),
  phone: z.string().min(1, "Phone is required").regex(/^\+?(?=.*\d.*\d.*\d)[\d\s\-()]{7,}$/, "Must be a valid phone number"),
});

export function createLocationSchema(validCountryCodes: readonly string[]) {
  return z.object({
    id: z.string(),
    name: z.string().min(1, "Location name is required"),
    addressLine1: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    region: z.string().min(1, "Region is required"),
    postalCode: z.string().min(1, "Postal code is required"),
    countryCode: z
      .string()
      .min(1, "Country code is required")
      .refine((val) => validCountryCodes.includes(val), {
        message: "Must be a valid ISO 3166-1 alpha-2 country code",
      }),
  });
}

export function createCompanySchema(
  naicsReference: NaicsReference[],
  validCountryCodes: readonly string[]
) {
  const validVerticals = naicsReference.map((n) => n.vertical);

  const locationSchema = createLocationSchema(validCountryCodes);

  return z
    .object({
      id: z.string(),
      name: z.string().min(1, "Company name is required"),
      legalName: z.string().min(1, "Legal name is required"),
      description: z.string().min(1, "Description is required"),
      websiteUrl: z.url("Must be a valid URL").refine(
        (url) => url.startsWith("http://") || url.startsWith("https://"),
        { message: "Must be an HTTP or HTTPS URL" }
      ),
      companyStatus: z.enum(COMPANY_STATUSES),
      entityType: z.enum(ENTITY_TYPES),
      vertical: z.string().refine((val) => validVerticals.includes(val), {
        message: "Must be a valid NAICS sector",
      }),
      subVertical: z.string().min(1, "Sub-vertical is required"),
      annualRevenueUsd: z.coerce
        .number({ message: "Must be a number" })
        .min(0, "Revenue must be non-negative"),
      fundingStage: z.enum(FUNDING_STAGES),
      ticker: z.string().nullable().transform((v) => (v === "" ? null : v)),
      stockExchange: z.string().nullable().transform((v) => (v === "" ? null : v)),
      parentCompanyId: z.string().nullable(),
      directors: z
        .array(directorSchema)
        .min(1, "At least one director is required"),
      locations: z
        .array(locationSchema)
        .min(1, "At least one location is required"),
    })
    .superRefine((data, ctx) => {
      const ref = naicsReference.find((n) => n.vertical === data.vertical);
      if (ref && !ref.subVerticals.includes(data.subVertical)) {
        ctx.addIssue({
          code: "custom",
          message: `"${data.subVertical}" is not a valid sub-vertical for "${data.vertical}"`,
          path: ["subVertical"],
        });
      }

      if (data.fundingStage === "public") {
        if (!data.ticker) {
          ctx.addIssue({
            code: "custom",
            message: "Ticker is required for public companies",
            path: ["ticker"],
          });
        }
        if (!data.stockExchange) {
          ctx.addIssue({
            code: "custom",
            message: "Stock exchange is required for public companies",
            path: ["stockExchange"],
          });
        }
      }
    });
}

export type CompanyFormValues = z.infer<ReturnType<typeof createCompanySchema>>;
