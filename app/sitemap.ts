import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://prestigemotors.com";

  const staticPages = [
    "",
    "/inventory",
    "/about",
    "/finance",
    "/finance/application",
    "/contact",
    "/directions",
    "/privacy",
    "/terms",
    "/sell-us-your-car",
    "/book-appointment",
    "/team",
    "/car-finder",
    "/compare",
    "/sitemap",
  ];

  const vehicles = await prisma.vehicle.findMany({
    where: { status: "available" },
    select: { slug: true, updatedAt: true },
  });

  return [
    ...staticPages.map((path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...vehicles.map((vehicle) => ({
      url: `${baseUrl}/inventory/${vehicle.slug}`,
      lastModified: vehicle.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ];
}
