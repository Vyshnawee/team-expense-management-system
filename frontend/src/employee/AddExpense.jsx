import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const AddExpense = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const editData = location.state?.expense;

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/categories`)
      .then((res) => res.json())
      .then((data) => setCategories(data || []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (editData) {
      setTitle(editData.title || "");
      setAmount(editData.amount || "");
      setDescription(editData.description || "");
      setCategoryId(editData.categoryId || "");
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("User not logged in");
      return;
    }

    if (!categoryId) {
      alert("Please select category");
      return;
    }

    if (file && file.size > 5 * 1024 * 1024) {
      alert("File too large (max 5MB)");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("amount", Number(amount));
      formData.append("description", description);
      formData.append("categoryId", Number(categoryId));

      if (file) formData.append("file", file);

      const url = editData
        ? `${API_URL}/expenses/${editData.expenseId}`
        : `${API_URL}/expenses`;

      const method = editData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { userId: userId },
        body: formData,
      });

      const text = await res.text();

      if (res.ok) {
        setSuccess(
          editData
            ? "Expense updated successfully."
            : "Expense added successfully."
        );
        setTitle("");
        setAmount("");
        setDescription("");
        setCategoryId("");
        setFile(null);

        setTimeout(() => {
          navigate("/employee/expense");
        }, 1200);
      } else {
        alert("Failed: " + text);
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-6 font-sans">
      <div className="mb-6">
        <h1 className="page-title">{editData ? "Edit Expense" : "Add Expense"}</h1>
        <p className="page-subtitle">Enter the details of your business expense</p>
      </div>

      {success && (
        <div className="bg-cleared-50 border border-cleared-100 text-cleared px-4 py-3 rounded text-sm mb-4">
          {success}
        </div>
      )}

      <div className="panel p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
              Expense Title
            </label>
            <input
              type="text"
              className="field-input"
              placeholder="e.g., Client Dinner, Office Supplies"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
              Amount (₹)
            </label>
            <input
              type="number"
              className="field-input"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
              Category
            </label>
            <select
              className="field-input"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select category
              </option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
              Description
            </label>
            <textarea
              className="field-input min-h-[90px]"
              placeholder="Additional details regarding this expense"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
              Receipt / Attachment (Optional, max 5MB)
            </label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files[0])}
              className="block w-full text-xs text-gray-500 file:mr-3 file:py-2 file:px-3 file:rounded file:border-0 file:text-xs file:font-medium file:bg-gray-100 file:text-ledger hover:file:bg-gray-200 cursor-pointer"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/employee/expense")}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex-1 py-2.5"
            >
              {loading
                ? editData
                  ? "Updating..."
                  : "Adding..."
                : editData
                ? "Update Expense"
                : "Submit Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
