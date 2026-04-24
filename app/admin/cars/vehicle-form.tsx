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
import { ArrowUp, ArrowDown, Trash2, Film, ImageIcon } from "lucide-react";

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
export type VehicleFormPayload = VehicleFormData & { images: string[]; videoUrl?: string };

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
  const { images: initialImages = [], videoUrl: initialVideo = "", ...formDefaults } = defaultValues || {};
  const [images, setImages] = useState<string[]>(initialImages);
  const [videoUrl, setVideoUrl] = useState<string>(initialVideo);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");

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

  function handleMoveImage(index: number, direction: "up" | "down") {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === images.length - 1) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    setImages((prev) => {
      const next = [...prev];
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return next;
    });
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>, type: "image" | "video") {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(type === "image" ? `Uploading ${files.length} image(s)...` : "Uploading video...");

    const uploadedUrls: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`Uploading ${i + 1} of ${files.length}: ${file.name}`);
      const formData = new FormData();
      formData.append("image", file);
      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });
        if (!res.ok) throw new Error("Upload failed");
        const data = await res.json();
        uploadedUrls.push(data.url);
      } catch (err) {
        alert(`Failed to upload ${file.name}`);
      }
    }

    if (type === "image") {
      setImages((prev) => [...prev, ...uploadedUrls]);
    } else {
      setVideoUrl(uploadedUrls[0] || "");
    }

    setUploading(false);
    setUploadProgress("");
    e.target.value = "";
  }

  async function handleFormSubmit(data: VehicleFormData) {
    await onSubmit({ ...data, images, videoUrl });
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

      {/* Images Section */}
      <div className="space-y-4 border border-white/10 bg-[#0a0a0a] p-6">
        <Label className="text-lg font-semibold">Images</Label>
        <p className="text-xs text-white/40">First image will be used as the main cover photo. Drag order using arrows.</p>

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
          <label className="relative cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-white/10 bg-black text-white hover:bg-white/5 rounded-md transition-colors">
            <ImageIcon className="w-4 h-4" />
            <span>Upload Multiple Images</span>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => handleFileUpload(e, "image")}
              disabled={uploading}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
          {uploading && <span className="text-sm text-muted-foreground">{uploadProgress}</span>}
        </div>

        {images.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {images.map((url, idx) => (
              <div key={idx} className="relative group border border-white/10 bg-black overflow-hidden">
                <div className="absolute top-1 left-1 z-10 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded">
                  {idx === 0 ? "Cover" : `#${idx + 1}`}
                </div>
                <img src={url} alt={`Vehicle ${idx + 1}`} className="w-full aspect-square object-cover" />
                <div className="absolute inset-x-0 bottom-0 p-1 flex justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity bg-black/60">
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-white hover:text-[#C0A66A]" onClick={() => handleMoveImage(idx, "up")} disabled={idx === 0}>
                    <ArrowUp className="w-3.5 h-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-white hover:text-[#C0A66A]" onClick={() => handleMoveImage(idx, "down")} disabled={idx === images.length - 1}>
                    <ArrowDown className="w-3.5 h-3.5" />
                  </Button>
                  <Button type="button" variant="ghost" size="icon" className="h-7 w-7 text-red-400 hover:text-red-300" onClick={() => handleRemoveImage(idx)}>
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Section */}
      <div className="space-y-4 border border-white/10 bg-[#0a0a0a] p-6">
        <Label className="text-lg font-semibold">Video</Label>
        <div className="flex items-center gap-2">
          <label className="relative cursor-pointer inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-white/10 bg-black text-white hover:bg-white/5 rounded-md transition-colors">
            <Film className="w-4 h-4" />
            <span>Upload Video</span>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => handleFileUpload(e, "video")}
              disabled={uploading}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </label>
          <span className="text-xs text-white/40">MP4, WebM, MOV supported</span>
        </div>
        {videoUrl && (
          <div className="space-y-2">
            <div className="relative border border-white/10 bg-black overflow-hidden max-w-md">
              <video src={videoUrl} className="w-full aspect-video" controls muted playsInline />
            </div>
            <div className="flex items-center gap-2">
              <Input value={videoUrl} readOnly className="bg-black border-white/10 text-white text-xs" />
              <Button type="button" variant="outline" size="sm" onClick={() => setVideoUrl("")} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                Remove
              </Button>
            </div>
          </div>
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
