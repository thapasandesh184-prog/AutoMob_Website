import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const defaultMapEmbed = "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26074!2d-123.084!3d49.136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDnCsDA4JzEwLjAiTiAxMjPCsDA1JzAyLjQiVw!5e0!3m2!1sen!2sca!4v1";

export function getSafeMapEmbedUrl(url?: string | null) {
  if (!url) return defaultMapEmbed;
  const trimmed = url.trim();
  if (trimmed.startsWith("https://www.google.com/maps/embed")) return trimmed;
  return defaultMapEmbed;
}
