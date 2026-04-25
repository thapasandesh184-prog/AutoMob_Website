import { useNavigate } from "react-router-dom";
import VehicleForm from "./VehicleForm";

export default function NewCarPage() {
  const navigate = useNavigate();

  async function handleSubmit(data) {
    const token = localStorage.getItem("adminToken");
    const res = await fetch("/api/admin/cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("Vehicle created");
      navigate("/admin/dashboard");
    } else {
      alert("Failed to create vehicle");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gradient-gold">Add New Vehicle</h1>
        <div className="bg-[#111] border border-white/10 p-6 rounded-lg">
          <VehicleForm onSubmit={handleSubmit} submitLabel="Create Vehicle" />
        </div>
      </div>
    </div>
  );
}
