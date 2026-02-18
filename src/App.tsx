import { useCallback, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/Header";
import { CompanyReviewPage } from "@/components/company/CompanyReviewPage";
import { companies, naicsReference } from "@/data/mock-data";
import { exportAllCompaniesAsJson } from "@/lib/export";
import { createCompanySchema, type CompanyFormValues } from "@/lib/validation";
import { COUNTRY_CODES } from "@/data/country-codes";

export default function App() {
  const [selectedCompanyId, setSelectedCompanyId] = useState(companies[0]?.id ?? "");
  const editedValuesRef = useRef<Record<string, CompanyFormValues>>({});
  const [editedCompanyIds, setEditedCompanyIds] = useState<Set<string>>(new Set());
  const [savedSnapshot, setSavedSnapshot] = useState<CompanyFormValues | undefined>();

  const selectedCompany = useMemo(
    () => companies.find((c) => c.id === selectedCompanyId),
    [selectedCompanyId]
  );

  const schema = useMemo(
    () => createCompanySchema(naicsReference, COUNTRY_CODES),
    []
  );

  const handleValuesChange = useCallback(
    (values: CompanyFormValues | null) => {
      if (values === null) {
        delete editedValuesRef.current[selectedCompanyId];
        setEditedCompanyIds((prev) => {
          if (!prev.has(selectedCompanyId)) return prev;
          const next = new Set(prev);
          next.delete(selectedCompanyId);
          return next;
        });
      } else {
        editedValuesRef.current[selectedCompanyId] = values;
        setEditedCompanyIds((prev) => {
          if (prev.has(selectedCompanyId)) return prev;
          return new Set(prev).add(selectedCompanyId);
        });
      }
    },
    [selectedCompanyId]
  );

  const handleCompanySelect = useCallback((id: string) => {
    setSavedSnapshot(editedValuesRef.current[id]);
    setSelectedCompanyId(id);
  }, []);

  const handleExportAll = useCallback(() => {
    const allCompanies: unknown[] = [];
    const invalid: string[] = [];

    for (const c of companies) {
      const data = editedValuesRef.current[c.id] ?? c;
      const result = schema.safeParse(data);
      if (result.success) {
        allCompanies.push(result.data);
      } else {
        invalid.push(c.name);
        allCompanies.push(data);
      }
    }

    exportAllCompaniesAsJson(allCompanies);

    if (invalid.length > 0) {
      toast.warning(`Exported ${allCompanies.length} companies with warnings`, {
        description: `${invalid.join(", ")} may contain invalid data.`,
      });
    } else {
      toast.success(`Exported ${allCompanies.length} companies`);
    }
  }, [schema]);

  if (!selectedCompany) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50/50">
        <p className="text-muted-foreground">No companies found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <Header
        companies={companies}
        selectedCompanyId={selectedCompanyId}
        editedCompanyIds={editedCompanyIds}
        onCompanySelect={handleCompanySelect}
      />
      <main aria-label="Company review" className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8">
        <CompanyReviewPage
          key={selectedCompanyId}
          company={selectedCompany}
          schema={schema}
          naicsReference={naicsReference}
          savedValues={savedSnapshot}
          onValuesChange={handleValuesChange}
          onExportAll={handleExportAll}
        />
      </main>
      <Toaster richColors />
    </div>
  );
}
