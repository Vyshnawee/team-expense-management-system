import { useEffect, useState } from "react";
import { API_URL } from "../config";

const Approvals = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApprovals = async () => {
    try {
      // Bug fix: template literal instead of plain string literal "${API_URL}/approvals"
      const res = await fetch(`${API_URL}/approvals`);
      const data = await res.json();
      setApprovals(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getStatusPill = (status) => {
    const s = status?.toLowerCase();
    if (s === "approved") return "pill-approved";
    if (s === "paid") return "pill-paid";
    if (s === "pending") return "pill-pending";
    if (s === "rejected") return "pill-rejected";
    return "pill-default";
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading...</div>;

  return (
    <div className="p-8 font-sans">
      <div className="mb-6">
        <h1 className="page-title">Approval History</h1>
        <p className="page-subtitle">Log of all approved and rejected expense decisions</p>
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
                <th>Decision Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {approvals.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-sm text-gray-400">
                    No approved expenses recorded yet
                  </td>
                </tr>
              ) : (
                approvals.map((a) => (
                  <tr key={a.approvalId}>
                    <td className="font-medium text-ledger">{a.expense?.title || "—"}</td>
                    <td className="font-semibold text-cleared">
                      ₹{a.expense?.amount}
                    </td>
                    <td className="max-w-xs truncate">{a.expense?.description || "—"}</td>
                    <td>{a.expense?.user?.userName || "—"}</td>
                    <td className="text-gray-500">
                      {a.approvedAt ? new Date(a.approvedAt).toLocaleString("en-IN") : "—"}
                    </td>
                    <td>
                      <span className={getStatusPill(a.status)}>{a.status}</span>
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

export default Approvals;
