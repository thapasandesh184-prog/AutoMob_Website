import { prisma } from "../lib/prisma";

const defaultSettings = [
  // General
  { key: "siteName", value: "SKay Auto group", group: "general" },
  { key: "siteTagline", value: "Richmond's Trusted Auto Group", group: "general" },
  { key: "phone", value: "+1 7789907468", group: "general" },
  { key: "email", value: "info@skayautogroup.ca", group: "general" },
  { key: "address", value: "Parking lot, 21320 Westminster Hwy #2128", group: "general" },
  { key: "city", value: "Richmond", group: "general" },
  { key: "state", value: "BC", group: "general" },
  { key: "zip", value: "V5W 3A3", group: "general" },
  { key: "country", value: "CA", group: "general" },
  { key: "hours", value: "Mon - Sat: 10am - 7pm", group: "general" },
  { key: "mapEmbedUrl", value: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26074!2d-123.084!3d49.136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDnCsDA4JzEwLjAiTiAxMjPCsDA1JzAyLjQiVw!5e0!3m2!1sen!2sca!4v1", group: "general" },
  // Social
  { key: "facebook", value: "#", group: "social" },
  { key: "instagram", value: "#", group: "social" },
  { key: "x", value: "#", group: "social" },
  { key: "youtube", value: "#", group: "social" },
  // Homepage Media
  { key: "heroVideo", value: "/videos/hero-video.mp4", group: "homepage" },
  { key: "heroPoster", value: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=1920&q=80", group: "homepage" },
  { key: "financingBgImage", value: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80", group: "homepage" },
  { key: "aboutImage", value: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=1200&q=80", group: "homepage" },
  // Brands JSON
  {
    key: "brands",
    value: JSON.stringify([
      { name: "Mercedes-Benz", image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&q=80" },
      { name: "BMW", image: "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600&q=80" },
      { name: "Porsche", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80" },
      { name: "Audi", image: "https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&q=80" },
      { name: "Lexus", image: "https://images.unsplash.com/photo-1628188687881-0a34984b3531?w=600&q=80" },
      { name: "Land Rover", image: "https://images.unsplash.com/photo-1606220838315-056192d5e927?w=600&q=80" },
      { name: "Bentley", image: "https://images.unsplash.com/photo-1566008885218-90abf9200ddb?w=600&q=80" },
      { name: "McLaren", image: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80" },
      { name: "Rolls-Royce", image: "https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=600&q=80" },
      { name: "Aston Martin", image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=600&q=80" },
      { name: "Tesla", image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80" },
      { name: "Lamborghini", image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=600&q=80" },
      { name: "Ferrari", image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80" },
      { name: "Maserati", image: "https://images.unsplash.com/photo-1575888787260-41970fb14803?w=600&q=80" },
      { name: "Jaguar", image: "https://images.unsplash.com/photo-1502877947493-61dd3b901668?w=600&q=80" },
    ]),
    group: "homepage",
  },
  // Quick Links JSON
  {
    key: "quickLinks",
    value: JSON.stringify([
      { title: "VIEW INVENTORY", href: "/inventory", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80" },
      { title: "APPLY FOR FINANCING", href: "/finance/application", image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&q=80" },
      { title: "SELL YOUR VEHICLE", href: "/sell-us-your-car", image: "https://images.unsplash.com/photo-1551830820-330a71b99659?w=800&q=80" },
      { title: "CONTACT US", href: "/contact", image: "https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=800&q=80" },
    ]),
    group: "homepage",
  },
  // SEO
  { key: "metaTitle", value: "SKay Auto group | Luxury & Exotic Car Dealership | Richmond", group: "seo" },
  { key: "metaDescription", value: "Discover the finest collection of luxury and exotic vehicles at SKay Auto group. Premium pre-owned cars, SUVs, and supercars with world-class service.", group: "seo" },
  { key: "ogImage", value: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80", group: "seo" },

];

async function main() {
  for (const s of defaultSettings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: {},
      create: s,
    });
  }
  console.log("Seeded default site settings and content");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
