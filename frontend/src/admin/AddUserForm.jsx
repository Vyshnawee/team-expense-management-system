import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../config";

const AddUserForm = () => {
  const [form, setForm] = useState({
    userName: "",
    email: "",
    password: "",
    roleId: "",
  });
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const editUser = location.state?.user;

  useEffect(() => {
    fetch(`${API_URL}/roles`)
      .then((res) => res.json())
      .then((data) => setRoles(data || []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (editUser) {
      setForm({
        userName: editUser.userName || "",
        email: editUser.email || "",
        password: "",
        roleId: editUser.role?.roleId || "",
      });
    }
  }, [editUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (editUser) {
        // Bug fix: replace hardcoded http://localhost:8080 with API_URL
        await fetch(`${API_URL}/users/${editUser.userId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      } else {
        await fetch(`${API_URL}/users`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
      }

      navigate("/admin/users");
    } catch (err) {
      console.error(err);
      alert("Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-6 font-sans">
      <div className="mb-6">
        <h1 className="page-title">{editUser ? "Edit User" : "Add User"}</h1>
        <p className="page-subtitle">Manage user credentials and role assignment</p>
      </div>

      <div className="panel p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
              Username
            </label>
            <input
              type="text"
              name="userName"
              value={form.userName}
              placeholder="e.g., john_doe"
              onChange={handleChange}
              className="field-input"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="john@company.com"
              value={form.email}
              onChange={handleChange}
              className="field-input"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
              Password {editUser && "(Leave blank to keep unchanged)"}
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              className="field-input"
              required={!editUser}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
              Role
            </label>
            <select
              name="roleId"
              value={form.roleId}
              onChange={handleChange}
              className="field-input"
              required
            >
              <option value="" disabled>
                Select role
              </option>
              {roles.map((role) => (
                <option key={role.roleId} value={role.roleId}>
                  {role.roleName}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/users")}
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
                ? editUser
                  ? "Updating..."
                  : "Adding..."
                : editUser
                ? "Update User"
                : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUserForm;
