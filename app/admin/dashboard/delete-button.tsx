"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    const res = await fetch(`/api/admin/cars/${id}`, {
      method: "DELETE",
    });

    if (res.ok) {
      toast.success("Vehicle deleted");
      router.refresh();
    } else {
      toast.error("Failed to delete vehicle");
    }
  }

  return (
    <Button variant="destructive" size="sm" onClick={handleDelete}>
      Delete
    </Button>
  );
}
