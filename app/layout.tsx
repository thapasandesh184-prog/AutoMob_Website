import type { Metadata } from "next";
import { Inter, Oswald } from "next/font/google";
import Script from "next/script";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://skayautogroup.ca"),
  title: {
    default: "SKay Auto group | Luxury & Exotic Car Dealership",
    template: "%s | SKay Auto group",
  },
  description:
    "Discover the finest collection of luxury and exotic vehicles at SKay Auto group. Premium pre-owned cars, SUVs, and supercars with world-class service.",
  openGraph: {
    title: "SKay Auto group | Luxury & Exotic Car Dealership",
    description:
      "Discover the finest collection of luxury and exotic vehicles at SKay Auto group. Premium pre-owned cars, SUVs, and supercars with world-class service.",
    url: "https://skayautogroup.ca",
    siteName: "SKay Auto group",
    images: [
      {
        url: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80",
        width: 1200,
        height: 630,
        alt: "SKay Auto group Showroom",
      },
    ],
    locale: "en_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SKay Auto group | Luxury & Exotic Car Dealership",
    description:
      "Discover the finest collection of luxury and exotic vehicles at SKay Auto group. Premium pre-owned cars, SUVs, and supercars with world-class service.",
    images: ["https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80"],
  },
  alternates: {
    canonical: "./",
  },
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${oswald.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-black text-white">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-[#C0A66A] focus:text-black focus:font-medium"
        >
          Skip to main content
        </a>
        {children}
        <Toaster position="top-center" richColors />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(function(registrations) {
                  for (var i = 0; i < registrations.length; i++) {
                    registrations[i].unregister();
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
