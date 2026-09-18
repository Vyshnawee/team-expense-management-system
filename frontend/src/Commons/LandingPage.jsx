import { useNavigate, Link } from "react-router-dom";
import dashboardImg from "../assets/dashboard.png";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-cream font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <span className="font-display text-xl font-semibold text-ledger">TEMS</span>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm text-gray-500 hover:text-ledger transition-colors">Sign in</Link>
          <button
            onClick={() => navigate("/signup")}
            className="btn-ledger"
          >
            Get started
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 py-20 max-w-5xl mx-auto">
        <div className="max-w-2xl">
          <h1 className="font-display text-5xl font-semibold text-ledger leading-tight">
            Expense management<br />
            your team will<br />
            <span className="text-cleared">actually use.</span>
          </h1>
          <p className="text-gray-500 mt-6 text-lg leading-relaxed max-w-xl">
            TEMS gives employees a straightforward way to submit expenses, managers the tools to review them instantly, and finance teams a clear audit trail — all in one place.
          </p>
          <div className="flex items-center gap-4 mt-8">
            <button onClick={() => navigate("/signup")} className="btn-ledger px-6 py-2.5 text-base">
              Start free
            </button>
            <Link to="/login" className="text-sm text-gray-500 hover:text-ledger transition-colors">
              Already have an account? Sign in
            </Link>
          </div>
        </div>
      </section>

      {/* Stats row */}
      <section className="px-8 py-8 border-y border-gray-100 bg-white">
        <div className="max-w-5xl mx-auto flex gap-12 items-center">
          <div>
            <p className="font-display text-3xl font-semibold text-ledger">100+</p>
            <p className="text-sm text-gray-500 mt-1">Expenses tracked</p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div>
            <p className="font-display text-3xl font-semibold text-ledger">50+</p>
            <p className="text-sm text-gray-500 mt-1">Active users</p>
          </div>
          <div className="w-px h-10 bg-gray-200" />
          <div>
            <p className="font-display text-3xl font-semibold text-ledger">3 roles</p>
            <p className="text-sm text-gray-500 mt-1">Employee, Manager, Admin</p>
          </div>
        </div>
      </section>

      {/* Dashboard preview */}
      <section className="px-8 py-20 max-w-5xl mx-auto">
        <h2 className="font-display text-3xl font-semibold text-ledger mb-3">
          One view for the whole picture.
        </h2>
        <p className="text-gray-500 max-w-xl mb-10">
          Dashboards update in real time. Submit, approve, and pay without switching tools or waiting for email chains.
        </p>
        <div className="border border-gray-200 rounded overflow-hidden bg-white">
          <div className="bg-ledger px-4 py-2.5 flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="w-2.5 h-2.5 rounded-full bg-white/20" />
            <span className="ml-3 text-white/50 text-xs font-mono">tems.app/dashboard</span>
          </div>
          <img alt="TEMS dashboard preview" src={dashboardImg} className="w-full h-auto" />
        </div>
      </section>

      {/* How it works — numbered, not 3 identical cards */}
      <section className="px-8 py-20 bg-white border-y border-gray-100">
        <div className="max-w-5xl mx-auto">
          <h2 className="font-display text-3xl font-semibold text-ledger mb-12">How it works</h2>
          <div className="space-y-10">
            <div className="flex gap-8 items-start">
              <span className="font-display text-5xl font-semibold text-gray-100 leading-none select-none">01</span>
              <div>
                <h3 className="font-semibold text-ledger text-lg mb-1">Employee submits</h3>
                <p className="text-gray-500 max-w-md">Fill out the expense form with title, amount, category, and an optional receipt. Submitted in under a minute.</p>
              </div>
            </div>
            <div className="w-full h-px bg-gray-100" />
            <div className="flex gap-8 items-start">
              <span className="font-display text-5xl font-semibold text-gray-100 leading-none select-none">02</span>
              <div>
                <h3 className="font-semibold text-ledger text-lg mb-1">Manager reviews</h3>
                <p className="text-gray-500 max-w-md">Managers see pending expenses immediately. One click to approve or reject, with the full detail in view.</p>
              </div>
            </div>
            <div className="w-full h-px bg-gray-100" />
            <div className="flex gap-8 items-start">
              <span className="font-display text-5xl font-semibold text-gray-100 leading-none select-none">03</span>
              <div>
                <h3 className="font-semibold text-ledger text-lg mb-1">Admin pays</h3>
                <p className="text-gray-500 max-w-md">Approved expenses queue in the payments dashboard. Secure Stripe checkout handles the transfer — no manual bank transfers.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roles */}
      <section className="px-8 py-20 max-w-5xl mx-auto">
        <h2 className="font-display text-3xl font-semibold text-ledger mb-10">Built for every role</h2>
        <div className="grid md:grid-cols-3 gap-0 border border-gray-100 rounded overflow-hidden">
          <div className="p-6 border-r border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Employee</p>
            <h3 className="font-display text-lg font-semibold text-ledger mb-2">Submit and track</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Add expenses with supporting receipts. Track status from pending to paid without chasing anyone.</p>
          </div>
          <div className="p-6 border-r border-gray-100 bg-cream">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Manager</p>
            <h3 className="font-display text-lg font-semibold text-ledger mb-2">Review and decide</h3>
            <p className="text-sm text-gray-500 leading-relaxed">See your team's expenses in real time. Approve or reject with context — category, description, receipt — all in one row.</p>
          </div>
          <div className="p-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Admin</p>
            <h3 className="font-display text-lg font-semibold text-ledger mb-2">Manage and pay</h3>
            <p className="text-sm text-gray-500 leading-relaxed">Full oversight of users, teams, and approved expenses. Process payments securely and view the complete paid history.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-20 bg-ledger text-center">
        <h2 className="font-display text-3xl font-semibold text-white mb-4">
          Ready to bring order to your team expenses?
        </h2>
        <p className="text-white/60 mb-8 max-w-md mx-auto">
          Get your organization set up in minutes. No spreadsheets required.
        </p>
        <button
          onClick={() => navigate("/signup")}
          className="bg-cleared text-white px-8 py-3 rounded font-medium hover:bg-cleared-light transition-colors"
        >
          Create your account
        </button>
      </section>

      {/* Footer */}
      <footer className="px-8 py-6 bg-ledger-dark border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-3">
        <span className="font-display text-sm text-white/40">TEMS — Team Expense Management</span>
        <div className="flex gap-6 text-xs text-white/30">
          <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
