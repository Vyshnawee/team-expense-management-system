import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";

const Signup = () => {
  const [form, setForm] = useState({
    companyName: "",
    adminName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Bug fix: was "string literal" not template literal in original
      const res = await fetch(`${API_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.text();

      if (!res.ok) {
        throw new Error(data || "Signup failed");
      }

      navigate("/login");
    } catch (err) {
      console.error(err);
      setError(err.message || "Signup failed. Please try again.");
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
            Set up your<br />organization.
          </h2>
          <p className="text-white/50 mt-4 text-sm leading-relaxed max-w-sm">
            Create your company account and start managing team expenses from day one.
          </p>
        </div>
        <p className="text-white/20 text-xs">
          &copy; {new Date().getFullYear()} TEMS
        </p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 bg-cream flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-2xl font-semibold text-ledger mb-1">Create account</h1>
          <p className="text-sm text-gray-500 mb-8">
            Already registered?{" "}
            <Link to="/login" className="text-cleared hover:underline">
              Sign in
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
                Company name
              </label>
              <input
                type="text"
                name="companyName"
                placeholder="Acme Corp"
                value={form.companyName}
                onChange={handleChange}
                className="field-input"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
                Admin name
              </label>
              <input
                type="text"
                name="adminName"
                placeholder="Your full name"
                value={form.adminName}
                onChange={handleChange}
                className="field-input"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                name="email"
                placeholder="admin@company.com"
                value={form.email}
                onChange={handleChange}
                className="field-input"
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
                name="password"
                placeholder="Choose a strong password"
                value={form.password}
                onChange={handleChange}
                className="field-input"
                required
                autoComplete="new-password"
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
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-xs text-gray-400 mt-8 text-center">
            By creating an account you agree to our{" "}
            <a href="#" className="hover:underline">Terms of Service</a>{" "}
            and{" "}
            <a href="#" className="hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
