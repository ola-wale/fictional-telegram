import { Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExportButtonProps {
  onExportCurrent: () => void;
  onExportAll: () => void;
}

export function ExportButton({ onExportCurrent, onExportAll }: ExportButtonProps) {
  return (
    <div className="flex items-center">
      <Button
        type="button"
        onClick={onExportCurrent}
        size="sm"
        className="rounded-r-none"
      >
        <Download className="mr-2 h-4 w-4" />
        Export JSON
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            size="sm"
            className="rounded-l-none border-l border-primary-foreground/20 px-2"
            aria-label="More export options"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onExportAll}>
            <Download className="mr-2 h-4 w-4" />
            Export all companies
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
