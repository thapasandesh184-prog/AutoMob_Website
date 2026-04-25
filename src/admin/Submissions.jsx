import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function SubmissionsPage() {
  const [activeTab, setActiveTab] = useState("contact");
  const [contacts, setContacts] = useState([]);
  const [finance, setFinance] = useState([]);
  const [tradeIns, setTradeIns] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [carFinders, setCarFinders] = useState([]);
  const [loading, setLoading] = useState(true);

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
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const tabs = [
    { key: "contact", label: `Contact (${contacts.length})` },
    { key: "finance", label: `Finance (${finance.length})` },
    { key: "tradein", label: `Trade-Ins (${tradeIns.length})` },
    { key: "appointments", label: `Appointments (${appointments.length})` },
    { key: "carfinder", label: `Car Finder (${carFinders.length})` },
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gradient-gold">Submissions</h1>
          <Link to="/admin/dashboard">
            <span className="text-sm text-white/60 hover:text-[#C0A66A] transition-colors">&larr; Back to Dashboard</span>
          </Link>
        </div>

        <div className="w-full">
          <div className="flex flex-wrap gap-1 bg-[#111] border border-white/10 mb-6 p-1 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
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

          {activeTab === "contact" && (
            <div className="bg-[#111] border border-white/10 overflow-hidden rounded-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-4 py-3 font-medium text-white/60">Name</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Email</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Phone</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Subject</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Message</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((item) => (
                      <tr key={item.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3">{item.email}</td>
                        <td className="px-4 py-3">{item.phone || "—"}</td>
                        <td className="px-4 py-3">{item.subject || "—"}</td>
                        <td className="px-4 py-3 max-w-xs truncate">{item.message}</td>
                        <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
                      </tr>
                    ))}
                    {contacts.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center text-white/60 py-8">No contact submissions.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "finance" && (
            <div className="bg-[#111] border border-white/10 overflow-hidden rounded-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-4 py-3 font-medium text-white/60">Name</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Email</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Phone</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Income</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Trade-In</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {finance.map((item) => (
                      <tr key={item.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3">{item.email}</td>
                        <td className="px-4 py-3">{item.phone}</td>
                        <td className="px-4 py-3">{item.income ? `$${item.income.toLocaleString()}` : "—"}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${item.tradeIn ? "bg-[#C0A66A] text-black" : "bg-white/10 text-white"}`}>
                            {item.tradeIn ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
                      </tr>
                    ))}
                    {finance.length === 0 && (
                      <tr>
                        <td colSpan={6} className="text-center text-white/60 py-8">No finance applications.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "tradein" && (
            <div className="bg-[#111] border border-white/10 overflow-hidden rounded-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-4 py-3 font-medium text-white/60">Name</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Email</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Phone</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Vehicle</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Mileage</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Photos</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tradeIns.map((item) => (
                      <tr key={item.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="px-4 py-3">{item.firstName} {item.lastName}</td>
                        <td className="px-4 py-3">{item.email}</td>
                        <td className="px-4 py-3">{item.phone}</td>
                        <td className="px-4 py-3">{item.year} {item.make} {item.model}</td>
                        <td className="px-4 py-3">{item.mileage}</td>
                        <td className="px-4 py-3">
                          {(item.photos || item.videos) ? (
                            <div className="flex flex-wrap gap-2 max-w-xs">
                              {(() => {
                                const photoList = [];
                                const videoList = [];
                                try {
                                  if (item.photos) photoList.push(...JSON.parse(item.photos));
                                } catch {
                                  if (item.photos) photoList.push(...item.photos.split("||BASE64||"));
                                }
                                try {
                                  if (item.videos) videoList.push(...JSON.parse(item.videos));
                                } catch {}
                                return (
                                  <>
                                    {photoList.map((src, i) => (
                                      <a key={`img-${i}`} href={src} target="_blank" rel="noreferrer">
                                        <img src={src} alt={`photo-${i}`} className="h-12 w-12 object-cover border border-white/10 hover:border-[#C0A66A] transition-colors" />
                                      </a>
                                    ))}
                                    {videoList.map((src, i) => (
                                      <a key={`vid-${i}`} href={src} target="_blank" rel="noreferrer" className="h-12 px-2 flex items-center justify-center bg-[#111] border border-white/10 text-[10px] text-white/70 hover:border-[#C0A66A] transition-colors">
                                        Video {i + 1}
                                      </a>
                                    ))}
                                  </>
                                );
                              })()}
                            </div>
                          ) : "—"}
                        </td>
                        <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
                      </tr>
                    ))}
                    {tradeIns.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center text-white/60 py-8">No trade-in submissions.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "appointments" && (
            <div className="bg-[#111] border border-white/10 overflow-hidden rounded-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-4 py-3 font-medium text-white/60">Type</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Date</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Time</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Name</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Email</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Phone</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map((item) => (
                      <tr key={item.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="px-4 py-3">{item.type}</td>
                        <td className="px-4 py-3">{item.date}</td>
                        <td className="px-4 py-3">{item.time}</td>
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3">{item.email}</td>
                        <td className="px-4 py-3">{item.phone}</td>
                        <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
                      </tr>
                    ))}
                    {appointments.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center text-white/60 py-8">No appointments.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === "carfinder" && (
            <div className="bg-[#111] border border-white/10 overflow-hidden rounded-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left px-4 py-3 font-medium text-white/60">Name</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Email</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Phone</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Preferences</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Year Range</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Price Range</th>
                      <th className="text-left px-4 py-3 font-medium text-white/60">Submitted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {carFinders.map((item) => (
                      <tr key={item.id} className="border-b border-white/10 hover:bg-white/5">
                        <td className="px-4 py-3">{item.name}</td>
                        <td className="px-4 py-3">{item.email}</td>
                        <td className="px-4 py-3">{item.phone || "—"}</td>
                        <td className="px-4 py-3">{[item.make, item.model, item.bodyStyle].filter(Boolean).join(" ") || "—"}</td>
                        <td className="px-4 py-3">{item.minYear || "—"} - {item.maxYear || "—"}</td>
                        <td className="px-4 py-3">{item.minPrice ? `$${item.minPrice.toLocaleString()}` : "—"} - {item.maxPrice ? `$${item.maxPrice.toLocaleString()}` : "—"}</td>
                        <td className="px-4 py-3">{formatDate(item.createdAt)}</td>
                      </tr>
                    ))}
                    {carFinders.length === 0 && (
                      <tr>
                        <td colSpan={7} className="text-center text-white/60 py-8">No Car Finder requests.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
