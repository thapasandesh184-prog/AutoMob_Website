import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLoginPage() {
  const [mode, setMode] = useState("loading");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("/api/auth/check-admin")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          console.error("[LoginPage] check-admin failed:", data);
          setMode("error");
          setError(
            data.error || `Database check failed (HTTP ${res.status}). Check /api/db-test for details.`
          );
          return;
        }
        if (data.hasAdmin) {
          setMode("login");
        } else {
          setMode("setup");
          setEmail("admin@skayautogroup.ca");
        }
      })
      .catch((err) => {
        console.error("[LoginPage] check-admin network error:", err);
        setMode("error");
        setError("Network error connecting to server. Please try again.");
      });
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Invalid credentials");
      } else {
        localStorage.setItem("adminToken", data.token);
        navigate("/admin/dashboard");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSetup(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register-admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.details || data.error || "Failed to create account");
      } else {
        setSuccess("Admin account created! You can now log in.");
        setMode("login");
        setPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (mode === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="animate-pulse text-[#C0A66A]">Loading...</div>
      </div>
    );
  }

  if (mode === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-lg">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-center text-2xl text-red-400">Connection Error</h2>
          </div>
          <div className="p-6 space-y-4">
            <p className="text-sm text-white/80">{error}</p>
            <button
              className="w-full px-4 py-2 text-sm font-medium border border-white/10 text-white hover:bg-white/5 rounded-md transition-colors"
              onClick={() => (window.location.href = "/api/db-test")}
            >
              Run Database Diagnostics
            </button>
            <button
              className="w-full px-4 py-2 text-sm font-medium bg-[#C0A66A] text-black hover:bg-[#D4BC86] rounded-md transition-colors"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (mode === "setup") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4">
        <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-lg">
          <div className="p-6 border-b border-white/10">
            <h2 className="text-center text-2xl text-gradient-gold">Create Admin Account</h2>
            <p className="text-center text-sm text-white/60 mt-2">
              No admin found. Create the first account to continue.
            </p>
          </div>
          <div className="p-6">
            <form onSubmit={handleSetup} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-white">Email</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-white">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-white">Confirm Password</label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
                />
              </div>
              {error && <p className="text-sm text-red-400">{error}</p>}
              {success && <p className="text-sm text-green-400">{success}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-sm font-medium bg-[#C0A66A] text-black hover:bg-[#D4BC86] rounded-md transition-colors disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Account"}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-[#111] border border-white/10 rounded-lg">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-center text-2xl text-gradient-gold">Admin Login</h2>
        </div>
        <div className="p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-white">Email</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-white">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-black border border-white/10 text-white rounded-md focus:outline-none focus:border-[#C0A66A]/50 placeholder:text-white/40"
              />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 text-sm font-medium bg-[#C0A66A] text-black hover:bg-[#D4BC86] rounded-md transition-colors disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
