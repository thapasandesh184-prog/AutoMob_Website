import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import MapSection from "@/components/public/MapSection";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main id="main" className="flex-1 pt-[104px] md:pt-[120px]">
        {children}
      </main>
      <MapSection />
      <Footer />
    </>
  );
}
