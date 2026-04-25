import { useState } from "react";
import { ArrowUp, ArrowDown, Trash2, Film, ImageIcon } from "lucide-react";

const defaultForm = {
  make: "",
  model: "",
  trim: "",
  year: new Date().getFullYear(),
  price: 0,
  msrp: "",
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
  doors: "",
  seats: "",
  description: "",
  features: "",
  status: "available",
  featured: false,
};

export default function VehicleForm({ defaultValues, onSubmit, submitLabel }) {
  const initialImages = defaultValues?.images || [];
  const initialVideo = defaultValues?.videoUrl || "";

  const [form, setForm] = useState({
    ...defaultForm,
    ...(defaultValues || {}),
    msrp: defaultValues?.msrp ?? "",
    doors: defaultValues?.doors ?? "",
    seats: defaultValues?.seats ?? "",
  });

  const [images, setImages] = useState(initialImages);
  const [videoUrl, setVideoUrl] = useState(initialVideo);
  const [newImageUrl, setNewImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleAddImageUrl() {
    if (!newImageUrl.trim()) return;
    setImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl("");
  }

  function handleRemoveImage(index) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function handleMoveImage(index, direction) {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === images.length - 1) return;
    const newIndex = direction === "up" ? index - 1 : index + 1;
    setImages((prev) => {
      const next = [...prev];
      [next[index], next[newIndex]] = [next[newIndex], next[index]];
      return next;
    });
  }

  async function handleFileUpload(e, type) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploading(true);
    setUploadProgress(type === "image" ? `Uploading ${files.length} image(s)...` : "Uploading video...");

    const uploadedUrls = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgress(`Uploading ${i + 1} of ${files.length}: ${file.name}`);
      const formData = new FormData();
      formData.append("image", file);
      try {
        const token = localStorage.getItem("adminToken");
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: token ? { Authorization: `Bearer ${token}` } : {},
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

  async function handleFormSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);
    const payload = {
      ...form,
      year: Number(form.year) || 0,
      price: Number(form.price) || 0,
      msrp: form.msrp ? Number(form.msrp) : undefined,
      mileage: Number(form.mileage) || 0,
      doors: form.doors ? Number(form.doors) : undefined,
      seats: form.seats ? Number(form.seats) : undefined,
      images,
      videoUrl,
    };
    await onSubmit(payload);
    setIsSubmitting(false);
  }

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <label htmlFor="make" className="text-sm font-medium text-white">Make *</label>
          <input
            id="make"
            type="text"
            required
            value={form.make}
            onChange={(e) => handleChange("make", e.target.value)}
            className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="model" className="text-sm font-medium text-white">Model *</label>
          <input
            id="model"
            type="text"
            required
            value={form.model}
            onChange={(e) => handleChange("model", e.target.value)}
            className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="trim" className="text-sm font-medium text-white">Trim</label>
          <input
            id="trim"
            type="text"
            value={form.trim}
            onChange={(e) => handleChange("trim", e.target.value)}
            placeholder="e.g. AMG, M Sport"
            className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="year" className="text-sm font-medium text-white">Year *</label>
          <input
            id="year"
            type="number"
            required
            value={form.year}
            onChange={(e) => handleChange("year", e.target.value)}
            className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="price" className="text-sm font-medium text-white">Sale Price *</label>
          <input
            id="price"
            type="number"
            step="0.01"
            required
            value={form.price}
            onChange={(e) => handleChange("price", e.target.value)}
            className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="msrp" className="text-sm font-medium text-white">MSRP</label>
          <input
            id="msrp"
            type="number"
            step="0.01"
            value={form.msrp}
            onChange={(e) => handleChange("msrp", e.target.value)}
            className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="mileage" className="text-sm font-medium text-white">Mileage *</label>
          <input
            id="mileage"
            type="number"
            required
            value={form.mileage}
            onChange={(e) => handleChange("mileage", e.target.value)}
            className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="stockNumber" className="text-sm font-medium text-white">Stock Number</label>
          <input
            id="stockNumber"
            type="text"
            value={form.stockNumber}
            onChange={(e) => handleChange("stockNumber", e.target.value)}
            className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="vin" className="text-sm font-medium text-white">VIN</label>
          <input
            id="vin"
            type="text"
            value={form.vin}
            onChange={(e) => handleChange("vin", e.target.value)}
            className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="bodyStyle" className="text-sm font-medium text-white">Body Style</label>
          <input
            id="bodyStyle"
            type="text"
            value={form.bodyStyle}
            onChange={(e) => handleChange("bodyStyle", e.target.value)}
            placeholder="Sedan, SUV, Coupe..."
            className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="transmission" className="text-sm font-medium text-white">Transmission</label>
          <input
            id="transmission"
            type="text"
            value={form.transmission}
            onChange={(e) => handleChange("transmission", e.target.value)}
            placeholder="Automatic, PDK..."
            className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="engine" className="text-sm font-medium text-white">Engine</label>
          <input
            id="engine"
            type="text"
            value={form.engine}
            onChange={(e) => handleChange("engine", e.target.value)}
            placeholder="4.0L V8..."
            className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="fuelType" className="text-sm font-medium text-white">Fuel Type</label>
          <input
            id="fuelType"
            type="text"
            value={form.fuelType}
            onChange={(e) => handleChange("fuelType", e.target.value)}
            placeholder="Gasoline, Electric..."
            className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="driveType" className="text-sm font-medium text-white">Drive Type</label>
          <input
            id="driveType"
            type="text"
            value={form.driveType}
            onChange={(e) => handleChange("driveType", e.target.value)}
            placeholder="AWD, RWD, FWD..."
            className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="exteriorColor" className="text-sm font-medium text-white">Exterior Color</label>
          <input
            id="exteriorColor"
            type="text"
            value={form.exteriorColor}
            onChange={(e) => handleChange("exteriorColor", e.target.value)}
            className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="interiorColor" className="text-sm font-medium text-white">Interior Color</label>
          <input
            id="interiorColor"
            type="text"
            value={form.interiorColor}
            onChange={(e) => handleChange("interiorColor", e.target.value)}
            className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="doors" className="text-sm font-medium text-white">Doors</label>
          <input
            id="doors"
            type="number"
            value={form.doors}
            onChange={(e) => handleChange("doors", e.target.value)}
            className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="seats" className="text-sm font-medium text-white">Seats</label>
          <input
            id="seats"
            type="number"
            value={form.seats}
            onChange={(e) => handleChange("seats", e.target.value)}
            className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium text-white">Status *</label>
          <select
            id="status"
            value={form.status}
            onChange={(e) => handleChange("status", e.target.value)}
            className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50"
          >
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium text-white">Description *</label>
        <textarea
          id="description"
          rows={4}
          required
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="features" className="text-sm font-medium text-white">Features (comma-separated)</label>
        <input
          id="features"
          type="text"
          value={form.features}
          onChange={(e) => handleChange("features", e.target.value)}
          placeholder="e.g. Leather Seats, Sunroof, Navigation"
          className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            id="featured"
            type="checkbox"
            checked={form.featured}
            onChange={(e) => handleChange("featured", e.target.checked)}
            className="h-4 w-4 border-white/10 bg-black accent-[#C0A66A] focus:ring-[#C0A66A]"
          />
          <label htmlFor="featured" className="text-sm font-medium text-white">Featured</label>
        </div>
      </div>

      {/* Images Section */}
      <div className="space-y-4 border border-white/10 bg-[#0a0a0a] p-6">
        <label className="text-lg font-semibold text-white block">Images</label>
        <p className="text-xs text-white/40">First image will be used as the main cover photo. Drag order using arrows.</p>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Image URL"
            value={newImageUrl}
            onChange={(e) => setNewImageUrl(e.target.value)}
            className="flex-1 px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
          />
          <button
            type="button"
            onClick={handleAddImageUrl}
            className="px-4 py-2 text-sm font-medium border border-white/10 bg-black text-white hover:bg-white/5 rounded-md transition-colors"
          >
            Add URL
          </button>
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
          {uploading && <span className="text-sm text-white/60">{uploadProgress}</span>}
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
                  <button
                    type="button"
                    onClick={() => handleMoveImage(idx, "up")}
                    disabled={idx === 0}
                    className="h-7 w-7 flex items-center justify-center text-white hover:text-[#C0A66A] disabled:opacity-30"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveImage(idx, "down")}
                    disabled={idx === images.length - 1}
                    className="h-7 w-7 flex items-center justify-center text-white hover:text-[#C0A66A] disabled:opacity-30"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(idx)}
                    className="h-7 w-7 flex items-center justify-center text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Video Section */}
      <div className="space-y-4 border border-white/10 bg-[#0a0a0a] p-6">
        <label className="text-lg font-semibold text-white block">Video</label>
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
              <input
                value={videoUrl}
                readOnly
                className="flex-1 px-3 py-2 bg-black border border-white/10 text-white text-xs rounded-md focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setVideoUrl("")}
                className="px-3 py-2 text-sm font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isSubmitting || uploading}
          className="px-6 py-2 text-sm font-medium bg-[#C0A66A] text-black hover:bg-[#D4BC86] rounded-md transition-colors disabled:opacity-50"
        >
          {isSubmitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
