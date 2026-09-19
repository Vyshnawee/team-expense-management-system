import { NavLink, Outlet, useNavigate } from "react-router-dom";

const DashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="1" y="1" width="6" height="6" rx="1"/><rect x="9" y="1" width="6" height="6" rx="1"/>
    <rect x="1" y="9" width="6" height="6" rx="1"/><rect x="9" y="9" width="6" height="6" rx="1"/>
  </svg>
);

const ReceiptIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 1h10v14l-2-1.5L9 15l-2-1.5L5 15l-2-1.5V1z"/>
    <line x1="5" y1="5" x2="11" y2="5"/><line x1="5" y1="8" x2="9" y2="8"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="8" r="6.5"/><line x1="8" y1="5" x2="8" y2="11"/><line x1="5" y1="8" x2="11" y2="8"/>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="8" cy="5" r="3"/><path d="M2 14c0-3.314 2.686-6 6-6s6 2.686 6 6"/>
  </svg>
);

const SignOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M6 2H3a1 1 0 00-1 1v10a1 1 0 001 1h3"/><polyline points="10,5 13,8 10,11"/><line x1="13" y1="8" x2="5" y2="8"/>
  </svg>
);

const EmployeeSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex font-sans">
      <div className="w-56 h-screen bg-ledger fixed top-0 left-0 flex flex-col z-10">
        <div className="px-5 pt-6 pb-5 border-b border-white/10">
          <span className="font-display text-xl text-white font-semibold tracking-tight">TEMS</span>
          <p className="text-xs text-white/40 mt-0.5">Employee Portal</p>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <NavLink
            to="/employee/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors ${
                isActive
                  ? "bg-white/10 text-white font-medium border-l-2 border-cleared"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <DashIcon />
            Dashboard
          </NavLink>

          <NavLink
            to="/employee/expense"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors ${
                isActive
                  ? "bg-white/10 text-white font-medium border-l-2 border-cleared"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <ReceiptIcon />
            My Expenses
          </NavLink>

          <NavLink
            to="/employee/add-expense"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors ${
                isActive
                  ? "bg-white/10 text-white font-medium border-l-2 border-cleared"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <PlusIcon />
            Add Expense
          </NavLink>

          <NavLink
            to="/employee/profile"
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2 rounded text-sm transition-colors ${
                isActive
                  ? "bg-white/10 text-white font-medium border-l-2 border-cleared"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`
            }
          >
            <UserIcon />
            Profile
          </NavLink>
        </nav>

        <div className="px-3 pb-5">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-white/40 hover:text-white/80 transition-colors"
          >
            <SignOutIcon />
            Sign out
          </button>
        </div>
      </div>

      <div className="ml-56 flex-1 min-h-screen bg-cream">
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeSidebar;
