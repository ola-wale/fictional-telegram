// Not virtualized - 249 items renders comfortably without it.
import { useState, useRef } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { COUNTRY_OPTIONS } from "@/data/country-codes";

interface CountryComboboxProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

export function CountryCombobox({ value, onChange, onBlur, id, "aria-invalid": ariaInvalid, "aria-describedby": ariaDescribedBy }: CountryComboboxProps) {
  const [open, setOpen] = useState(false);
  const hasScrolled = useRef(false);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = COUNTRY_OPTIONS.find((c) => c.code === value);

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (isOpen) {
        hasScrolled.current = false;
        requestAnimationFrame(() => {
          if (!hasScrolled.current && value && listRef.current) {
            listRef.current.querySelector(`[data-code="${CSS.escape(value)}"]`)?.scrollIntoView({ block: "nearest" });
            hasScrolled.current = true;
          }
        });
      }
    }}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={ariaInvalid}
          aria-describedby={ariaDescribedBy}
          className="w-full justify-between font-normal"
          onBlur={onBlur}
        >
          {selected ? (
            <span>
              <span className="font-medium">{selected.code}</span>
              <span className="text-muted-foreground"> - {selected.name}</span>
            </span>
          ) : (
            <span className="text-muted-foreground">Select country</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[280px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search country..." />
          <CommandList ref={listRef}>
            <CommandEmpty>No country found.</CommandEmpty>
            {COUNTRY_OPTIONS.map((country) => (
              <CommandItem
                key={country.code}
                data-code={country.code}
                value={`${country.code} ${country.name}`}
                onSelect={() => {
                  onChange(country.code);
                  onBlur?.();
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === country.code ? "opacity-100" : "opacity-0"
                  )}
                />
                <span>
                  <span className="font-medium">{country.code}</span>
                  <span className="text-muted-foreground"> - {country.name}</span>
                </span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
