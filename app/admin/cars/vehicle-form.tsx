"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const vehicleSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  trim: z.string().optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  price: z.number().positive("Price must be positive"),
  msrp: z.number().optional(),
  mileage: z.number().int().nonnegative(),
  stockNumber: z.string().optional(),
  vin: z.string().optional(),
  bodyStyle: z.string().optional(),
  transmission: z.string().optional(),
  engine: z.string().optional(),
  fuelType: z.string().optional(),
  driveType: z.string().optional(),
  exteriorColor: z.string().optional(),
  interiorColor: z.string().optional(),
  doors: z.number().optional(),
  seats: z.number().optional(),
  description: z.string().min(1, "Description is required"),
  features: z.string(),
  status: z.enum(["available", "sold", "pending"]),
  featured: z.boolean(),
});

export type VehicleFormData = z.infer<typeof vehicleSchema>;
export type VehicleFormPayload = VehicleFormData & { images: string[] };

interface VehicleFormProps {
  defaultValues?: Partial<VehicleFormPayload>;
  onSubmit: (data: VehicleFormPayload) => void | Promise<void>;
  submitLabel: string;
}

export function VehicleForm({
  defaultValues,
  onSubmit,
  submitLabel,
}: VehicleFormProps) {
  const { images: initialImages = [], ...formDefaults } = defaultValues || {};
  const [images, setImages] = useState<string[]>(initialImages);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<VehicleFormData>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      make: "",
      model: "",
      trim: "",
      year: new Date().getFullYear(),
      price: 0,
      msrp: undefined,
      mileage: 0,
      stockNumber: "",
      vin: "",
      bodyStyle: "",
      transmission: "",
      engine: "",
      fuelType: "",
      driveType: "",
      exteriorColor: "",
      interiorColor: "",
      doors: undefined,
      seats: undefined,
      description: "",
      features: "",
      status: "available",
      featured: false,
      ...formDefaults,
    },
  });

  function handleAddImageUrl() {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl("");
  }

  function handleRemoveImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setImages((prev) => [...prev, data.url]);
    } catch (err) {
      alert("Failed to upload image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleFormSubmit(data: VehicleFormData) {
    await onSubmit({ ...data, images });
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="make">Make *</Label>
          <Input id="make" {...register("make")} />
          {errors.make && <p className="text-sm text-destructive">{errors.make.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model *</Label>
          <Input id="model" {...register("model")} />
          {errors.model && <p className="text-sm text-destructive">{errors.model.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="trim">Trim</Label>
          <Input id="trim" {...register("trim")} placeholder="e.g. AMG, M Sport" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year *</Label>
          <Input id="year" type="number" {...register("year", { valueAsNumber: true })} />
          {errors.year && <p className="text-sm text-destructive">{errors.year.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Sale Price *</Label>
          <Input id="price" type="number" step="0.01" {...register("price", { valueAsNumber: true })} />
          {errors.price && <p className="text-sm text-destructive">{errors.price.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="msrp">MSRP</Label>
          <Input id="msrp" type="number" step="0.01" {...register("msrp", { valueAsNumber: true })} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage *</Label>
          <Input id="mileage" type="number" {...register("mileage", { valueAsNumber: true })} />
          {errors.mileage && <p className="text-sm text-destructive">{errors.mileage.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="stockNumber">Stock Number</Label>
          <Input id="stockNumber" {...register("stockNumber")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="vin">VIN</Label>
          <Input id="vin" {...register("vin")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bodyStyle">Body Style</Label>
          <Input id="bodyStyle" {...register("bodyStyle")} placeholder="Sedan, SUV, Coupe..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="transmission">Transmission</Label>
          <Input id="transmission" {...register("transmission")} placeholder="Automatic, PDK..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="engine">Engine</Label>
          <Input id="engine" {...register("engine")} placeholder="4.0L V8..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fuelType">Fuel Type</Label>
          <Input id="fuelType" {...register("fuelType")} placeholder="Gasoline, Electric..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="driveType">Drive Type</Label>
          <Input id="driveType" {...register("driveType")} placeholder="AWD, RWD, FWD..." />
        </div>

        <div className="space-y-2">
          <Label htmlFor="exteriorColor">Exterior Color</Label>
          <Input id="exteriorColor" {...register("exteriorColor")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="interiorColor">Interior Color</Label>
          <Input id="interiorColor" {...register("interiorColor")} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="doors">Doors</Label>
          <Input id="doors" type="number" {...register("doors", { valueAsNumber: true })} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seats">Seats</Label>
          <Input id="seats" type="number" {...register("seats", { valueAsNumber: true })} />
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status *</Label>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={(v: string | null) => typeof v === "string" && field.onChange(v)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description *</Label>
        <Textarea id="description" rows={4} {...register("description")} />
        {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="features">Features (comma-separated)</Label>
        <Input id="features" {...register("features")} placeholder="e.g. Leather Seats, Sunroof, Navigation" />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            id="featured"
            type="checkbox"
            {...register("featured")}
            defaultChecked={formDefaults.featured}
            className="h-4 w-4 border-white/10 bg-black accent-[#C0A66A] focus:ring-[#C0A66A]"
          />
          <Label htmlFor="featured" className="mb-0">Featured</Label>
        </div>
      </div>

      <div className="space-y-4">
        <Label>Images</Label>
        <div className="flex gap-2">
          <Input
            placeholder="Image URL"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
          />
          <Button type="button" variant="outline" onClick={handleAddImageUrl}>
            Add URL
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="text-sm text-muted-foreground file:mr-4 file:border-0 file:bg-gold file:px-3 file:py-1 file:text-sm file:font-medium file:text-black hover:file:bg-gold/90 cursor-pointer"
          />
          {uploading && <span className="text-sm text-muted-foreground">Uploading...</span>}
        </div>
        {images.length > 0 && (
          <ul className="space-y-2">
            {images.map((url, idx) => (
              <li key={idx} className="flex items-center justify-between border border-white/10 bg-black px-3 py-2">
                <span className="truncate text-sm text-muted-foreground max-w-[80%]">{url}</span>
                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveImage(idx)}>
                  Remove
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pt-4">
        <Button type="submit" disabled={isSubmitting || uploading} className="w-full md:w-auto">
          {isSubmitting ? "Saving..." : submitLabel}
        </Button>
      </div>
    </form>
  );
}
