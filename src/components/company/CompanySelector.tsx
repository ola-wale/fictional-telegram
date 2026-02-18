import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Company } from "@/types/company";

interface CompanySelectorProps {
  companies: Company[];
  selectedId: string;
  editedIds: Set<string>;
  onSelect: (id: string) => void;
}

export function CompanySelector({
  companies,
  selectedId,
  editedIds,
  onSelect,
}: CompanySelectorProps) {
  return (
    <Select value={selectedId} onValueChange={onSelect}>
      <SelectTrigger className="min-w-[220px] w-auto max-w-[300px]" aria-label="Select company">
        <SelectValue placeholder="Select a company" />
      </SelectTrigger>
      <SelectContent>
        {companies.map((company) => (
          <SelectItem key={company.id} value={company.id}>
            <span className="flex items-center gap-2">
              {company.name}
              {editedIds.has(company.id) && (
                <span
                  className="inline-block h-2 w-2 rounded-full bg-amber-400"
                  aria-label="Unsaved changes"
                />
              )}
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
