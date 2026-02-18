import { useFormContext, Controller } from "react-hook-form";
import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormField } from "@/components/shared/FormField";
import { CountryCombobox } from "@/components/shared/CountryCombobox";
import type { CompanyFormValues } from "@/lib/validation";

interface LocationCardProps {
  index: number;
  canRemove: boolean;
  onRemove: () => void;
}

export function LocationCard({ index, canRemove, onRemove }: LocationCardProps) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<CompanyFormValues>();

  const e = errors.locations?.[index];

  return (
    <Card>
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="grid flex-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <FormField
              label="Location Name"
              htmlFor={`locations.${index}.name`}
              error={e?.name?.message}
              fieldPath={`locations.${index}.name`}
            >
              <Input
                id={`locations.${index}.name`}
                {...register(`locations.${index}.name`)}
                placeholder="e.g. Head Office"
                aria-invalid={!!e?.name}
                aria-describedby={e?.name ? `locations.${index}.name-error` : undefined}
              />
            </FormField>
            <FormField
              label="Address"
              htmlFor={`locations.${index}.addressLine1`}
              error={e?.addressLine1?.message}
              fieldPath={`locations.${index}.addressLine1`}
            >
              <Input
                id={`locations.${index}.addressLine1`}
                {...register(`locations.${index}.addressLine1`)}
                placeholder="Street address"
                aria-invalid={!!e?.addressLine1}
                aria-describedby={e?.addressLine1 ? `locations.${index}.addressLine1-error` : undefined}
              />
            </FormField>
            <FormField
              label="City"
              htmlFor={`locations.${index}.city`}
              error={e?.city?.message}
              fieldPath={`locations.${index}.city`}
            >
              <Input
                id={`locations.${index}.city`}
                {...register(`locations.${index}.city`)}
                placeholder="City"
                aria-invalid={!!e?.city}
                aria-describedby={e?.city ? `locations.${index}.city-error` : undefined}
              />
            </FormField>
            <FormField
              label="Region"
              htmlFor={`locations.${index}.region`}
              error={e?.region?.message}
              fieldPath={`locations.${index}.region`}
            >
              <Input
                id={`locations.${index}.region`}
                {...register(`locations.${index}.region`)}
                placeholder="State / Province"
                aria-invalid={!!e?.region}
                aria-describedby={e?.region ? `locations.${index}.region-error` : undefined}
              />
            </FormField>
            <FormField
              label="Postal Code"
              htmlFor={`locations.${index}.postalCode`}
              error={e?.postalCode?.message}
              fieldPath={`locations.${index}.postalCode`}
            >
              <Input
                id={`locations.${index}.postalCode`}
                {...register(`locations.${index}.postalCode`)}
                placeholder="Postal code"
                aria-invalid={!!e?.postalCode}
                aria-describedby={e?.postalCode ? `locations.${index}.postalCode-error` : undefined}
              />
            </FormField>
            <FormField
              label="Country"
              htmlFor={`locations.${index}.countryCode`}
              error={e?.countryCode?.message}
              fieldPath={`locations.${index}.countryCode`}
            >
              <Controller
                control={control}
                name={`locations.${index}.countryCode`}
                render={({ field }) => (
                  <CountryCombobox
                    id={`locations.${index}.countryCode`}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    aria-invalid={!!e?.countryCode}
                    aria-describedby={e?.countryCode ? `locations.${index}.countryCode-error` : undefined}
                  />
                )}
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
            aria-label="Remove location"
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
            aria-label="Remove location"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Remove
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
