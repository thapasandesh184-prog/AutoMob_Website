import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Car, Inbox, Settings, LogOut, Menu, X } from "lucide-react";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cars/new", label: "Add Vehicle", icon: Car },
  { href: "/admin/submissions", label: "Submissions", icon: Inbox },
  { href: "/admin/settings", label: "Site Settings", icon: Settings },
];

function Sidebar({ onClose }) {
  const location = useLocation();
  return (
    <aside className="hidden md:flex w-64 flex-col bg-[#0a0a0a] border-r border-white/10 h-screen sticky top-0">
      <div className="p-6 border-b border-white/10">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-[#C0A66A] to-[#9A854C] flex items-center justify-center">
            <span className="text-black font-bold text-sm">S</span>
          </div>
          <div>
            <span className="text-base font-semibold tracking-tight text-white">SKAY</span>
            <span className="block -mt-1 text-[9px] tracking-[0.3em] text-[#C0A66A]">ADMIN</span>
          </div>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.href || location.pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={onClose}
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
        <button
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-white/10 text-white hover:bg-white/5 rounded-md transition-colors"
          onClick={() => {
            localStorage.removeItem("adminToken");
            window.location.href = "/admin/login";
          }}
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function MobileHeader() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="md:hidden flex items-center justify-between p-4 bg-[#0a0a0a] border-b border-white/10 sticky top-0 z-50">
      <Link to="/admin/dashboard" className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-[#C0A66A] to-[#9A854C] flex items-center justify-center">
          <span className="text-black font-bold text-sm">S</span>
        </div>
        <span className="text-sm font-semibold text-white">ADMIN</span>
      </Link>
      <button
        className="p-2 text-white hover:text-[#C0A66A]"
        onClick={() => setOpen(!open)}
        aria-label="Open menu"
      >
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {open && (
        <div className="fixed inset-0 top-[57px] bg-[#0a0a0a] z-40 p-4 space-y-1">
          {navItems.map((item) => {
            const active = location.pathname === item.href || location.pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setOpen(false)}
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
          <div className="pt-4 border-t border-white/10 mt-4">
            <button
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium border border-white/10 text-white hover:bg-white/5 rounded-md transition-colors"
              onClick={() => {
                localStorage.removeItem("adminToken");
                window.location.href = "/admin/login";
              }}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token && location.pathname !== "/admin/login") {
      navigate("/admin/login", { replace: true });
    }
  }, [location.pathname, navigate]);

  if (location.pathname === "/admin/login") {
    return children;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      <MobileHeader />
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
