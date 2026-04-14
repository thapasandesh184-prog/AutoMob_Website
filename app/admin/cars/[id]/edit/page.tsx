"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { VehicleForm, type VehicleFormPayload } from "../../vehicle-form";

export default function EditCarPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [vehicle, setVehicle] = useState<VehicleFormPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchVehicle() {
      try {
        const res = await fetch(`/api/admin/cars/${id}`);
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
          exteriorColor: data.exteriorColor ?? undefined,
          interiorColor: data.interiorColor ?? undefined,
          description: data.description,
          features: data.features,
          status: data.status,
          featured: data.featured,
          images: data.images ? data.images.split(",") : [],
        });
      } catch (err) {
        toast.error("Failed to load vehicle");
      } finally {
        setLoading(false);
      }
    }
    fetchVehicle();
  }, [id]);

  async function handleSubmit(data: VehicleFormPayload) {
    const res = await fetch(`/api/admin/cars/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success("Vehicle updated");
      router.push("/admin/dashboard");
    } else {
      toast.error("Failed to update vehicle");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-gold">
        Loading...
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-destructive">
        Vehicle not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gradient-gold">Edit Vehicle</h1>
        <div className="bg-[#111] border border-white/10 p-6">
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
