import { type ReactNode } from "react";
import { useWatch } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useOriginalValues, getOriginalValue, normalizeValue } from "@/lib/original-values";

const ARRAY_ITEM_RE = /^(\w+)\.(\d+)\./;

interface FormFieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  className?: string;
  fieldPath?: string;
  children: ReactNode;
}

export function FormField({
  label,
  htmlFor,
  error,
  className,
  fieldPath,
  children,
}: FormFieldProps) {
  const original = useOriginalValues();
  const currentValue = useWatch({ name: fieldPath ?? "", disabled: !fieldPath });

  const arrayMatch = fieldPath?.match(ARRAY_ITEM_RE);
  const idPath = arrayMatch ? `${arrayMatch[1]}.${arrayMatch[2]}.id` : undefined;
  const currentId = useWatch({ name: idPath ?? "", disabled: !idPath });

  let isChanged = false;
  if (fieldPath && original) {
    const originalValue = getOriginalValue(
      original as unknown as Record<string, unknown>,
      fieldPath,
      currentId,
    );
    isChanged = normalizeValue(currentValue) !== normalizeValue(originalValue);
  }

  const errorId = htmlFor ? `${htmlFor}-error` : undefined;

  return (
    <div
      className={cn(
        "space-y-1.5",
        isChanged && "[&_input]:border-blue-400 [&_textarea]:border-blue-400 [&_[data-slot=select-trigger]]:border-blue-400 [&_[role=combobox]]:border-blue-400",
        error && "[&_input]:border-destructive [&_textarea]:border-destructive [&_[data-slot=select-trigger]]:border-destructive [&_[role=combobox]]:border-destructive",
        className
      )}
    >
      <div className="flex items-center gap-1.5">
        <Label htmlFor={htmlFor}>{label}</Label>
        <span
          className={cn("text-[11px] font-medium text-blue-500 transition-opacity", isChanged ? "opacity-100" : "opacity-0")}
          aria-hidden={!isChanged || undefined}
        >
          edited
        </span>
      </div>
      {children}
      {error && (
        <p id={errorId} className="text-[13px] text-destructive" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
