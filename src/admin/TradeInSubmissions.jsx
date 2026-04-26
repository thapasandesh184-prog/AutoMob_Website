import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown, ChevronUp, Camera, Video, Phone, Mail, User, Calendar,
  Car, Gauge, Palette, Settings2, DollarSign, MessageSquare, Wrench, Paintbrush, Sofa
} from "lucide-react";

export default function TradeInSubmissions() {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [search, setSearch] = useState("");

  const authHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/admin/submissions?type=tradein", { headers: authHeaders() });
        if (res.ok) setSubmissions(await res.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-CA", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const parseMedia = (photos, videos) => {
    const parseField = (val) => {
      if (!val) return [];
      try {
        let parsed = JSON.parse(val);
        if (typeof parsed === "string") parsed = JSON.parse(parsed);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        if (typeof val === "string") return val.split("||BASE64||").filter(Boolean);
        return [];
      }
    };
    return { photoList: parseField(photos), videoList: parseField(videos) };
  };

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  const filtered = submissions.filter((s) => {
    const q = search.toLowerCase();
    return (
      (s.firstName || "").toLowerCase().includes(q) ||
      (s.lastName || "").toLowerCase().includes(q) ||
      (s.email || "").toLowerCase().includes(q) ||
      (s.make || "").toLowerCase().includes(q) ||
      (s.model || "").toLowerCase().includes(q) ||
      (s.vin || "").toLowerCase().includes(q)
    );
  });

  const SectionTitle = ({ children }) => (
    <h3 className="text-xs font-semibold uppercase tracking-widest text-[#C0A66A] border-b border-[#C0A66A]/20 pb-2 mb-3">
      {children}
    </h3>
  );

  const Field = ({ label, value, icon: Icon }) => (
    <div className="space-y-1">
      <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3" />} {label}
      </label>
      <div className="bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-sm text-white min-h-[36px] flex items-center">
        {value !== null && value !== undefined && value !== "" ? value : <span className="text-white/30">—</span>}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gradient-gold">Sell My Car Submissions</h1>
            <p className="text-white/40 text-sm mt-1">{submissions.length} total submission{submissions.length !== 1 ? "s" : ""}</p>
          </div>
          <Link to="/admin/dashboard">
            <span className="text-sm text-white/60 hover:text-[#C0A66A] transition-colors">&larr; Back to Dashboard</span>
          </Link>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by name, email, make, model, VIN..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-md bg-white/[0.03] border border-white/10 rounded px-4 py-2.5 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#C0A66A]/50"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-sm text-white/50 hover:text-white">
              Clear
            </button>
          )}
        </div>

        {/* Cards */}
        {loading ? (
          <div className="text-center text-white/60 py-20">Loading submissions...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-white/60 py-20 bg-[#111] border border-white/10 rounded-lg">
            {search ? "No submissions match your search." : "No Sell My Car submissions yet."}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const { photoList, videoList } = parseMedia(item.photos, item.videos);
              const isExpanded = expandedId === item.id;
              return (
                <div
                  key={item.id}
                  className={`bg-[#111] border rounded-lg overflow-hidden transition-colors ${
                    isExpanded ? "border-[#C0A66A]/30" : "border-white/10 hover:border-white/20"
                  }`}
                >
                  {/* Summary Row */}
                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="w-full flex items-center justify-between px-5 py-4 text-left"
                  >
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className={`w-10 h-10 flex items-center justify-center rounded ${isExpanded ? "bg-[#C0A66A] text-black" : "bg-white/5 text-[#C0A66A]"}`}>
                        <Car className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-white">
                          {item.firstName} {item.lastName}
                        </div>
                        <div className="text-sm text-white/50">
                          {item.year} {item.make} {item.model} {item.trim && `· ${item.trim}`}
                        </div>
                      </div>
                      <div className="hidden sm:flex items-center gap-3 text-xs text-white/40">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" /> {item.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {item.phone}
                        </span>
                      </div>
                      {photoList.length > 0 && (
                        <span className="flex items-center gap-1 text-xs bg-white/5 px-2 py-1 rounded text-white/60">
                          <Camera className="w-3 h-3" /> {photoList.length}
                        </span>
                      )}
                      {videoList.length > 0 && (
                        <span className="flex items-center gap-1 text-xs bg-white/5 px-2 py-1 rounded text-white/60">
                          <Video className="w-3 h-3" /> {videoList.length}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-white/30 text-xs hidden md:block">{formatDate(item.createdAt)}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-[#C0A66A]" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                    </div>
                  </button>

                  {/* Expanded Detail */}
                  {isExpanded && (
                    <div className="px-5 pb-6 border-t border-white/10 pt-5 space-y-6">
                      {/* Seller Info */}
                      <div>
                        <SectionTitle>Seller Information</SectionTitle>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <Field label="First Name" value={item.firstName} icon={User} />
                          <Field label="Last Name" value={item.lastName} icon={User} />
                          <Field label="Email" value={item.email} icon={Mail} />
                          <Field label="Phone" value={item.phone} icon={Phone} />
                        </div>
                      </div>

                      {/* Vehicle Info */}
                      <div>
                        <SectionTitle>Vehicle Information</SectionTitle>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <Field label="Year" value={item.year} icon={Calendar} />
                          <Field label="Make" value={item.make} icon={Car} />
                          <Field label="Model" value={item.model} icon={Car} />
                          <Field label="Trim" value={item.trim} />
                          <Field label="VIN" value={item.vin} />
                          <Field label="Mileage" value={item.mileage} icon={Gauge} />
                          <Field label="Color" value={item.color} icon={Palette} />
                          <Field label="Transmission" value={item.transmission} icon={Settings2} />
                        </div>
                      </div>

                      {/* Condition */}
                      <div>
                        <SectionTitle>Condition Details</SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium flex items-center gap-1">
                              <Wrench className="w-3 h-3" /> Mechanical Condition
                            </label>
                            <div className="bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-sm text-white min-h-[60px]">
                              {item.mechanical || <span className="text-white/30">—</span>}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium flex items-center gap-1">
                              <Paintbrush className="w-3 h-3" /> Exterior Condition
                            </label>
                            <div className="bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-sm text-white min-h-[60px]">
                              {item.exterior || <span className="text-white/30">—</span>}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium flex items-center gap-1">
                              <Sofa className="w-3 h-3" /> Interior Condition
                            </label>
                            <div className="bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-sm text-white min-h-[60px]">
                              {item.interior || <span className="text-white/30">—</span>}
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> Overall Condition
                          </label>
                          <div className="bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-sm text-white min-h-[60px] mt-1">
                            {item.condition || <span className="text-white/30">—</span>}
                          </div>
                        </div>
                      </div>

                      {/* Loan Info */}
                      <div>
                        <SectionTitle>Loan & Payoff</SectionTitle>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <Field label="Has Loan" value={item.hasLoan ? "Yes" : "No"} />
                          <Field label="Payoff Amount" value={item.payoffAmount ? `$${Number(item.payoffAmount).toLocaleString()}` : null} icon={DollarSign} />
                        </div>
                      </div>

                      {/* Photos & Videos */}
                      {(photoList.length > 0 || videoList.length > 0) && (
                        <div>
                          <SectionTitle>Photos & Videos</SectionTitle>
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {photoList.map((src, i) => (
                              <a
                                key={i}
                                href={src}
                                target="_blank"
                                rel="noreferrer"
                                className="group relative aspect-square bg-black border border-white/10 rounded overflow-hidden hover:border-[#C0A66A] transition-colors"
                              >
                                <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                  <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </a>
                            ))}
                            {videoList.map((src, i) => (
                              <a
                                key={`v${i}`}
                                href={src}
                                target="_blank"
                                rel="noreferrer"
                                className="flex flex-col items-center justify-center aspect-square bg-black border border-white/10 rounded hover:border-[#C0A66A] transition-colors gap-2"
                              >
                                <Video className="w-6 h-6 text-[#C0A66A]" />
                                <span className="text-xs text-white/70">Video {i + 1}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
