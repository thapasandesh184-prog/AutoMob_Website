"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Save, Upload, Plus, Trash2, Loader2, ImageIcon, Globe, Layout, Type, Car } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

type Brand = { name: string; image: string };
type QuickLink = { title: string; href: string; image: string };

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([]);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data || {});
        try {
          setBrands(JSON.parse(data?.brands || "[]"));
        } catch {
          setBrands([]);
        }
        try {
          setQuickLinks(JSON.parse(data?.quickLinks || "[]"));
        } catch {
          setQuickLinks([]);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpload = async (key: string, file: File) => {
    setUploadingKey(key);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      updateSetting(key, data.url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleBrandUpload = async (index: number, file: File) => {
    setUploadingKey(`brand-${index}`);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const next = [...brands];
      next[index] = { ...next[index], image: data.url };
      setBrands(next);
      toast.success("Brand image uploaded");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleQuickLinkUpload = async (index: number, file: File) => {
    setUploadingKey(`ql-${index}`);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const next = [...quickLinks];
      next[index] = { ...next[index], image: data.url };
      setQuickLinks(next);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setUploadingKey(null);
    }
  };

  const save = async () => {
    setIsSaving(true);
    const payload = { ...settings, brands: JSON.stringify(brands), quickLinks: JSON.stringify(quickLinks) };
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      toast.success("Settings saved successfully");
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C0A66A]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gradient-gold">Site Settings</h1>
          <Button onClick={save} disabled={isSaving} className="bg-[#C0A66A] text-black hover:bg-[#D4BC86]">
            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Save Changes
          </Button>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="bg-[#111] border border-white/10 mb-6 flex flex-wrap h-auto gap-1 p-1">
            <TabsTrigger value="general" className="data-[state=active]:bg-[#C0A66A] data-[state=active]:text-black"><Globe className="w-4 h-4 mr-2" /> General</TabsTrigger>
            <TabsTrigger value="social" className="data-[state=active]:bg-[#C0A66A] data-[state=active]:text-black"><Type className="w-4 h-4 mr-2" /> Social</TabsTrigger>
            <TabsTrigger value="homepage" className="data-[state=active]:bg-[#C0A66A] data-[state=active]:text-black"><Layout className="w-4 h-4 mr-2" /> Homepage</TabsTrigger>
            <TabsTrigger value="seo" className="data-[state=active]:bg-[#C0A66A] data-[state=active]:text-black"><Car className="w-4 h-4 mr-2" /> SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <SectionCard title="Logo">
              <ImageField
                label="Logo Image"
                value={settings.logoUrl || ""}
                onChange={(v) => updateSetting("logoUrl", v)}
                onUpload={(f) => handleUpload("logoUrl", f)}
                uploading={uploadingKey === "logoUrl"}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Logo Height (px)</Label>
                  <Select value={settings.logoHeight || "40"} onValueChange={(v) => updateSetting("logoHeight", v || "40")}>
                    <SelectTrigger className="w-full bg-black border-white/10 text-white">
                      <SelectValue placeholder="Select height" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="32">32px</SelectItem>
                      <SelectItem value="40">40px</SelectItem>
                      <SelectItem value="48">48px</SelectItem>
                      <SelectItem value="56">56px</SelectItem>
                      <SelectItem value="64">64px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-white/60 text-xs uppercase tracking-wider">Logo Position</Label>
                  <Select value={settings.logoPosition || "left"} onValueChange={(v) => updateSetting("logoPosition", v || "left")}>
                    <SelectTrigger className="w-full bg-black border-white/10 text-white">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="left">Left (with nav)</SelectItem>
                      <SelectItem value="center">Center</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </SectionCard>
            <SectionCard title="Business Information">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Site Name" value={settings.siteName || ""} onChange={(v) => updateSetting("siteName", v)} />
                <Field label="Tagline" value={settings.siteTagline || ""} onChange={(v) => updateSetting("siteTagline", v)} />
                <Field label="Phone" value={settings.phone || ""} onChange={(v) => updateSetting("phone", v)} />
                <Field label="Email" value={settings.email || ""} onChange={(v) => updateSetting("email", v)} />
                <Field label="Address" value={settings.address || ""} onChange={(v) => updateSetting("address", v)} />
                <Field label="City" value={settings.city || ""} onChange={(v) => updateSetting("city", v)} />
                <Field label="State / Province" value={settings.state || ""} onChange={(v) => updateSetting("state", v)} />
                <Field label="ZIP / Postal" value={settings.zip || ""} onChange={(v) => updateSetting("zip", v)} />
                <Field label="Country" value={settings.country || ""} onChange={(v) => updateSetting("country", v)} />
                <Field label="Hours" value={settings.hours || ""} onChange={(v) => updateSetting("hours", v)} />
              </div>
            </SectionCard>
            <SectionCard title="Map">
              <Field
                label="Google Maps Embed URL"
                value={settings.mapEmbedUrl || ""}
                onChange={(v) => updateSetting("mapEmbedUrl", v)}
              />
              <p className="text-xs text-white/40">
                Must be a Google Maps <strong>embed</strong> URL starting with <code>https://www.google.com/maps/embed?pb=...</code>.<br />
                Do <strong>not</strong> use short links like <code>maps.app.goo.gl</code> or share links.<br />
                To get it: open Google Maps &rarr; Share &rarr; Embed a map &rarr; copy the iframe src.
              </p>
            </SectionCard>
          </TabsContent>

          <TabsContent value="social" className="space-y-6">
            <SectionCard title="Social Media Links">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Facebook URL" value={settings.facebook || ""} onChange={(v) => updateSetting("facebook", v)} />
                <Field label="Instagram URL" value={settings.instagram || ""} onChange={(v) => updateSetting("instagram", v)} />
                <Field label="X (Twitter) URL" value={settings.x || ""} onChange={(v) => updateSetting("x", v)} />
                <Field label="YouTube URL" value={settings.youtube || ""} onChange={(v) => updateSetting("youtube", v)} />
              </div>
            </SectionCard>
          </TabsContent>

          <TabsContent value="homepage" className="space-y-6">
            <SectionCard title="Hero Section">
              <ImageField
                label="Hero Video URL"
                value={settings.heroVideo || ""}
                onChange={(v) => updateSetting("heroVideo", v)}
                onUpload={(f) => handleUpload("heroVideo", f)}
                uploading={uploadingKey === "heroVideo"}
                accept="video/*,image/*"
              />
              <ImageField
                label="Hero Poster Image"
                value={settings.heroPoster || ""}
                onChange={(v) => updateSetting("heroPoster", v)}
                onUpload={(f) => handleUpload("heroPoster", f)}
                uploading={uploadingKey === "heroPoster"}
              />
            </SectionCard>

            <SectionCard title="Quick Link Cards">
              <div className="space-y-4">
                {quickLinks.map((link, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-[#0a0a0a] border border-white/5 p-4">
                    <div>
                      <Label className="text-white/60 text-xs uppercase">Title</Label>
                      <Input value={link.title} onChange={(e) => {
                        const next = [...quickLinks];
                        next[index].title = e.target.value;
                        setQuickLinks(next);
                      }} className="bg-black border-white/10 text-white" />
                    </div>
                    <div>
                      <Label className="text-white/60 text-xs uppercase">Link</Label>
                      <Input value={link.href} onChange={(e) => {
                        const next = [...quickLinks];
                        next[index].href = e.target.value;
                        setQuickLinks(next);
                      }} className="bg-black border-white/10 text-white" />
                    </div>
                    <ImageFieldSmall
                      value={link.image}
                      onChange={(v) => {
                        const next = [...quickLinks];
                        next[index].image = v;
                        setQuickLinks(next);
                      }}
                      onUpload={(f) => handleQuickLinkUpload(index, f)}
                      uploading={uploadingKey === `ql-${index}`}
                    />
                    <Button variant="outline" size="sm" onClick={() => setQuickLinks(quickLinks.filter((_, i) => i !== index))} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4 mr-2" /> Remove
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={() => setQuickLinks([...quickLinks, { title: "NEW CARD", href: "/", image: "" }])} className="border-white/10 text-white hover:bg-white/5">
                  <Plus className="w-4 h-4 mr-2" /> Add Quick Link
                </Button>
              </div>
            </SectionCard>

            <SectionCard title="Brand Showcase">
              <div className="space-y-4">
                {brands.map((brand, index) => (
                  <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end bg-[#0a0a0a] border border-white/5 p-4">
                    <div>
                      <Label className="text-white/60 text-xs uppercase">Brand Name</Label>
                      <Input value={brand.name} onChange={(e) => {
                        const next = [...brands];
                        next[index].name = e.target.value;
                        setBrands(next);
                      }} className="bg-black border-white/10 text-white" />
                    </div>
                    <ImageFieldSmall
                      value={brand.image}
                      onChange={(v) => {
                        const next = [...brands];
                        next[index].image = v;
                        setBrands(next);
                      }}
                      onUpload={(f) => handleBrandUpload(index, f)}
                      uploading={uploadingKey === `brand-${index}`}
                    />
                    <Button variant="outline" size="sm" onClick={() => setBrands(brands.filter((_, i) => i !== index))} className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                      <Trash2 className="w-4 h-4 mr-2" /> Remove
                    </Button>
                  </div>
                ))}
                <Button variant="outline" onClick={() => setBrands([...brands, { name: "New Brand", image: "" }])} className="border-white/10 text-white hover:bg-white/5">
                  <Plus className="w-4 h-4 mr-2" /> Add Brand
                </Button>
              </div>
            </SectionCard>

            <SectionCard title="Page Images">
              <ImageField
                label="Financing CTA Background"
                value={settings.financingBgImage || ""}
                onChange={(v) => updateSetting("financingBgImage", v)}
                onUpload={(f) => handleUpload("financingBgImage", f)}
                uploading={uploadingKey === "financingBgImage"}
              />
              <ImageField
                label="About Teaser Image"
                value={settings.aboutImage || ""}
                onChange={(v) => updateSetting("aboutImage", v)}
                onUpload={(f) => handleUpload("aboutImage", f)}
                uploading={uploadingKey === "aboutImage"}
              />
            </SectionCard>
          </TabsContent>

          <TabsContent value="seo" className="space-y-6">
            <SectionCard title="Search Engine Optimization">
              <Field label="Meta Title" value={settings.metaTitle || ""} onChange={(v) => updateSetting("metaTitle", v)} />
              <div className="space-y-2">
                <Label className="text-white/60 text-xs uppercase tracking-wider">Meta Description</Label>
                <Textarea
                  value={settings.metaDescription || ""}
                  onChange={(e) => updateSetting("metaDescription", e.target.value)}
                  rows={4}
                  className="bg-black border-white/10 text-white"
                />
              </div>
              <ImageField
                label="OG Image URL"
                value={settings.ogImage || ""}
                onChange={(v) => updateSetting("ogImage", v)}
                onUpload={(f) => handleUpload("ogImage", f)}
                uploading={uploadingKey === "ogImage"}
              />
            </SectionCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-[#111] border border-white/10 p-6 space-y-4"
    >
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {children}
    </motion.div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-2">
      <Label className="text-white/60 text-xs uppercase tracking-wider">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="bg-black border-white/10 text-white focus-visible:border-[#C0A66A]/50" />
    </div>
  );
}

function ImageField({ label, value, onChange, onUpload, uploading, accept = "image/*" }: { label: string; value: string; onChange: (v: string) => void; onUpload: (f: File) => void; uploading: boolean; accept?: string }) {
  const isVideo = value.match(/\.(mp4|webm|ogg|mov)$/i);
  return (
    <div className="space-y-2">
      <Label className="text-white/60 text-xs uppercase tracking-wider">{label}</Label>
      <div className="flex gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="https://..." className="bg-black border-white/10 text-white flex-1" />
        <label className={cn("relative cursor-pointer overflow-hidden", buttonVariants({ variant: "outline", size: "default" }), "border-white/10 text-white hover:bg-white/5 flex items-center gap-2")}>
          <input
            type="file"
            accept={accept}
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => { e.target.files?.[0] && onUpload(e.target.files[0]); e.currentTarget.value = ""; }}
          />
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          Upload
        </label>
      </div>
      {value && (
        <div className="relative w-full h-32 overflow-hidden border border-white/10 mt-2 bg-black">
          {isVideo ? (
            <video src={value} className="w-full h-full object-cover" muted playsInline />
          ) : (
            <img src={value} alt="preview" className="w-full h-full object-cover" />
          )}
        </div>
      )}
    </div>
  );
}

function ImageFieldSmall({ value, onChange, onUpload, uploading, accept = "image/*" }: { value: string; onChange: (v: string) => void; onUpload: (f: File) => void; uploading: boolean; accept?: string }) {
  return (
    <div className="space-y-2">
      <Label className="text-white/60 text-xs uppercase">Image</Label>
      <div className="flex gap-2">
        <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="URL" className="bg-black border-white/10 text-white flex-1" />
        <label className={cn("relative cursor-pointer overflow-hidden", buttonVariants({ variant: "outline", size: "icon" }), "border-white/10 text-white hover:bg-white/5 flex items-center justify-center")}>
          <input
            type="file"
            accept={accept}
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => { e.target.files?.[0] && onUpload(e.target.files[0]); e.currentTarget.value = ""; }}
          />
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
        </label>
      </div>
      {value && <img src={value} alt="" className="w-16 h-16 object-cover border border-white/10 mt-1" />}
    </div>
  );
}
