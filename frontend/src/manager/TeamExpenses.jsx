import { useEffect, useState } from "react";
import { API_URL } from "../config";

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="2,7 6,11 12,3"/>
  </svg>
);

const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="2" y1="2" x2="12" y2="12"/><line x1="12" y1="2" x2="2" y2="12"/>
  </svg>
);

const TeamExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const teamId = localStorage.getItem("teamId");

  const getStatusPill = (status) => {
    const s = status?.toLowerCase();
    if (s === "approved") return "pill-approved";
    if (s === "paid") return "pill-paid";
    if (s === "pending") return "pill-pending";
    if (s === "rejected") return "pill-rejected";
    return "pill-default";
  };

  const updateStatus = async (expenseId, status) => {
    try {
      const userId = localStorage.getItem("userId");

      if (status === "APPROVED") {
        await fetch(
          `${API_URL}/approvals/approve/${expenseId}?userId=${userId}`,
          { method: "POST" }
        );
      } else {
        await fetch(
          `${API_URL}/approvals/reject/${expenseId}?userId=${userId}`,
          { method: "POST" }
        );
      }

      fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const fetchExpenses = async () => {
    try {
      const res = await fetch(`${API_URL}/expenses/team/${teamId}`);
      const data = await res.json();
      setExpenses(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (teamId) fetchExpenses();
    else setLoading(false);
  }, [teamId]);

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading...</div>;

  return (
    <div className="p-8 font-sans">
      <div className="mb-6">
        <h1 className="page-title">Team Expenses</h1>
        <p className="page-subtitle">Review and manage expense claims from your team</p>
      </div>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Employee</th>
                <th>Category</th>
                <th>Status</th>
                <th>Date</th>
                <th>Receipt</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-sm text-gray-400">
                    No team expenses found
                  </td>
                </tr>
              ) : (
                expenses.map((exp) => (
                  <tr key={exp.expenseId}>
                    <td className="font-medium text-ledger">{exp.title}</td>
                    <td className="font-semibold text-ledger">₹{exp.amount}</td>
                    <td>{exp.user?.userName || "—"}</td>
                    <td>{exp.category?.name || "—"}</td>
                    <td>
                      <span className={getStatusPill(exp.status)}>{exp.status}</span>
                    </td>
                    <td className="text-gray-500">
                      {exp.createdAt
                        ? new Date(exp.createdAt).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                    <td>
                      {exp.receiptUrl ? (
                        <a
                          href={`${API_URL}${exp.receiptUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-cleared hover:underline font-medium"
                        >
                          View receipt
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">None</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateStatus(exp.expenseId, "APPROVED")}
                          className="bg-cleared-50 text-cleared hover:bg-cleared-100 px-2.5 py-1 text-xs rounded font-medium transition-colors inline-flex items-center gap-1"
                          title="Approve expense"
                        >
                          <CheckIcon /> Approve
                        </button>
                        <button
                          onClick={() => updateStatus(exp.expenseId, "REJECTED")}
                          className="bg-red-50 text-red-600 hover:bg-red-100 px-2.5 py-1 text-xs rounded font-medium transition-colors inline-flex items-center gap-1"
                          title="Reject expense"
                        >
                          <XIcon /> Reject
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

export default TeamExpenses;
