export interface Director {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Location {
  id: string;
  name: string;
  addressLine1: string;
  city: string;
  region: string;
  postalCode: string;
  countryCode: string;
}

export const COMPANY_STATUSES = [
  "active",
  "inactive",
  "pending",
  "dissolved",
] as const;
export type CompanyStatus = (typeof COMPANY_STATUSES)[number];

export const ENTITY_TYPES = [
  "Corporation",
  "LLC",
  "Partnership",
  "Sole Proprietorship",
  "Non-Profit",
] as const;
export type EntityType = (typeof ENTITY_TYPES)[number];

export const FUNDING_STAGES = [
  "pre-seed",
  "seed",
  "series-a",
  "series-b",
  "series-c",
  "series-d",
  "series-e",
  "public",
  "private-equity",
  "bootstrapped",
] as const;
export type FundingStage = (typeof FUNDING_STAGES)[number];

export interface Company {
  id: string;
  name: string;
  legalName: string;
  description: string;
  websiteUrl: string;
  companyStatus: CompanyStatus;
  entityType: EntityType;
  vertical: string;
  subVertical: string;
  annualRevenueUsd: number;
  fundingStage: FundingStage;
  ticker: string | null;
  stockExchange: string | null;
  parentCompanyId: string | null;
  directors: Director[];
  locations: Location[];
}

export interface NaicsReference {
  vertical: string;
  subVerticals: string[];
}
