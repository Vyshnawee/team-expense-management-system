import { useEffect, useState } from "react";
import { API_URL } from "../config";
// Bug fix: capital C in Commons import
import NotificationBell from "../Commons/NotificationBell";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const AdminDashboard = () => {
  const [stats, setStats] = useState({});
  const [monthlyData, setMonthlyData] = useState([]);
  const [teamData, setTeamData] = useState([]);
  const [recentExpenses, setRecentExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const statsRes = await fetch(`${API_URL}/admin/dashboard`);
        setStats(await statsRes.json());

        const monthlyRes = await fetch(`${API_URL}/admin/dashboard/monthly`);
        setMonthlyData(await monthlyRes.json());

        const teamRes = await fetch(`${API_URL}/admin/dashboard/team-expenses`);
        setTeamData(await teamRes.json());

        const recentRes = await fetch(`${API_URL}/admin/dashboard/recent`);
        setRecentExpenses(await recentRes.json());

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const getStatusPill = (status) => {
    const s = status?.toLowerCase();
    if (s === "approved") return "pill-approved";
    if (s === "paid") return "pill-paid";
    if (s === "pending") return "pill-pending";
    if (s === "rejected") return "pill-rejected";
    return "pill-default";
  };

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading...</div>;

  return (
    <div className="p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Organization-wide summary and management overview</p>
        </div>
        <NotificationBell />
      </div>

      {/* Stats Row */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="panel p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Users</p>
          <p className="font-display text-2xl font-semibold text-ledger mt-2">
            {stats.totalUsers || 0}
          </p>
        </div>

        <div className="panel p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Expenses</p>
          <p className="font-display text-2xl font-semibold text-ledger mt-2">
            {stats.totalExpenses || 0}
          </p>
        </div>

        <div className="panel p-5 border-t-2 border-cleared">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Paid Amount</p>
          <p className="font-display text-2xl font-semibold text-cleared mt-2">
            ₹{Number(stats.paidAmount || 0).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="panel p-5 border-t-2 border-amber">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending Amount</p>
          <p className="font-display text-2xl font-semibold text-amber mt-2">
            ₹{Number(stats.pendingAmount || 0).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="panel p-5">
          <h2 className="font-display text-base font-semibold text-ledger mb-4">Monthly Expenses</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Line type="monotone" dataKey="amount" stroke="#2A7D4F" strokeWidth={2} dot={{ r: 3, fill: "#2A7D4F" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="panel p-5">
          <h2 className="font-display text-base font-semibold text-ledger mb-4">Team Expense Analysis</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={teamData}>
              <XAxis dataKey="teamName" stroke="#6B7280" fontSize={12} tickLine={false} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Bar dataKey="amount" fill="#1A2332" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Table */}
      <div className="panel overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-display text-base font-semibold text-ledger">Recent Organization Expenses</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentExpenses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-sm text-gray-400">
                    No recent expenses
                  </td>
                </tr>
              ) : (
                recentExpenses.map((exp) => (
                  <tr key={exp.id || exp.expenseId}>
                    <td className="font-medium text-ledger">{exp.userName}</td>
                    <td>{exp.title}</td>
                    <td className="font-semibold text-ledger">₹{exp.amount}</td>
                    <td>
                      <span className={getStatusPill(exp.status)}>{exp.status}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
