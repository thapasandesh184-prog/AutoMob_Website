import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp, Camera, Video, Phone, Mail, User, Calendar, DollarSign, Car, Gauge, Fuel, Settings2, Palette, MessageSquare, MapPin } from "lucide-react";

export default function SubmissionsPage() {
  const [activeTab, setActiveTab] = useState("contact");
  const [contacts, setContacts] = useState([]);
  const [finance, setFinance] = useState([]);
  const [tradeIns, setTradeIns] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [carFinders, setCarFinders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const authHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    async function fetchAll() {
      try {
        const [cRes, fRes, tRes, aRes, cfRes] = await Promise.all([
          fetch("/api/admin/submissions?type=contact", { headers: authHeaders() }),
          fetch("/api/admin/submissions?type=finance", { headers: authHeaders() }),
          fetch("/api/admin/submissions?type=tradein", { headers: authHeaders() }),
          fetch("/api/admin/submissions?type=appointments", { headers: authHeaders() }),
          fetch("/api/admin/submissions?type=carfinder", { headers: authHeaders() }),
        ]);
        if (cRes.ok) setContacts(await cRes.json());
        if (fRes.ok) setFinance(await fRes.json());
        if (tRes.ok) setTradeIns(await tRes.json());
        if (aRes.ok) setAppointments(await aRes.json());
        if (cfRes.ok) setCarFinders(await cfRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const formatDate = (date) =>
    new Date(date).toLocaleString("en-CA", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });

  const formatCurrency = (val) => {
    if (!val && val !== 0) return "—";
    return `$${Number(val).toLocaleString()}`;
  };

  const tabs = [
    { key: "contact", label: `Contact (${contacts.length})` },
    { key: "finance", label: `Finance (${finance.length})` },
    { key: "tradein", label: `Sell My Car (${tradeIns.length})` },
    { key: "appointments", label: `Appointments (${appointments.length})` },
    { key: "carfinder", label: `Car Finder (${carFinders.length})` },
  ];

  const toggleExpand = (id) => setExpandedId(expandedId === id ? null : id);

  const Field = ({ label, value, icon: Icon }) => (
    <div className="space-y-1">
      <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium flex items-center gap-1">
        {Icon && <Icon className="w-3 h-3" />} {label}
      </label>
      <div className="bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-sm text-white min-h-[36px] flex items-center">
        {value || <span className="text-white/30">—</span>}
      </div>
    </div>
  );

  const SectionTitle = ({ children }) => (
    <h3 className="text-xs font-semibold uppercase tracking-widest text-[#C0A66A] border-b border-[#C0A66A]/20 pb-2 mb-3">
      {children}
    </h3>
  );

  const parseMedia = (photos, videos) => {
    const parseField = (val) => {
      if (!val) return [];
      try {
        let parsed = JSON.parse(val);
        // Handle legacy double-stringified data: server used JSON.stringify on an already-JSON string
        if (typeof parsed === 'string') parsed = JSON.parse(parsed);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        // Legacy base64 concatenated format
        if (typeof val === 'string') return val.split("||BASE64||").filter(Boolean);
        return [];
      }
    };
    return { photoList: parseField(photos), videoList: parseField(videos) };
  };

  const parseFeatures = (features) => {
    try { return JSON.parse(features); } catch { return []; }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gradient-gold">Submissions</h1>
          <Link to="/admin/dashboard">
            <span className="text-sm text-white/60 hover:text-[#C0A66A] transition-colors">&larr; Back to Dashboard</span>
          </Link>
        </div>

        <div className="flex flex-wrap gap-1 bg-[#111] border border-white/10 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setExpandedId(null); }}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.key
                  ? "bg-[#C0A66A] text-black"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-white/60 py-20">Loading submissions...</div>
        ) : (
          <>
            {/* CONTACT */}
            {activeTab === "contact" && (
              <div className="space-y-3">
                {contacts.map((item) => (
                  <div key={item.id} className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
                    <button onClick={() => toggleExpand(item.id)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors text-left">
                      <div className="flex items-center gap-4">
                        <User className="w-4 h-4 text-[#C0A66A]" />
                        <span className="font-medium">{item.name}</span>
                        <span className="text-white/40 text-sm">{item.email}</span>
                        <span className="text-white/30 text-xs">{formatDate(item.createdAt)}</span>
                      </div>
                      {expandedId === item.id ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                    </button>
                    {expandedId === item.id && (
                      <div className="px-5 pb-5 border-t border-white/10 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Field label="Name" value={item.name} icon={User} />
                        <Field label="Email" value={item.email} icon={Mail} />
                        <Field label="Phone" value={item.phone} icon={Phone} />
                        <Field label="Subject" value={item.subject} />
                        <div className="md:col-span-3 space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> Message
                          </label>
                          <div className="bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-sm text-white min-h-[80px]">
                            {item.message || <span className="text-white/30">—</span>}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {contacts.length === 0 && <div className="text-center text-white/60 py-12 bg-[#111] border border-white/10 rounded-lg">No contact submissions.</div>}
              </div>
            )}

            {/* FINANCE */}
            {activeTab === "finance" && (
              <div className="space-y-3">
                {finance.map((item) => (
                  <div key={item.id} className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
                    <button onClick={() => toggleExpand(item.id)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors text-left">
                      <div className="flex items-center gap-4">
                        <DollarSign className="w-4 h-4 text-[#C0A66A]" />
                        <span className="font-medium">{item.name}</span>
                        <span className="text-white/40 text-sm">{item.email}</span>
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.tradeIn ? "bg-[#C0A66A] text-black" : "bg-white/10 text-white"}`}>
                          Trade-In: {item.tradeIn ? "Yes" : "No"}
                        </span>
                        <span className="text-white/30 text-xs">{formatDate(item.createdAt)}</span>
                      </div>
                      {expandedId === item.id ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                    </button>
                    {expandedId === item.id && (
                      <div className="px-5 pb-5 border-t border-white/10 pt-4 space-y-5">
                        <SectionTitle>Personal Information</SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Field label="Full Name" value={item.name} icon={User} />
                          <Field label="Email" value={item.email} icon={Mail} />
                          <Field label="Phone" value={item.phone} icon={Phone} />
                          <Field label="Date of Birth" value={item.dob} />
                          <Field label="SIN" value={item.sin} />
                        </div>
                        <SectionTitle>Address</SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Field label="Street" value={item.street} icon={MapPin} />
                          <Field label="City" value={item.city} />
                          <Field label="Province" value={item.state} />
                          <Field label="Postal Code" value={item.zip} />
                          <Field label="Time at Address" value={item.timeAtAddress} />
                        </div>
                        <SectionTitle>Employment</SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Field label="Employer" value={item.employer} />
                          <Field label="Occupation" value={item.occupation} />
                          <Field label="Income" value={formatCurrency(item.income)} icon={DollarSign} />
                          <Field label="Time at Job" value={item.timeAtJob} />
                        </div>
                        <SectionTitle>Vehicle & Trade-In</SectionTitle>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <Field label="Vehicle ID" value={item.vehicleId} icon={Car} />
                          <Field label="Trade-In" value={item.tradeIn ? "Yes" : "No"} />
                          <div className="md:col-span-3 space-y-1">
                            <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium">Trade-In Details</label>
                            <div className="bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-sm text-white min-h-[60px]">{item.tradeInDetails || <span className="text-white/30">—</span>}</div>
                          </div>
                          <div className="md:col-span-3 space-y-1">
                            <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium">References</label>
                            <div className="bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-sm text-white min-h-[60px]">{item.reference1 || <span className="text-white/30">—</span>}</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {finance.length === 0 && <div className="text-center text-white/60 py-12 bg-[#111] border border-white/10 rounded-lg">No finance applications.</div>}
              </div>
            )}

            {/* TRADE-IN (Sell My Car) */}
            {activeTab === "tradein" && (
              <div className="space-y-3">
                {tradeIns.map((item) => {
                  const { photoList, videoList } = parseMedia(item.photos, item.videos);
                  return (
                    <div key={item.id} className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
                      <button onClick={() => toggleExpand(item.id)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors text-left">
                        <div className="flex items-center gap-4 flex-wrap">
                          <Car className="w-4 h-4 text-[#C0A66A]" />
                          <span className="font-medium">{item.firstName} {item.lastName}</span>
                          <span className="text-white/40 text-sm">{item.year} {item.make} {item.model}</span>
                          {photoList.length > 0 && (
                            <span className="flex items-center gap-1 text-xs text-white/50">
                              <Camera className="w-3 h-3" /> {photoList.length}
                            </span>
                          )}
                          {videoList.length > 0 && (
                            <span className="flex items-center gap-1 text-xs text-white/50">
                              <Video className="w-3 h-3" /> {videoList.length}
                            </span>
                          )}
                          <span className="text-white/30 text-xs">{formatDate(item.createdAt)}</span>
                        </div>
                        {expandedId === item.id ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                      </button>
                      {expandedId === item.id && (
                        <div className="px-5 pb-5 border-t border-white/10 pt-4 space-y-5">
                          <SectionTitle>Seller Information</SectionTitle>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Field label="First Name" value={item.firstName} icon={User} />
                            <Field label="Last Name" value={item.lastName} icon={User} />
                            <Field label="Email" value={item.email} icon={Mail} />
                            <Field label="Phone" value={item.phone} icon={Phone} />
                          </div>
                          <SectionTitle>Vehicle Information</SectionTitle>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Field label="Year" value={item.year} icon={Calendar} />
                            <Field label="Make" value={item.make} icon={Car} />
                            <Field label="Model" value={item.model} icon={Car} />
                            <Field label="Trim" value={item.trim} />
                            <Field label="VIN" value={item.vin} />
                            <Field label="Mileage" value={item.mileage} icon={Gauge} />
                            <Field label="Color" value={item.color} icon={Palette} />
                            <Field label="Transmission" value={item.transmission} icon={Settings2} />
                            <Field label="Condition" value={item.condition} />
                          </div>
                          <SectionTitle>Condition Details</SectionTitle>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium">Mechanical</label>
                              <div className="bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-sm text-white min-h-[60px]">{item.mechanical || <span className="text-white/30">—</span>}</div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium">Exterior</label>
                              <div className="bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-sm text-white min-h-[60px]">{item.exterior || <span className="text-white/30">—</span>}</div>
                            </div>
                            <div className="space-y-1">
                              <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium">Interior</label>
                              <div className="bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-sm text-white min-h-[60px]">{item.interior || <span className="text-white/30">—</span>}</div>
                            </div>
                          </div>
                          <SectionTitle>Loan Information</SectionTitle>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Field label="Has Loan" value={item.hasLoan ? "Yes" : "No"} />
                            <Field label="Payoff Amount" value={item.payoffAmount} icon={DollarSign} />
                          </div>
                          {(photoList.length > 0 || videoList.length > 0) && (
                            <>
                              <SectionTitle>Photos & Videos</SectionTitle>
                              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
                                {photoList.map((src, i) => (
                                  <a key={i} href={src} target="_blank" rel="noreferrer" className="group relative aspect-square bg-black border border-white/10 rounded overflow-hidden hover:border-[#C0A66A] transition-colors">
                                    <img src={src} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                      <Camera className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                  </a>
                                ))}
                                {videoList.map((src, i) => (
                                  <a key={`v${i}`} href={src} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center aspect-square bg-black border border-white/10 rounded hover:border-[#C0A66A] transition-colors gap-2">
                                    <Video className="w-6 h-6 text-[#C0A66A]" />
                                    <span className="text-xs text-white/70">Video {i + 1}</span>
                                  </a>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
                {tradeIns.length === 0 && <div className="text-center text-white/60 py-12 bg-[#111] border border-white/10 rounded-lg">No Sell My Car submissions.</div>}
              </div>
            )}

            {/* APPOINTMENTS */}
            {activeTab === "appointments" && (
              <div className="space-y-3">
                {appointments.map((item) => (
                  <div key={item.id} className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
                    <button onClick={() => toggleExpand(item.id)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors text-left">
                      <div className="flex items-center gap-4">
                        <Calendar className="w-4 h-4 text-[#C0A66A]" />
                        <span className="font-medium">{item.type}</span>
                        <span className="text-white/40 text-sm">{item.date} at {item.time}</span>
                        <span className="text-white/40 text-sm">{item.name}</span>
                        <span className="text-white/30 text-xs">{formatDate(item.createdAt)}</span>
                      </div>
                      {expandedId === item.id ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                    </button>
                    {expandedId === item.id && (
                      <div className="px-5 pb-5 border-t border-white/10 pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Field label="Type" value={item.type} icon={Calendar} />
                        <Field label="Date" value={item.date} />
                        <Field label="Time" value={item.time} />
                        <Field label="Name" value={item.name} icon={User} />
                        <Field label="Email" value={item.email} icon={Mail} />
                        <Field label="Phone" value={item.phone} icon={Phone} />
                        <Field label="Vehicle ID" value={item.vehicleId} icon={Car} />
                        <div className="md:col-span-3 space-y-1">
                          <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium flex items-center gap-1">
                            <MessageSquare className="w-3 h-3" /> Notes
                          </label>
                          <div className="bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-sm text-white min-h-[60px]">{item.notes || <span className="text-white/30">—</span>}</div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {appointments.length === 0 && <div className="text-center text-white/60 py-12 bg-[#111] border border-white/10 rounded-lg">No appointments.</div>}
              </div>
            )}

            {/* CAR FINDER */}
            {activeTab === "carfinder" && (
              <div className="space-y-3">
                {carFinders.map((item) => {
                  const features = parseFeatures(item.features);
                  return (
                    <div key={item.id} className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
                      <button onClick={() => toggleExpand(item.id)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors text-left">
                        <div className="flex items-center gap-4 flex-wrap">
                          <SearchIcon className="w-4 h-4 text-[#C0A66A]" />
                          <span className="font-medium">{item.name}</span>
                          <span className="text-white/40 text-sm">{item.make} {item.model}</span>
                          <span className="text-white/40 text-sm">{item.minYear}–{item.maxYear}</span>
                          <span className="text-white/30 text-xs">{formatDate(item.createdAt)}</span>
                        </div>
                        {expandedId === item.id ? <ChevronUp className="w-4 h-4 text-white/40" /> : <ChevronDown className="w-4 h-4 text-white/40" />}
                      </button>
                      {expandedId === item.id && (
                        <div className="px-5 pb-5 border-t border-white/10 pt-4 space-y-5">
                          <SectionTitle>Contact Information</SectionTitle>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Field label="Name" value={item.name} icon={User} />
                            <Field label="Email" value={item.email} icon={Mail} />
                            <Field label="Phone" value={item.phone} icon={Phone} />
                          </div>
                          <SectionTitle>Vehicle Preferences</SectionTitle>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Field label="Make" value={item.make} icon={Car} />
                            <Field label="Model" value={item.model} icon={Car} />
                            <Field label="Body Style" value={item.bodyStyle} />
                            <Field label="Color" value={item.color} icon={Palette} />
                            <Field label="Transmission" value={item.transmission} icon={Settings2} />
                            <Field label="Fuel Type" value={item.fuelType} icon={Fuel} />
                            <Field label="Drive Type" value={item.driveType} />
                          </div>
                          <SectionTitle>Budget & Year</SectionTitle>
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Field label="Min Year" value={item.minYear} icon={Calendar} />
                            <Field label="Max Year" value={item.maxYear} icon={Calendar} />
                            <Field label="Min Price" value={formatCurrency(item.minPrice)} icon={DollarSign} />
                            <Field label="Max Price" value={formatCurrency(item.maxPrice)} icon={DollarSign} />
                            <Field label="Max Mileage" value={item.maxMileage ? `${Number(item.maxMileage).toLocaleString()} km` : null} icon={Gauge} />
                          </div>
                          {features.length > 0 && (
                            <>
                              <SectionTitle>Requested Features</SectionTitle>
                              <div className="flex flex-wrap gap-2">
                                {features.map((f, i) => (
                                  <span key={i} className="px-3 py-1.5 bg-[#C0A66A]/10 border border-[#C0A66A]/30 text-[#C0A66A] text-xs rounded-full">
                                    {f}
                                  </span>
                                ))}
                              </div>
                            </>
                          )}
                          <div className="space-y-1">
                            <label className="text-[10px] uppercase tracking-wider text-white/40 font-medium flex items-center gap-1">
                              <MessageSquare className="w-3 h-3" /> Notes
                            </label>
                            <div className="bg-white/[0.03] border border-white/10 rounded px-3 py-2 text-sm text-white min-h-[60px]">{item.notes || <span className="text-white/30">—</span>}</div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {carFinders.length === 0 && <div className="text-center text-white/60 py-12 bg-[#111] border border-white/10 rounded-lg">No Car Finder requests.</div>}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
