import { useEffect, useMemo, useRef, useState } from "react";
import { useFormContext, useWatch, Controller } from "react-hook-form";
import { Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FormField } from "@/components/shared/FormField";
import { formatRevenueFull, formatStatusLabel } from "@/lib/format";
import {
  COMPANY_STATUSES,
  ENTITY_TYPES,
  FUNDING_STAGES,
  type NaicsReference,
} from "@/types/company";
import type { CompanyFormValues } from "@/lib/validation";

interface CompanyProfileSectionProps {
  naicsReference: NaicsReference[];
}

export function CompanyProfileSection({
  naicsReference,
}: CompanyProfileSectionProps) {
  const {
    register,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useFormContext<CompanyFormValues>();

  const vertical = useWatch({ control, name: "vertical" });
  const fundingStage = useWatch({ control, name: "fundingStage" });
  const isPublic = fundingStage === "public";

  const subVerticals = useMemo(
    () => naicsReference.find((n) => n.vertical === vertical)?.subVerticals ?? [],
    [naicsReference, vertical]
  );

  const [revenueFocused, setRevenueFocused] = useState(false);

  const prevVerticalRef = useRef(vertical);
  useEffect(() => {
    if (prevVerticalRef.current !== vertical) {
      prevVerticalRef.current = vertical;
      const currentSub = getValues("subVertical");
      if (currentSub && !subVerticals.includes(currentSub)) {
        setValue("subVertical", "", { shouldValidate: true, shouldDirty: true });
      }
    }
  }, [vertical, subVerticals, getValues, setValue]);

  const prevIsPublicRef = useRef(isPublic);
  useEffect(() => {
    if (prevIsPublicRef.current && !isPublic) {
      setValue("ticker", null, { shouldDirty: true });
      setValue("stockExchange", null, { shouldDirty: true });
    }
    prevIsPublicRef.current = isPublic;
  }, [isPublic, setValue]);

  return (
    <section aria-labelledby="profile-heading" className="space-y-4">
      <div className="flex items-center gap-2">
        <Building2 className="h-5 w-5 text-muted-foreground" />
        <h2 id="profile-heading" className="text-lg font-semibold">Company Profile</h2>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Identity
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Company Name" htmlFor="name" error={errors.name?.message} fieldPath="name">
              <Input id="name" {...register("name")} aria-invalid={!!errors.name} aria-describedby={errors.name ? "name-error" : undefined} />
            </FormField>

            <FormField label="Legal Name" htmlFor="legalName" error={errors.legalName?.message} fieldPath="legalName">
              <Input id="legalName" {...register("legalName")} aria-invalid={!!errors.legalName} aria-describedby={errors.legalName ? "legalName-error" : undefined} />
            </FormField>

            <FormField label="Description" htmlFor="description" error={errors.description?.message} fieldPath="description" className="sm:col-span-2">
              <Textarea id="description" {...register("description")} rows={3} aria-invalid={!!errors.description} aria-describedby={errors.description ? "description-error" : undefined} />
            </FormField>

            <FormField label="Website URL" htmlFor="websiteUrl" error={errors.websiteUrl?.message} fieldPath="websiteUrl">
              <Input id="websiteUrl" type="url" {...register("websiteUrl")} placeholder="https://" aria-invalid={!!errors.websiteUrl} aria-describedby={errors.websiteUrl ? "websiteUrl-error" : undefined} />
            </FormField>

            <FormField label="Company Status" htmlFor="companyStatus-trigger" error={errors.companyStatus?.message} fieldPath="companyStatus">
              <Controller
                control={control}
                name="companyStatus"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(val) => { field.onChange(val); field.onBlur(); }}>
                    <SelectTrigger id="companyStatus-trigger" aria-invalid={!!errors.companyStatus} aria-describedby={errors.companyStatus ? "companyStatus-trigger-error" : undefined}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {COMPANY_STATUSES.map((s) => (
                        <SelectItem key={s} value={s}>
                          {formatStatusLabel(s)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField label="Entity Type" htmlFor="entityType-trigger" error={errors.entityType?.message} fieldPath="entityType">
              <Controller
                control={control}
                name="entityType"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(val) => { field.onChange(val); field.onBlur(); }}>
                    <SelectTrigger id="entityType-trigger" aria-invalid={!!errors.entityType} aria-describedby={errors.entityType ? "entityType-trigger-error" : undefined}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ENTITY_TYPES.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Industry Classification
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Vertical" htmlFor="vertical-trigger" error={errors.vertical?.message} fieldPath="vertical">
              <Controller
                control={control}
                name="vertical"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(val) => { field.onChange(val); field.onBlur(); }}>
                    <SelectTrigger id="vertical-trigger" aria-invalid={!!errors.vertical} aria-describedby={errors.vertical ? "vertical-trigger-error" : undefined}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {naicsReference.map((n) => (
                        <SelectItem key={n.vertical} value={n.vertical}>
                          {n.vertical}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            <FormField label="Sub-Vertical" htmlFor="subVertical-trigger" error={errors.subVertical?.message} fieldPath="subVertical">
              <Controller
                control={control}
                name="subVertical"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(val) => { field.onChange(val); field.onBlur(); }}
                    disabled={subVerticals.length === 0}
                  >
                    <SelectTrigger id="subVertical-trigger" aria-invalid={!!errors.subVertical} aria-describedby={errors.subVertical ? "subVertical-trigger-error" : undefined}>
                      <SelectValue placeholder="Select sub-vertical" />
                    </SelectTrigger>
                    <SelectContent>
                      {subVerticals.map((sv) => (
                        <SelectItem key={sv} value={sv}>
                          {sv}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Financials
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid gap-6 sm:grid-cols-2">
            <FormField label="Annual Revenue (USD)" htmlFor="annualRevenueUsd" error={errors.annualRevenueUsd?.message} fieldPath="annualRevenueUsd">
              <Controller
                control={control}
                name="annualRevenueUsd"
                render={({ field }) => (
                  <Input
                    id="annualRevenueUsd"
                    type="text"
                    inputMode="numeric"
                    aria-description="Displays formatted currency when not focused"
                    aria-invalid={!!errors.annualRevenueUsd}
                    aria-describedby={errors.annualRevenueUsd ? "annualRevenueUsd-error" : undefined}
                    value={
                      revenueFocused
                        ? (field.value ?? "")
                        : typeof field.value === "number" && field.value > 0
                          ? formatRevenueFull(field.value)
                          : field.value ?? ""
                    }
                    onChange={(e) => {
                      const stripped = e.target.value.replace(/[^0-9.]/g, "");
                      const parts = stripped.split(".");
                      const raw = parts[0] + (parts.length > 1 ? "." + parts.slice(1).join("") : "");
                      field.onChange(raw);
                    }}
                    onFocus={() => setRevenueFocused(true)}
                    onBlur={() => {
                      setRevenueFocused(false);
                      const raw = String(field.value ?? "").trim();
                      if (raw !== "") {
                        const num = Number(raw);
                        if (!isNaN(num)) field.onChange(num);
                      }
                      field.onBlur();
                    }}
                  />
                )}
              />
            </FormField>

            <FormField label="Funding Stage" htmlFor="fundingStage-trigger" error={errors.fundingStage?.message} fieldPath="fundingStage">
              <Controller
                control={control}
                name="fundingStage"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={(val) => { field.onChange(val); field.onBlur(); }}>
                    <SelectTrigger id="fundingStage-trigger" aria-invalid={!!errors.fundingStage} aria-describedby={errors.fundingStage ? "fundingStage-trigger-error" : undefined}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FUNDING_STAGES.map((f) => (
                        <SelectItem key={f} value={f}>
                          {formatStatusLabel(f)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormField>

            {isPublic && (
              <FormField label="Ticker" htmlFor="ticker" error={errors.ticker?.message} fieldPath="ticker">
                <Controller
                  control={control}
                  name="ticker"
                  render={({ field }) => (
                    <Input
                      id="ticker"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      onBlur={field.onBlur}
                      placeholder="e.g. AAPL"
                      aria-invalid={!!errors.ticker}
                      aria-describedby={errors.ticker ? "ticker-error" : undefined}
                    />
                  )}
                />
              </FormField>
            )}

            {isPublic && (
              <FormField label="Stock Exchange" htmlFor="stockExchange" error={errors.stockExchange?.message} fieldPath="stockExchange">
                <Controller
                  control={control}
                  name="stockExchange"
                  render={({ field }) => (
                    <Input
                      id="stockExchange"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      onBlur={field.onBlur}
                      placeholder="e.g. NYSE"
                      aria-invalid={!!errors.stockExchange}
                      aria-describedby={errors.stockExchange ? "stockExchange-error" : undefined}
                    />
                  )}
                />
              </FormField>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
