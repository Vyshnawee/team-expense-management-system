import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { API_URL } from "../config";
import NotificationBell from "../Commons/NotificationBell";

const COLORS = [
  "#2A7D4F",
  "#C27B2B",
  "#1A2332",
  "#6B7280",
  "#3A9D63",
  "#06b6d4",
  "#ec4899",
  "#84cc16",
  "#f97316",
];

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const ManagerDashboard = () => {
  const [summary, setSummary] = useState({});
  const [monthly, setMonthly] = useState([]);
  const [category, setCategory] = useState([]);
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const teamId = localStorage.getItem("teamId");

      const [s, m, c, p] = await Promise.all([
        fetch(`${API_URL}/manager/dashboard/summary?teamId=${teamId}`),
        fetch(`${API_URL}/manager/dashboard/monthly?teamId=${teamId}`),
        fetch(`${API_URL}/manager/dashboard/category?teamId=${teamId}`),
        fetch(`${API_URL}/manager/dashboard/pending?teamId=${teamId}`),
      ]);

      setSummary(await s.json());
      setMonthly(await m.json());
      setCategory(await c.json());
      setPending(await p.json());

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    await fetch(`${API_URL}/manager/expenses/${id}/approve`, {
      method: "PUT",
    });
    fetchData();
  };

  const handleReject = async (id) => {
    await fetch(`${API_URL}/manager/expenses/${id}/reject`, {
      method: "PUT",
    });
    fetchData();
  };

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading...</div>;

  return (
    <div className="p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="page-title">Team Dashboard</h1>
          <p className="page-subtitle">Overview of team spending and pending reviews</p>
        </div>
        <NotificationBell />
      </div>

      {/* Summary Cards */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="panel p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Expenses</p>
          <p className="font-display text-2xl font-semibold text-ledger mt-2">
            ₹{Number(summary.total || 0).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="panel p-5 border-t-2 border-cleared">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Approved</p>
          <p className="font-display text-2xl font-semibold text-cleared mt-2">
            ₹{Number(summary.approved || 0).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="panel p-5 border-t-2 border-amber">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending</p>
          <p className="font-display text-2xl font-semibold text-amber mt-2">
            ₹{Number(summary.pending || 0).toLocaleString("en-IN")}
          </p>
        </div>

        <div className="panel p-5 border-t-2 border-red-400">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Rejected</p>
          <p className="font-display text-2xl font-semibold text-red-600 mt-2">
            ₹{Number(summary.rejected || 0).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="panel p-5">
          <h2 className="font-display text-base font-semibold text-ledger mb-4">Monthly Expenses</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthly}>
              <XAxis
                dataKey="month"
                tickFormatter={(m) => months[m - 1]}
                stroke="#6B7280"
                fontSize={12}
                tickLine={false}
              />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
              <Tooltip formatter={(val) => `₹${val}`} />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#2A7D4F"
                strokeWidth={2}
                dot={{ r: 3, fill: "#2A7D4F" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="panel p-5">
          <h2 className="font-display text-base font-semibold text-ledger mb-4">Category Breakdown</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={category}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={90}
                label={({ name, value }) => `${name}: ₹${value}`}
              >
                {category.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pending Approvals */}
      <div className="panel overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-display text-base font-semibold text-ledger">Pending Approvals</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-sm text-gray-400">
                    No pending approvals for your team
                  </td>
                </tr>
              ) : (
                pending.map((item) => (
                  <tr key={item.expenseId}>
                    <td className="font-medium text-ledger">{item.user?.userName || "—"}</td>
                    <td>{item.title}</td>
                    <td className="font-semibold text-ledger">₹{item.amount}</td>
                    <td>
                      <span className="pill-default">{item.category?.name || "Uncategorized"}</span>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleApprove(item.expenseId)}
                          className="btn-primary text-xs px-3 py-1"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(item.expenseId)}
                          className="border border-red-200 text-red-600 hover:bg-red-50 text-xs px-3 py-1 rounded transition-colors"
                        >
                          Reject
                        </button>
                      </div>
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

export default ManagerDashboard;
