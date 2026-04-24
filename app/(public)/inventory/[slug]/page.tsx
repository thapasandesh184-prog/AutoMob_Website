import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import VehicleDetailContent from "./content";
import JsonLd from "@/components/JsonLd";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const vehicle = await prisma.vehicle.findUnique({
      where: { slug },
    });

    if (!vehicle) {
      return {
        title: "Vehicle Not Found | SKay Auto group",
      };
    }

    const images = vehicle.images ? vehicle.images.split(",") : [];
    const firstImage = images[0] || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80";

    return {
      title: `${vehicle.year} ${vehicle.make} ${vehicle.model} | SKay Auto group`,
      description: `View the ${vehicle.year} ${vehicle.make} ${vehicle.model} at SKay Auto group. Price: $${vehicle.price.toLocaleString()}. ${vehicle.mileage.toLocaleString()} km.`,
      openGraph: {
        title: `${vehicle.year} ${vehicle.make} ${vehicle.model} | SKay Auto group`,
        description: `View the ${vehicle.year} ${vehicle.make} ${vehicle.model} at SKay Auto group. Price: $${vehicle.price.toLocaleString()}. ${vehicle.mileage.toLocaleString()} km.`,
        url: `https://skayautogroup.ca/inventory/${slug}`,
        siteName: "SKay Auto group",
        images: [
          {
            url: firstImage,
            width: 1200,
            height: 630,
            alt: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
          },
        ],
        locale: "en_CA",
        type: "website",
      },
    };
  } catch (error) {
    console.warn("generateMetadata: Could not fetch vehicle, returning fallback:", error);
    return {
      title: "Vehicle Details | SKay Auto group",
    };
  }
}

export default async function VehicleDetailPage({ params }: PageProps) {
  try {
    const { slug } = await params;
    const vehicle = await prisma.vehicle.findUnique({
      where: { slug },
    });

    if (!vehicle) {
      notFound();
    }

    const vehicleData = {
      ...vehicle,
      images: vehicle.images ? vehicle.images.split(",") : [],
      features: vehicle.features ? vehicle.features.split(",") : [],
      price: vehicle.price,
      mileage: vehicle.mileage,
      status: (vehicle.status as "available" | "sold" | "pending") || "available",
      createdAt: vehicle.createdAt.toISOString(),
      updatedAt: vehicle.updatedAt.toISOString(),
    };

    const breadcrumbLd = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://skayautogroup.ca",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Inventory",
          item: "https://skayautogroup.ca/inventory",
        },
        {
          "@type": "ListItem",
          position: 3,
          name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
          item: `https://skayautogroup.ca/inventory/${slug}`,
        },
      ],
    };

    const vehicleLd = {
      "@context": "https://schema.org",
      "@type": "Vehicle",
      name: `${vehicle.year} ${vehicle.make} ${vehicle.model}`,
      brand: {
        "@type": "Brand",
        name: vehicle.make,
      },
      model: vehicle.model,
      vehicleConfiguration: vehicle.bodyStyle || undefined,
      mileageFromOdometer: {
        "@type": "QuantitativeValue",
        value: vehicle.mileage,
        unitCode: "KMT",
      },
      color: vehicle.exteriorColor || undefined,
      vehicleInteriorColor: vehicle.interiorColor || undefined,
      vehicleEngine: vehicle.engine || undefined,
      vehicleTransmission: vehicle.transmission || undefined,
      fuelType: vehicle.fuelType || undefined,
      description: vehicle.description,
      image: (vehicle.images ? vehicle.images.split(",") : [])[0] || undefined,
      offers: {
        "@type": "Offer",
        price: vehicle.price,
        priceCurrency: "CAD",
        availability:
          vehicle.status === "available"
            ? "https://schema.org/InStock"
            : vehicle.status === "sold"
            ? "https://schema.org/OutOfStock"
            : "https://schema.org/InStock",
        url: `https://skayautogroup.ca/inventory/${slug}`,
      },
    };

    return (
      <>
        <JsonLd data={[breadcrumbLd, vehicleLd]} />
        <VehicleDetailContent vehicle={vehicleData} />
      </>
    );
  } catch (error) {
    console.warn("VehicleDetailPage: Could not fetch vehicle:", error);
    notFound();
  }
}
