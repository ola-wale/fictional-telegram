import { FileText } from "lucide-react";
import { CompanySelector } from "@/components/company/CompanySelector";
import type { Company } from "@/types/company";

interface HeaderProps {
  companies: Company[];
  selectedCompanyId: string;
  editedCompanyIds: Set<string>;
  onCompanySelect: (id: string) => void;
}

export function Header({
  companies,
  selectedCompanyId,
  editedCompanyIds,
  onCompanySelect,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2.5">
          <FileText className="hidden h-5 w-5 text-primary sm:block" />
          <span className="text-sm font-semibold tracking-tight sm:text-base">
            Company Data Review
          </span>
        </div>
        <nav aria-label="Company navigation">
          <CompanySelector
            companies={companies}
            selectedId={selectedCompanyId}
            editedIds={editedCompanyIds}
            onSelect={onCompanySelect}
          />
        </nav>
      </div>
    </header>
  );
}
