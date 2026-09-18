import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("userId", data.userId);
      localStorage.setItem("teamId", data.teamId);

      const role = data.role?.replace("ROLE_", "").toUpperCase();

      if (role === "MANAGER") {
        navigate("/manager/dashboard");
      } else if (role === "EMPLOYEE") {
        navigate("/employee/dashboard");
      } else if (role === "ADMIN") {
        navigate("/admin");
      } else {
        setError("Unknown role: " + data.role);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">
      {/* Left brand panel */}
      <div className="hidden md:flex w-1/2 bg-ledger flex-col justify-between p-12">
        <span className="font-display text-2xl font-semibold text-white">TEMS</span>
        <div>
          <h2 className="font-display text-4xl font-semibold text-white leading-snug">
            Every expense.<br />Fully accounted for.
          </h2>
          <p className="text-white/50 mt-4 text-sm leading-relaxed max-w-sm">
            A transparent workflow from submission to reimbursement — for employees, managers, and finance teams.
          </p>
        </div>
        <p className="text-white/20 text-xs">
          &copy; {new Date().getFullYear()} TEMS
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 bg-cream flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-semibold text-ledger mb-1">Sign in</h1>
          <p className="text-sm text-gray-500 mb-8">
            New here?{" "}
            <Link to="/signup" className="text-cleared hover:underline">
              Create an account
            </Link>
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                placeholder="you@company.com"
                className="field-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
                Password
              </label>
              <input
                type="password"
                placeholder="Your password"
                className="field-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 px-3 py-2 rounded">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-ledger w-full py-2.5 mt-2"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-8 text-center">
            By signing in you agree to our{" "}
            <a href="#" className="hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
