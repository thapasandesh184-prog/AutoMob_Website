import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const defaultMapEmbed = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2602!2d-123.1207!3d49.2827";

export function getSafeMapEmbedUrl(url?: string | null) {
  if (!url) return defaultMapEmbed;
  const trimmed = url.trim();
  if (trimmed.startsWith("https://www.google.com/maps/embed")) return trimmed;
  return defaultMapEmbed;
}
