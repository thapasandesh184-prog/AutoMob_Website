"use client";

import { SessionProvider, useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { LayoutDashboard, Car, Inbox, Settings, FileText, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated" && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
  }, [status, pathname, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-black">
        <div className="animate-pulse text-[#C0A66A]">Loading...</div>
      </div>
    );
  }

  return <>{children}</>;
}

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cars/new", label: "Add Vehicle", icon: Car },
  { href: "/admin/submissions", label: "Submissions", icon: Inbox },

  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex w-64 flex-col bg-[#0a0a0a] border-r border-white/10 h-screen sticky top-0">
      <div className="p-6 border-b border-white/10">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#C0A66A] to-[#9A854C] flex items-center justify-center">
            <span className="text-black font-bold text-sm">P</span>
          </div>
          <div>
            <span className="text-base font-semibold tracking-tight text-white">PRESTIGE</span>
            <span className="block -mt-1 text-[9px] tracking-[0.3em] text-[#C0A66A]">ADMIN</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                active
                  ? "bg-[#C0A66A] text-black"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-white/10">
        <Button
          variant="outline"
          className="w-full border-white/10 text-white hover:bg-white/5"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}

function MobileHeader() {
  const pathname = usePathname();
  return (
    <div className="md:hidden flex items-center justify-between p-4 bg-[#0a0a0a] border-b border-white/10 sticky top-0 z-50">
      <Link href="/admin/dashboard" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-[#C0A66A] to-[#9A854C] flex items-center justify-center">
          <span className="text-black font-bold text-sm">P</span>
        </div>
        <span className="text-sm font-semibold text-white">ADMIN</span>
      </Link>
      <Sheet>
        <SheetTrigger
          render={
            <button className="p-2 text-white hover:text-[#C0A66A]" aria-label="Open menu">
              <Menu className="w-5 h-5" />
            </button>
          }
        />
        <SheetContent side="right" className="w-64 bg-[#0a0a0a] border-white/10 p-0">
          <nav className="flex-1 p-4 space-y-1 mt-6">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#C0A66A] text-black"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="p-4 border-t border-white/10">
            <Button
              variant="outline"
              className="w-full border-white/10 text-white hover:bg-white/5"
              onClick={() => signOut({ callbackUrl: "/admin/login" })}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminAuthGuard>
        <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
          <MobileHeader />
          <Sidebar />
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </AdminAuthGuard>
    </SessionProvider>
  );
}
