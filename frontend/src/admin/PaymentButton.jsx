import { API_URL } from "../config";

const PaymentButton = ({ expenseId, amount }) => {
  const handlePayment = async () => {
    try {
      const response = await fetch(
        `${API_URL}/payments/create-checkout-session/${expenseId}`,
        { method: "POST" }
      );

      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert("Payment session could not be created. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      alert("Payment failed. Please try again.");
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="bg-cleared text-white px-3 py-1.5 text-xs font-medium rounded hover:bg-cleared-light transition-colors"
    >
      Pay ₹{Number(amount).toLocaleString("en-IN")}
    </button>
  );
};

export default PaymentButton;
