"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { VehicleForm, type VehicleFormPayload } from "../vehicle-form";

export default function NewCarPage() {
  const router = useRouter();

  async function handleSubmit(data: VehicleFormPayload) {
    const res = await fetch("/api/admin/cars", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      toast.success("Vehicle created");
      router.push("/admin/dashboard");
    } else {
      toast.error("Failed to create vehicle");
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-gradient-gold">
          Add New Vehicle
        </h1>
        <div className="bg-[#111] border border-white/10 p-6">
          <VehicleForm onSubmit={handleSubmit} submitLabel="Create Vehicle" />
        </div>
      </div>
    </div>
  );
}
