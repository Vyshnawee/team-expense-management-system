import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const CheckIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const PaymentSuccess = () => {
  const [status, setStatus] = useState("loading");
  const hasCalled = useRef(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasCalled.current) return;
    hasCalled.current = true;

    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    const expenseId = params.get("expenseId");

    fetch(
      `${API_URL}/payments/success?sessionId=${sessionId}&expenseId=${expenseId}`
    )
      .then((res) => res.text())
      .then(() => setStatus("success"))
      .catch(() => setStatus("error"));
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream font-sans">
        <p className="text-sm text-gray-500 font-medium">Processing payment confirmation...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream font-sans">
        <div className="panel p-8 text-center max-w-sm w-full">
          <p className="text-red-600 font-display font-semibold text-lg mb-2">Payment Verification Failed</p>
          <p className="text-sm text-gray-500 mb-6">There was an issue recording your transaction status.</p>
          <button
            onClick={() => navigate("/admin/dashboard")}
            className="btn-secondary w-full"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream font-sans">
      <div className="panel p-8 text-center max-w-sm w-full">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-cleared-50 text-cleared flex items-center justify-center">
          <CheckIcon />
        </div>
        <h2 className="font-display text-xl font-semibold text-ledger mb-2">Payment Successful</h2>
        <p className="text-sm text-gray-500 mb-6">
          The reimbursement payment has been recorded and processed.
        </p>
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="btn-primary w-full py-2.5"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
