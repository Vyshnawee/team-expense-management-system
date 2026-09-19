import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M9.5 2.5l2 2L4 12H2v-2L9.5 2.5z"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="2" y1="3.5" x2="12" y2="3.5"/>
    <path d="M5 3.5V2.5h4v1"/><path d="M3 3.5l1 9h6l1-9"/>
  </svg>
);

const MyExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User not logged in");
      return;
    }

    fetch(`${API_URL}/expenses/user/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setExpenses(data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const getStatusPill = (status) => {
    const s = status?.toLowerCase();
    if (s === "approved") return "pill-approved";
    if (s === "paid") return "pill-paid";
    if (s === "pending") return "pill-pending";
    if (s === "rejected") return "pill-rejected";
    return "pill-default";
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this expense?")) return;

    try {
      const res = await fetch(`${API_URL}/expenses/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setExpenses((prev) => prev.filter((exp) => exp.expenseId !== id));
      } else {
        alert("Delete failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (expense) => {
    navigate("/employee/add-expense", {
      state: { expense },
    });
  };

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading...</div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="page-title">My Expenses</h1>
          <p className="page-subtitle">Track and manage your submitted expenses</p>
        </div>
        <button
          onClick={() => navigate("/employee/add-expense")}
          className="btn-primary"
        >
          + Add Expense
        </button>
      </div>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Category</th>
                <th>Status</th>
                <th>Receipt</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length > 0 ? (
                expenses.map((exp) => (
                  <tr key={exp.expenseId}>
                    <td className="font-medium text-ledger">{exp.title}</td>
                    <td className="font-semibold text-ledger">₹{exp.amount}</td>
                    <td>{exp.categoryName || exp.category?.name || "—"}</td>
                    <td>
                      <span className={getStatusPill(exp.status)}>{exp.status}</span>
                    </td>
                    <td>
                      {exp.receiptUrl ? (
                        <a
                          href={
                            exp.receiptUrl.startsWith("http")
                              ? exp.receiptUrl
                              : `http://localhost:8080/${exp.receiptUrl.replace(
                                  /^\/?/,
                                  ""
                                )}`
                          }
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-cleared hover:underline font-medium"
                        >
                          View receipt
                        </a>
                      ) : (
                        <span className="text-xs text-gray-400">None</span>
                      )}
                    </td>
                    <td>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(exp)}
                          className="text-amber hover:text-amber/80 transition-colors p-1"
                          title="Edit expense"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(exp.expenseId)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                          title="Delete expense"
                        >
                          <TrashIcon />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-sm text-gray-400">
                    No expenses submitted yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyExpenses;
