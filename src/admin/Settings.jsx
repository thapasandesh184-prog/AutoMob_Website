import { useEffect, useState } from "react";
import { Save, Upload, Plus, Trash2, Loader2, ImageIcon, Globe, Layout, Type, Car } from "lucide-react";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingKey, setUploadingKey] = useState(null);
  const [brands, setBrands] = useState([]);
  const [quickLinks, setQuickLinks] = useState([]);
  const [activeTab, setActiveTab] = useState("general");

  const authHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    fetch("/api/admin/settings", { headers: authHeaders() })
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

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpload = async (key, file) => {
    setUploadingKey(key);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", headers: authHeaders(), body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      updateSetting(key, data.url);
      alert("Image uploaded");
    } catch (err) {
      alert("Image upload failed");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleBrandUpload = async (index, file) => {
    setUploadingKey(`brand-${index}`);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", headers: authHeaders(), body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const next = [...brands];
      next[index] = { ...next[index], image: data.url };
      setBrands(next);
      alert("Brand image uploaded");
    } catch (err) {
      alert("Upload failed");
    } finally {
      setUploadingKey(null);
    }
  };

  const handleQuickLinkUpload = async (index, file) => {
    setUploadingKey(`ql-${index}`);
    const formData = new FormData();
    formData.append("image", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", headers: authHeaders(), body: formData });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      const next = [...quickLinks];
      next[index] = { ...next[index], image: data.url };
      setQuickLinks(next);
      alert("Image uploaded");
    } catch (err) {
      alert("Upload failed");
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
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Save failed");
      alert("Settings saved successfully");
    } catch (err) {
      alert("Failed to save settings");
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

  const tabs = [
    { key: "general", label: "General", icon: Globe },
    { key: "social", label: "Social", icon: Type },
    { key: "homepage", label: "Homepage", icon: Layout },
    { key: "seo", label: "SEO", icon: Car },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl md:text-3xl font-bold text-gradient-gold">Site Settings</h1>
          <button
            onClick={save}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-[#C0A66A] text-black hover:bg-[#D4BC86] rounded-md transition-colors disabled:opacity-50"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        </div>

        <div className="w-full">
          <div className="flex flex-wrap gap-1 bg-[#111] border border-white/10 mb-6 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === tab.key
                    ? "bg-[#C0A66A] text-black"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === "general" && (
            <div className="space-y-6">
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
                    <label className="text-white/60 text-xs uppercase tracking-wider block">Logo Height (px)</label>
                    <select
                      value={settings.logoHeight || "40"}
                      onChange={(e) => updateSetting("logoHeight", e.target.value || "40")}
                      className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50"
                    >
                      <option value="32">32px</option>
                      <option value="40">40px</option>
                      <option value="48">48px</option>
                      <option value="56">56px</option>
                      <option value="64">64px</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-white/60 text-xs uppercase tracking-wider block">Logo Position</label>
                    <select
                      value={settings.logoPosition || "left"}
                      onChange={(e) => updateSetting("logoPosition", e.target.value || "left")}
                      className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50"
                    >
                      <option value="left">Left (with nav)</option>
                      <option value="center">Center</option>
                    </select>
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
                <Field label="Google Maps Embed URL" value={settings.mapEmbedUrl || ""} onChange={(v) => updateSetting("mapEmbedUrl", v)} />
                <p className="text-xs text-white/40">
                  Must be a Google Maps <strong>embed</strong> URL starting with <code>https://www.google.com/maps/embed?pb=...</code>.<br />
                  Do <strong>not</strong> use short links like <code>maps.app.goo.gl</code> or share links.<br />
                  To get it: open Google Maps &rarr; Share &rarr; Embed a map &rarr; copy the iframe src.
                </p>
              </SectionCard>
            </div>
          )}

          {activeTab === "social" && (
            <div className="space-y-6">
              <SectionCard title="Social Media Links">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Facebook URL" value={settings.facebook || ""} onChange={(v) => updateSetting("facebook", v)} />
                  <Field label="Instagram URL" value={settings.instagram || ""} onChange={(v) => updateSetting("instagram", v)} />
                  <Field label="X (Twitter) URL" value={settings.x || ""} onChange={(v) => updateSetting("x", v)} />
                  <Field label="YouTube URL" value={settings.youtube || ""} onChange={(v) => updateSetting("youtube", v)} />
                </div>
              </SectionCard>
            </div>
          )}

          {activeTab === "homepage" && (
            <div className="space-y-6">
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
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end bg-[#0a0a0a] border border-white/5 p-4 rounded-lg">
                      <div>
                        <label className="text-white/60 text-xs uppercase block mb-1">Title</label>
                        <input
                          value={link.title}
                          onChange={(e) => {
                            const next = [...quickLinks];
                            next[index].title = e.target.value;
                            setQuickLinks(next);
                          }}
                          className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50"
                        />
                      </div>
                      <div>
                        <label className="text-white/60 text-xs uppercase block mb-1">Link</label>
                        <input
                          value={link.href}
                          onChange={(e) => {
                            const next = [...quickLinks];
                            next[index].href = e.target.value;
                            setQuickLinks(next);
                          }}
                          className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50"
                        />
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
                      <button
                        onClick={() => setQuickLinks(quickLinks.filter((_, i) => i !== index))}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setQuickLinks([...quickLinks, { title: "NEW CARD", href: "/", image: "" }])}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-white/10 text-white hover:bg-white/5 rounded-md transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Quick Link
                  </button>
                </div>
              </SectionCard>

              <SectionCard title="Brand Showcase">
                <div className="space-y-4">
                  {brands.map((brand, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end bg-[#0a0a0a] border border-white/5 p-4 rounded-lg">
                      <div>
                        <label className="text-white/60 text-xs uppercase block mb-1">Brand Name</label>
                        <input
                          value={brand.name}
                          onChange={(e) => {
                            const next = [...brands];
                            next[index].name = e.target.value;
                            setBrands(next);
                          }}
                          className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50"
                        />
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
                      <button
                        onClick={() => setBrands(brands.filter((_, i) => i !== index))}
                        className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-md transition-colors"
                      >
                        <Trash2 className="w-4 h-4" /> Remove
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={() => setBrands([...brands, { name: "New Brand", image: "" }])}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-white/10 text-white hover:bg-white/5 rounded-md transition-colors"
                  >
                    <Plus className="w-4 h-4" /> Add Brand
                  </button>
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
            </div>
          )}

          {activeTab === "seo" && (
            <div className="space-y-6">
              <SectionCard title="Search Engine Optimization">
                <Field label="Meta Title" value={settings.metaTitle || ""} onChange={(v) => updateSetting("metaTitle", v)} />
                <div className="space-y-2">
                  <label className="text-white/60 text-xs uppercase tracking-wider block">Meta Description</label>
                  <textarea
                    value={settings.metaDescription || ""}
                    onChange={(e) => updateSetting("metaDescription", e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50"
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionCard({ title, children }) {
  return (
    <div className="bg-[#111] border border-white/10 p-6 space-y-4 rounded-lg">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-white/60 text-xs uppercase tracking-wider block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50"
      />
    </div>
  );
}

function ImageField({ label, value, onChange, onUpload, uploading, accept = "image/*" }) {
  const isVideo = value.match(/\.(mp4|webm|ogg|mov)$/i);
  return (
    <div className="space-y-2">
      <label className="text-white/60 text-xs uppercase tracking-wider block">{label}</label>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://..."
          className="flex-1 px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
        />
        <label className="relative cursor-pointer overflow-hidden inline-flex items-center gap-2 px-4 py-2 text-sm font-medium border border-white/10 bg-black text-white hover:bg-white/5 rounded-md transition-colors">
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
        <div className="relative w-full h-32 overflow-hidden border border-white/10 mt-2 bg-black rounded-lg">
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

function ImageFieldSmall({ value, onChange, onUpload, uploading, accept = "image/*" }) {
  return (
    <div className="space-y-2">
      <label className="text-white/60 text-xs uppercase block">Image</label>
      <div className="flex gap-2">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL"
          className="flex-1 px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
        />
        <label className="relative cursor-pointer overflow-hidden inline-flex items-center justify-center w-10 h-10 border border-white/10 bg-black text-white hover:bg-white/5 rounded-md transition-colors">
          <input
            type="file"
            accept={accept}
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={(e) => { e.target.files?.[0] && onUpload(e.target.files[0]); e.currentTarget.value = ""; }}
          />
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
        </label>
      </div>
      {value && <img src={value} alt="" className="w-16 h-16 object-cover border border-white/10 mt-1 rounded" />}
    </div>
  );
}
