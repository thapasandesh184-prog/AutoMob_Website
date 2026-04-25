import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import VehicleForm from "./VehicleForm";

export default function EditCarPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);

  const authHeaders = () => {
    const token = localStorage.getItem("adminToken");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    async function fetchVehicle() {
      try {
        const res = await fetch(`/api/admin/cars/${id}`, { headers: authHeaders() });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setVehicle({
          make: data.make,
          model: data.model,
          year: data.year,
          price: data.price,
          msrp: data.msrp ?? undefined,
          mileage: data.mileage,
          stockNumber: data.stockNumber ?? undefined,
          vin: data.vin ?? undefined,
          bodyStyle: data.bodyStyle ?? undefined,
          transmission: data.transmission ?? undefined,
          engine: data.engine ?? undefined,
          fuelType: data.fuelType ?? undefined,
          driveType: data.driveType ?? undefined,
          exteriorColor: data.exteriorColor ?? undefined,
          interiorColor: data.interiorColor ?? undefined,
          description: data.description,
          features: data.features,
          status: data.status,
          featured: data.featured,
          images: data.images ? (Array.isArray(data.images) ? data.images : data.images.split(",")) : [],
          videoUrl: data.videoUrl || undefined,
        });
      } catch (err) {
        alert("Failed to load vehicle");
      } finally {
        setLoading(false);
      }
    }
    fetchVehicle();
  }, [id]);

  async function handleSubmit(data) {
    const token = localStorage.getItem("adminToken");
    const res = await fetch(`/api/admin/cars/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      alert("Vehicle updated");
      navigate("/admin/dashboard");
    } else {
      alert("Failed to update vehicle");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-[#C0A66A]">
        Loading...
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-red-400">
        Vehicle not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gradient-gold">Edit Vehicle</h1>
        <div className="bg-[#111] border border-white/10 p-6 rounded-lg">
          <VehicleForm
            defaultValues={vehicle}
            onSubmit={handleSubmit}
            submitLabel="Save Changes"
          />
        </div>
      </div>
    </div>
  );
}
