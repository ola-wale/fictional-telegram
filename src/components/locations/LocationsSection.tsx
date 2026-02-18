import { useRef, useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import { Plus, MapPin } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { Button } from "@/components/ui/button";
import { LocationCard } from "./LocationCard";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import type { CompanyFormValues } from "@/lib/validation";

export function LocationsSection() {
  const { control, formState: { errors } } = useFormContext<CompanyFormValues>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "locations",
  });

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const canRemove = fields.length > 1;

  const handleAdd = () => {
    append({
      id: uuidv4(),
      name: "",
      addressLine1: "",
      city: "",
      region: "",
      postalCode: "",
      countryCode: "",
    });
    requestAnimationFrame(() => {
      const card = listRef.current?.lastElementChild as HTMLElement | null;
      if (card) {
        card.scrollIntoView({ behavior: "smooth", block: "nearest" });
        card.querySelector<HTMLInputElement>("input")?.focus();
      }
    });
  };

  const handleConfirmDelete = () => {
    if (deleteId !== null) {
      const idx = fields.findIndex((f) => f.id === deleteId);
      if (idx !== -1) remove(idx);
    }
  };

  return (
    <section aria-labelledby="locations-heading" className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-muted-foreground" />
          <h2 id="locations-heading" className="text-lg font-semibold">Locations</h2>
          <span className="text-sm text-muted-foreground">
            ({fields.length})
          </span>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add Location
        </Button>
      </div>

      {errors.locations?.root && (
        <p className="text-sm text-destructive">
          {errors.locations.root.message}
        </p>
      )}

      <div ref={listRef} className="space-y-3">
        {fields.map((field, index) => (
          <LocationCard
            key={field.id}
            index={index}
            canRemove={canRemove}
            onRemove={() => setDeleteId(field.id)}
          />
        ))}
      </div>

      <ConfirmDialog
        open={deleteId !== null}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Remove Location"
        description="Are you sure you want to remove this location? This action cannot be undone."
        onConfirm={handleConfirmDelete}
      />
    </section>
  );
}
