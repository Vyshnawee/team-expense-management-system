import React, { useEffect, useState } from "react";
import { API_URL } from "../config";

const PaidExpenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/expenses/paid`)
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

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading...</div>;

  return (
    <div className="p-8 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="page-title">Paid Expenses</h1>
          <p className="page-subtitle">Historical record of completed reimbursements</p>
        </div>
        <span className="pill-paid">
          Total Paid: {expenses.length}
        </span>
      </div>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Amount</th>
                <th>Employee</th>
                <th>Team</th>
                <th>Status</th>
                <th>Paid Date</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(expenses) && expenses.length > 0 ? (
                expenses.map((exp) => (
                  <tr key={exp.expenseId}>
                    <td className="font-medium text-ledger">{exp.title}</td>
                    <td className="font-semibold text-cleared">₹{exp.amount}</td>
                    <td>{exp.userName || "—"}</td>
                    <td>{exp.teamName || "—"}</td>
                    <td>
                      <span className="pill-paid">PAID</span>
                    </td>
                    <td className="text-gray-500">
                      {exp.paidAt
                        ? new Date(exp.paidAt).toLocaleDateString("en-IN")
                        : "—"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-sm text-gray-400">
                    No paid expenses recorded
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

export default PaidExpenses;
