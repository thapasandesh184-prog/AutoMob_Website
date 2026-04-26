import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown, ChevronUp, Phone, Mail, User, Calendar, Car, Gauge,
  Palette, Settings2, Fuel, Search, MessageSquare, Tag, Hash
} from "lucide-react";

export default function CarFinderSubmissions() {
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
        const res = await fetch("/api/admin/submissions?type=carfinder", { headers: authHeaders() });
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

  const formatCurrency = (val) => {
    if (!val && val !== 0) return null;
    return `$${Number(val).toLocaleString()}`;
  };

  const parseFeatures = (features) => {
    try { return JSON.parse(features); } catch { return []; }
  };

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  const filtered = submissions.filter((s) => {
    const q = search.toLowerCase();
    return (
      (s.name || "").toLowerCase().includes(q) ||
      (s.email || "").toLowerCase().includes(q) ||
      (s.make || "").toLowerCase().includes(q) ||
      (s.model || "").toLowerCase().includes(q) ||
      (s.bodyStyle || "").toLowerCase().includes(q)
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

  const StatusBadge = ({ status }) => {
    const styles = {
      open: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
      closed: "bg-white/5 text-white/50 border-white/10",
      in_progress: "bg-[#C0A66A]/10 text-[#C0A66A] border-[#C0A66A]/30",
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded border ${styles[status] || styles.open}`}>
        {(status || "open").replace("_", " ")}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gradient-gold">Car Finder Requests</h1>
            <p className="text-white/40 text-sm mt-1">{submissions.length} total request{submissions.length !== 1 ? "s" : ""}</p>
          </div>
          <Link to="/admin/dashboard">
            <span className="text-sm text-white/60 hover:text-[#C0A66A] transition-colors">&larr; Back to Dashboard</span>
          </Link>
        </div>

        {/* Search */}
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search by name, email, make, model, body style..."
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
          <div className="text-center text-white/60 py-20">Loading requests...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-white/60 py-20 bg-[#111] border border-white/10 rounded-lg">
            {search ? "No requests match your search." : "No Car Finder requests yet."}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((item) => {
              const features = parseFeatures(item.features);
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
                        <Search className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-white flex items-center gap-2">
                          {item.name}
                          <StatusBadge status={item.status} />
                        </div>
                        <div className="text-sm text-white/50">
                          {item.make} {item.model} {item.bodyStyle && `· ${item.bodyStyle}`}
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
                      {(item.minYear || item.maxYear) && (
                        <span className="text-xs bg-white/5 px-2 py-1 rounded text-white/60 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {item.minYear || "Any"} – {item.maxYear || "Any"}
                        </span>
                      )}
                      {(item.minPrice || item.maxPrice) && (
                        <span className="text-xs bg-white/5 px-2 py-1 rounded text-white/60 flex items-center gap-1">
                          <Tag className="w-3 h-3" /> {formatCurrency(item.minPrice) || "Any"} – {formatCurrency(item.maxPrice) || "Any"}
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
                      {/* Contact Info */}
                      <div>
                        <SectionTitle>Contact Information</SectionTitle>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <Field label="Name" value={item.name} icon={User} />
                          <Field label="Email" value={item.email} icon={Mail} />
                          <Field label="Phone" value={item.phone} icon={Phone} />
                          <Field label="Status" value={item.status || "open"} icon={Hash} />
                        </div>
                      </div>

                      {/* Vehicle Preferences */}
                      <div>
                        <SectionTitle>Vehicle Preferences</SectionTitle>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <Field label="Make" value={item.make} icon={Car} />
                          <Field label="Model" value={item.model} icon={Car} />
                          <Field label="Body Style" value={item.bodyStyle} />
                          <Field label="Color" value={item.color} icon={Palette} />
                          <Field label="Transmission" value={item.transmission} icon={Settings2} />
                          <Field label="Fuel Type" value={item.fuelType} icon={Fuel} />
                          <Field label="Drive Type" value={item.driveType} />
                          <Field label="Max Mileage" value={item.maxMileage ? `${Number(item.maxMileage).toLocaleString()} km` : null} icon={Gauge} />
                        </div>
                      </div>

                      {/* Budget & Year */}
                      <div>
                        <SectionTitle>Budget & Year Range</SectionTitle>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                          <Field label="Min Year" value={item.minYear} icon={Calendar} />
                          <Field label="Max Year" value={item.maxYear} icon={Calendar} />
                          <Field label="Min Price" value={formatCurrency(item.minPrice)} icon={Tag} />
                          <Field label="Max Price" value={formatCurrency(item.maxPrice)} icon={Tag} />
                        </div>
                      </div>

                      {/* Requested Features */}
                      {features.length > 0 && (
                        <div>
                          <SectionTitle>Requested Features</SectionTitle>
                          <div className="flex flex-wrap gap-2">
                            {features.map((f, i) => (
                              <span key={i} className="px-3 py-1.5 bg-[#C0A66A]/10 border border-[#C0A66A]/30 text-[#C0A66A] text-xs rounded-full">
                                {f}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Notes */}
                      <div>
                        <SectionTitle>Additional Notes</SectionTitle>
                        <div className="bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-sm text-white min-h-[60px]">
                          {item.notes || <span className="text-white/30">—</span>}
                        </div>
                      </div>
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
