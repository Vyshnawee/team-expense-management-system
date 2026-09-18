import React, { useEffect, useState } from "react";
import PaymentButton from "./PaymentButton";
import { API_URL } from "../config";

const AdminPayments = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = () => {
      fetch(`${API_URL}/expenses/approved`)
        .then((res) => res.json())
        .then((data) => {
          setExpenses(data || []);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading...</div>;

  return (
    <div className="p-8 font-sans">
      <div className="mb-6">
        <h1 className="page-title">Payments Dashboard</h1>
        <p className="page-subtitle">View and process reimbursements for all approved claims</p>
      </div>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Employee</th>
                <th>Team</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {expenses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-sm text-gray-400">
                    No approved expenses awaiting payment
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.expenseId}>
                    <td className="font-medium text-ledger">{expense.title}</td>
                    <td className="font-semibold text-cleared">
                      ₹{expense.amount}
                    </td>
                    <td className="max-w-xs truncate">{expense.description || "—"}</td>
                    <td>{expense.userName || "—"}</td>
                    <td>{expense.teamName || "—"}</td>
                    <td>
                      <span className="pill-approved">{expense.status}</span>
                    </td>
                    <td>
                      <PaymentButton
                        expenseId={expense.expenseId}
                        amount={expense.amount}
                      />
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

export default AdminPayments;
