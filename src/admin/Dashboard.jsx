import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function AdminDashboardPage() {
  const [totalCars, setTotalCars] = useState(0);
  const [featuredCars, setFeaturedCars] = useState(0);
  const [availableCars, setAvailableCars] = useState(0);
  const [vehicles, setVehicles] = useState([]);
  const [contactCount, setContactCount] = useState(0);
  const [financeCount, setFinanceCount] = useState(0);
  const [tradeInCount, setTradeInCount] = useState(0);
  const [appointmentCount, setAppointmentCount] = useState(0);
  const [carFinderCount, setCarFinderCount] = useState(0);
  const [dbError, setDbError] = useState(null);
  const [loading, setLoading] = useState(true);

  const authHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch vehicles
        const carsRes = await fetch("/api/admin/cars", { headers: authHeaders() });
        if (!carsRes.ok) throw new Error("Failed to fetch cars");
        const allCars = await carsRes.json();
        setTotalCars(allCars.length);
        setFeaturedCars(allCars.filter((v) => v.featured).length);
        setAvailableCars(allCars.filter((v) => v.status === "available").length);
        setVehicles(allCars.slice(0, 10));

        // Fetch submission counts via separate type queries
        const [cRes, fRes, tRes, aRes, cfRes] = await Promise.all([
          fetch("/api/admin/submissions?type=contact", { headers: authHeaders() }),
          fetch("/api/admin/submissions?type=finance", { headers: authHeaders() }),
          fetch("/api/admin/submissions?type=tradein", { headers: authHeaders() }),
          fetch("/api/admin/submissions?type=appointments", { headers: authHeaders() }),
          fetch("/api/admin/submissions?type=carfinder", { headers: authHeaders() }),
        ]);
        if (cRes.ok) setContactCount((await cRes.json()).length);
        if (fRes.ok) setFinanceCount((await fRes.json()).length);
        if (tRes.ok) setTradeInCount((await tRes.json()).length);
        if (aRes.ok) setAppointmentCount((await aRes.json()).length);
        if (cfRes.ok) setCarFinderCount((await cfRes.json()).length);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        setDbError(error.message || "Could not connect to server.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;
    try {
      const res = await fetch(`/api/admin/cars/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        alert("Vehicle deleted");
        setVehicles((prev) => prev.filter((v) => v.id !== id));
        setTotalCars((prev) => prev - 1);
      } else {
        alert("Failed to delete vehicle");
      }
    } catch (err) {
      alert("Failed to delete vehicle");
    }
  }

  const statusBadgeClass = (status) => {
    if (status === "available") return "bg-green-600 text-white px-2 py-0.5 rounded text-xs font-medium";
    if (status === "sold") return "bg-red-500 text-white px-2 py-0.5 rounded text-xs font-medium";
    return "bg-white/10 text-white px-2 py-0.5 rounded text-xs font-medium";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="animate-pulse text-[#C0A66A]">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h1 className="text-2xl font-bold text-gradient-gold">Admin Dashboard</h1>
          <div className="flex items-center gap-2">
            <Link to="/admin/settings">
              <button className="px-4 py-2 text-sm font-medium border border-white/10 text-white hover:bg-white/5 rounded-md transition-colors">
                Site Settings
              </button>
            </Link>
            <Link to="/admin/cars/new">
              <button className="px-4 py-2 text-sm font-medium bg-[#C0A66A] text-black hover:bg-[#D4BC86] rounded-md transition-colors">
                Add New Vehicle
              </button>
            </Link>
          </div>
        </div>

        {dbError && (
          <div className="bg-red-900/30 border border-red-500/50 text-red-200 p-4 rounded-lg">
            <p className="font-semibold">Database Error</p>
            <p className="text-sm mt-1">{dbError}</p>
          </div>
        )}

        {/* Vehicle Stats */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="bg-[#111] border border-white/10 rounded-lg">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-sm text-white/60">Total Cars</h3>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-[#C0A66A]">{totalCars}</p>
            </div>
          </div>
          <div className="bg-[#111] border border-white/10 rounded-lg">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-sm text-white/60">Featured Cars</h3>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-[#C0A66A]">{featuredCars}</p>
            </div>
          </div>
          <div className="bg-[#111] border border-white/10 rounded-lg">
            <div className="p-4 border-b border-white/10">
              <h3 className="text-sm text-white/60">Available Cars</h3>
            </div>
            <div className="p-4">
              <p className="text-3xl font-bold text-[#C0A66A]">{availableCars}</p>
            </div>
          </div>
        </div>

        {/* Submission Stats */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Submissions</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-[#111] border border-white/10 rounded-lg">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-sm text-white/60">Contact</h3>
              </div>
              <div className="p-4 flex items-center justify-between">
                <p className="text-2xl font-bold text-[#C0A66A]">{contactCount}</p>
                <Link to="/admin/submissions?tab=contact">
                  <button className="px-3 py-1 text-xs font-medium border border-white/10 text-white hover:bg-white/5 rounded-md transition-colors">
                    View
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-[#111] border border-white/10 rounded-lg">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-sm text-white/60">Finance Apps</h3>
              </div>
              <div className="p-4 flex items-center justify-between">
                <p className="text-2xl font-bold text-[#C0A66A]">{financeCount}</p>
                <Link to="/admin/submissions?tab=finance">
                  <button className="px-3 py-1 text-xs font-medium border border-white/10 text-white hover:bg-white/5 rounded-md transition-colors">
                    View
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-[#111] border border-white/10 rounded-lg">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-sm text-white/60">Trade-Ins</h3>
              </div>
              <div className="p-4 flex items-center justify-between">
                <p className="text-2xl font-bold text-[#C0A66A]">{tradeInCount}</p>
                <Link to="/admin/submissions?tab=tradein">
                  <button className="px-3 py-1 text-xs font-medium border border-white/10 text-white hover:bg-white/5 rounded-md transition-colors">
                    View
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-[#111] border border-white/10 rounded-lg">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-sm text-white/60">Appointments</h3>
              </div>
              <div className="p-4 flex items-center justify-between">
                <p className="text-2xl font-bold text-[#C0A66A]">{appointmentCount}</p>
                <Link to="/admin/submissions?tab=appointments">
                  <button className="px-3 py-1 text-xs font-medium border border-white/10 text-white hover:bg-white/5 rounded-md transition-colors">
                    View
                  </button>
                </Link>
              </div>
            </div>
            <div className="bg-[#111] border border-white/10 rounded-lg">
              <div className="p-4 border-b border-white/10">
                <h3 className="text-sm text-white/60">Car Finder</h3>
              </div>
              <div className="p-4 flex items-center justify-between">
                <p className="text-2xl font-bold text-[#C0A66A]">{carFinderCount}</p>
                <Link to="/admin/submissions?tab=carfinder">
                  <button className="px-3 py-1 text-xs font-medium border border-white/10 text-white hover:bg-white/5 rounded-md transition-colors">
                    View
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Vehicles Table */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Recent Inventory</h2>
          <div className="bg-[#111] border border-white/10 overflow-hidden rounded-lg">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-4 py-3 font-medium text-white/60">Make</th>
                    <th className="text-left px-4 py-3 font-medium text-white/60">Model</th>
                    <th className="text-left px-4 py-3 font-medium text-white/60">Year</th>
                    <th className="text-left px-4 py-3 font-medium text-white/60">Price</th>
                    <th className="text-left px-4 py-3 font-medium text-white/60">Status</th>
                    <th className="text-left px-4 py-3 font-medium text-white/60">Featured</th>
                    <th className="text-right px-4 py-3 font-medium text-white/60">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="border-b border-white/10 hover:bg-white/5">
                      <td className="px-4 py-3">{vehicle.make}</td>
                      <td className="px-4 py-3">{vehicle.model}</td>
                      <td className="px-4 py-3">{vehicle.year}</td>
                      <td className="px-4 py-3">${vehicle.price?.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className={statusBadgeClass(vehicle.status)}>{vehicle.status}</span>
                      </td>
                      <td className="px-4 py-3">{vehicle.featured ? "Yes" : "No"}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Link to={`/admin/cars/${vehicle.id}/edit`}>
                            <button className="px-3 py-1 text-xs font-medium border border-white/10 text-white hover:bg-white/5 rounded-md transition-colors">
                              Edit
                            </button>
                          </Link>
                          <button
                            onClick={() => handleDelete(vehicle.id)}
                            className="px-3 py-1 text-xs font-medium bg-red-500 text-white hover:bg-red-600 rounded-md transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {vehicles.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-center text-white/60 py-8">
                        No vehicles found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
