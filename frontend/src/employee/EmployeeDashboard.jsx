import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import NotificationBell from "../Commons/NotificationBell";
import { API_URL } from "../config";

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
  Legend,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const COLORS = [
    "#2A7D4F",
    "#C27B2B",
    "#1A2332",
    "#6B7280",
    "#3A9D63",
    "#A0855A",
    "#4B5563",
  ];

  const getStatusPill = (status) => {
    const s = status?.toLowerCase();
    if (s === "approved") return "pill-approved";
    if (s === "paid") return "pill-paid";
    if (s === "pending") return "pill-pending";
    if (s === "rejected") return "pill-rejected";
    return "pill-default";
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");

    if (!userId || !token) {
      console.error("No userId or token found");
      return;
    }

    const monthNames = [
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

    const fetchDashboard = async () => {
      const res = await fetch(`${API_URL}/employee/dashboard/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setStats({
        totalAmount: data.totalAmount,
        paidAmount: data.paidAmount,
        pendingAmount: data.pendingAmount,
        thisMonth: data.thisMonth,
      });
    };

    const fetchMonthlyData = async () => {
      const res = await fetch(
        `${API_URL}/employee/dashboard/${userId}/monthly`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) return;
      const data = await res.json();
      const fullYear = Array.from({ length: 12 }, (_, i) => ({
        month: monthNames[i],
        amount: 0,
      }));
      data.forEach((item) => {
        const index = item.month - 1;
        if (index >= 0 && index < 12) {
          fullYear[index].amount = item.amount;
        }
      });
      setMonthlyData(fullYear);
    };

    const fetchCategoryData = async () => {
      const res = await fetch(
        `${API_URL}/employee/dashboard/${userId}/category`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) return;
      const data = await res.json();
      setCategoryData(data || []);
    };

    const fetchRecentExpenses = async () => {
      const res = await fetch(
        `${API_URL}/employee/dashboard/${userId}/recent`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (!res.ok) return;
      const data = await res.json();
      setExpenses(data || []);
    };

    const loadAll = async () => {
      await Promise.all([
        fetchDashboard(),
        fetchMonthlyData(),
        fetchCategoryData(),
        fetchRecentExpenses(),
      ]);
      setLoading(false);
    };

    loadAll();
  }, []);

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading...</div>;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">Welcome back — here is your expense overview</p>
        </div>
        <NotificationBell />
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mb-6">
        <Link to="/employee/add-expense" className="btn-primary">
          + Add Expense
        </Link>
        <Link to="/employee/expense" className="btn-secondary">
          View All Expenses
        </Link>
      </div>

      {/* Stats Row */}
      <div className="grid md:grid-cols-4 gap-4 mb-6">
        <div className="panel p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Total Expenses</p>
          <p className="font-display text-2xl font-semibold text-ledger mt-2">
            ₹{Number(stats.totalAmount || 0).toLocaleString("en-IN")}
          </p>
        </div>
        <div className="panel p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Paid</p>
          <p className="font-display text-2xl font-semibold text-cleared mt-2">
            ₹{Number(stats.paidAmount || 0).toLocaleString("en-IN")}
          </p>
        </div>
        <div className="panel p-5 border-t-2 border-amber">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Pending</p>
          <p className="font-display text-2xl font-semibold text-amber mt-2">
            ₹{Number(stats.pendingAmount || 0).toLocaleString("en-IN")}
          </p>
        </div>
        <div className="panel p-5">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">This Month</p>
          <p className="font-display text-2xl font-semibold text-ledger mt-2">
            ₹{Number(stats.thisMonth || 0).toLocaleString("en-IN")}
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <div className="panel p-5">
          <h2 className="font-display text-base font-semibold text-ledger mb-4">Monthly Spending</h2>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={monthlyData}>
              <XAxis dataKey="month" stroke="#6B7280" fontSize={12} tickLine={false} />
              <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Line type="monotone" dataKey="amount" stroke="#2A7D4F" strokeWidth={2} dot={{ r: 3, fill: "#2A7D4F" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="panel p-5">
          <h2 className="font-display text-base font-semibold text-ledger mb-4">Category Breakdown</h2>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie
                data={categoryData}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={80}
              >
                {categoryData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `₹${value}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Expenses */}
      <div className="panel overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
          <h2 className="font-display text-base font-semibold text-ledger">Recent Expenses</h2>
          <Link to="/employee/expense" className="text-xs text-cleared hover:underline font-medium">View all</Link>
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
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-8 text-center text-sm text-gray-400">
                    No recent expenses found
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
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

export default Dashboard;
