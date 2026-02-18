import { useFormContext } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/shared/FormField";
import type { CompanyFormValues } from "@/lib/validation";

interface DirectorCardProps {
  index: number;
  canRemove: boolean;
  onRemove: () => void;
}

export function DirectorCard({ index, canRemove, onRemove }: DirectorCardProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<CompanyFormValues>();

  const e = errors.directors?.[index];

  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField
              label="Name"
              htmlFor={`directors.${index}.name`}
              error={e?.name?.message}
              fieldPath={`directors.${index}.name`}
            >
              <Input
                id={`directors.${index}.name`}
                {...register(`directors.${index}.name`)}
                placeholder="Full name"
                aria-invalid={!!e?.name}
                aria-describedby={e?.name ? `directors.${index}.name-error` : undefined}
              />
            </FormField>
            <FormField
              label="Email"
              htmlFor={`directors.${index}.email`}
              error={e?.email?.message}
              fieldPath={`directors.${index}.email`}
            >
              <Input
                id={`directors.${index}.email`}
                type="email"
                {...register(`directors.${index}.email`)}
                placeholder="email@example.com"
                aria-invalid={!!e?.email}
                aria-describedby={e?.email ? `directors.${index}.email-error` : undefined}
              />
            </FormField>
            <FormField
              label="Phone"
              htmlFor={`directors.${index}.phone`}
              error={e?.phone?.message}
              fieldPath={`directors.${index}.phone`}
            >
              <Input
                id={`directors.${index}.phone`}
                {...register(`directors.${index}.phone`)}
                placeholder="+1-555-000-0000"
                aria-invalid={!!e?.phone}
                aria-describedby={e?.phone ? `directors.${index}.phone-error` : undefined}
              />
            </FormField>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="mt-6 hidden shrink-0 text-muted-foreground hover:text-destructive sm:flex"
            disabled={!canRemove}
            onClick={onRemove}
            aria-label="Remove director"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
        <div className="mt-2 flex justify-end sm:hidden">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-destructive"
            disabled={!canRemove}
            onClick={onRemove}
            aria-label="Remove director"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
