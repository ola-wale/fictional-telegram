import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useForm, useWatch, FormProvider, type Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";
import type { ZodType } from "zod";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OriginalValuesProvider } from "@/lib/original-values";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { CompanyProfileSection } from "@/components/profile/CompanyProfileSection";
import { DirectorsSection } from "@/components/directors/DirectorsSection";
import { LocationsSection } from "@/components/locations/LocationsSection";
import { ExportButton } from "./ExportButton";
import type { CompanyFormValues } from "@/lib/validation";
import { exportCompanyAsJson } from "@/lib/export";
import { formatRevenue, formatStatusLabel } from "@/lib/format";
import type { Company, NaicsReference, CompanyStatus } from "@/types/company";

const STATUS_COLORS: Record<CompanyStatus, string> = {
  active: "bg-emerald-100 text-emerald-800",
  inactive: "bg-gray-100 text-gray-600",
  pending: "bg-amber-100 text-amber-800",
  dissolved: "bg-red-100 text-red-700",
};

interface CompanyReviewPageProps {
  company: Company;
  schema: ZodType<CompanyFormValues>;
  naicsReference: NaicsReference[];
  savedValues: CompanyFormValues | undefined;
  onValuesChange: (values: CompanyFormValues | null) => void;
  onExportAll: () => void;
}

export function CompanyReviewPage({
  company,
  schema,
  naicsReference,
  savedValues,
  onValuesChange,
  onExportAll,
}: CompanyReviewPageProps) {
  const originalValues: CompanyFormValues = useMemo(
    () => structuredClone({
      ...company,
      ticker: company.ticker ?? null,
      stockExchange: company.stockExchange ?? null,
      parentCompanyId: company.parentCompanyId ?? null,
    }),
    [company]
  );

  const defaultValues = savedValues ?? originalValues;

  const methods = useForm<CompanyFormValues>({
    // intentional any use: known @hookform/resolvers compat issue with Zod v4
    resolver: zodResolver(schema as any) as Resolver<CompanyFormValues>, // eslint-disable-line @typescript-eslint/no-explicit-any
    defaultValues,
    mode: "onChange",
  });

  const [isDirty, setIsDirty] = useState(!!savedValues);
  const [showResetDialog, setShowResetDialog] = useState(false);

  const onValuesChangeRef = useRef(onValuesChange);
  onValuesChangeRef.current = onValuesChange;
  const skipWatchRef = useRef(false);
  const originalJson = useMemo(() => JSON.stringify(originalValues), [originalValues]);

  const handleExport = useCallback(() => {
    const result = schema.safeParse(methods.getValues());

    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      const count = messages.length;
      toast.error(
        `${count} validation error${count !== 1 ? "s" : ""} found`,
        {
          description: messages.slice(0, 5).join(" \u2022 ") +
            (count > 5 ? ` \u2026and ${count - 5} more` : ""),
        }
      );
      void methods.trigger();
      return;
    }

    exportCompanyAsJson(result.data as { name: string } & Record<string, unknown>);
    toast.success("Company data exported successfully!");
  }, [methods, schema]);

  const handleReset = useCallback(() => {
    skipWatchRef.current = true;
  
    methods.reset(originalValues);
    setIsDirty(false);
    onValuesChangeRef.current(null);
  
    toast.info("Reset to original values");
  }, [methods, originalValues]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/incompatible-library -- watch subscription is isolated in a ref-based effect, not memoized
    const subscription = methods.watch(() => {
      if (skipWatchRef.current) {
        skipWatchRef.current = false;
        return;
      }

      const current = methods.getValues();
      const changed = JSON.stringify(current) !== originalJson;
      setIsDirty(changed);
      onValuesChangeRef.current(changed ? current : null);
    });
  
    return () => subscription.unsubscribe();
  }, [methods, originalJson]);

  const companyName = useWatch({ control: methods.control, name: "name" });
  const revenue = useWatch({ control: methods.control, name: "annualRevenueUsd" });
  const entityType = useWatch({ control: methods.control, name: "entityType" });
  const companyStatus = useWatch({ control: methods.control, name: "companyStatus" });
  const fundingStage = useWatch({ control: methods.control, name: "fundingStage" });

  return (
    <FormProvider {...methods}>
      <OriginalValuesProvider value={originalValues}>
        <form onSubmit={(e) => e.preventDefault()} noValidate className="space-y-8">
          <div className="space-y-3 sm:space-y-0">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Badge className={STATUS_COLORS[companyStatus] ?? "bg-gray-100 text-gray-600"}>
                    {formatStatusLabel(companyStatus)}
                  </Badge>
                  <Badge variant="outline">{formatStatusLabel(fundingStage)}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                  <h1 className="text-xl font-bold sm:text-2xl">
                    {companyName || company.name}
                  </h1>
                  {isDirty && (
                    <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
                      Unsaved changes
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {entityType || company.entityType}
                  {Number(revenue) > 0 &&
                    ` \u00b7 ${formatRevenue(Number(revenue))} revenue`}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {isDirty && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowResetDialog(true)}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                )}
                <ExportButton onExportCurrent={handleExport} onExportAll={onExportAll} />
              </div>
            </div>
          </div>

          <CompanyProfileSection naicsReference={naicsReference} />
          <Separator />
          <DirectorsSection />
          <Separator />
          <LocationsSection />
          <ConfirmDialog
            open={showResetDialog}
            onOpenChange={setShowResetDialog}
            title="Reset to Original"
            description="This will discard all your changes and restore the original values. Are you sure?"
            confirmLabel="Reset"
            onConfirm={handleReset}
          />
        </form>
      </OriginalValuesProvider>
    </FormProvider>
  );
}
