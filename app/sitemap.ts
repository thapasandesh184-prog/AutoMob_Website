import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://skayautogroup.ca";

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

  return staticPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));
}
