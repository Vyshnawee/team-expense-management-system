import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../config";

const TeamForm = () => {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    teamName: "",
    managerName: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const editTeam = location.state?.team;

  useEffect(() => {
    fetch(`${API_URL}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data || []))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (editTeam) {
      setForm({
        teamName: editTeam.teamName || "",
        managerName: editTeam.manager?.userName || "",
      });
    }
  }, [editTeam]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const managerUser = users.find(
        (u) => u.userName.toLowerCase() === form.managerName.toLowerCase()
      );

      if (!managerUser) {
        alert("Manager user not found. Please verify the exact username.");
        setLoading(false);
        return;
      }

      const payload = {
        teamName: form.teamName,
        createdById: Number(localStorage.getItem("userId")),
        managerId: managerUser.userId,
      };

      const res = await fetch(`${API_URL}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to create team");

      navigate("/admin/teams");
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto py-8 px-6 font-sans">
      <div className="mb-6">
        <h1 className="page-title">{editTeam ? "Edit Team" : "Add Team"}</h1>
        <p className="page-subtitle">Configure team details and assign a department manager</p>
      </div>

      <div className="panel p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
              Team Name
            </label>
            <input
              type="text"
              name="teamName"
              placeholder="e.g., Engineering, Marketing"
              value={form.teamName}
              onChange={handleChange}
              className="field-input"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
              Manager Username
            </label>
            <input
              type="text"
              name="managerName"
              placeholder="Exact username of assigned manager"
              value={form.managerName}
              onChange={handleChange}
              className="field-input"
              required
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={() => navigate("/admin/teams")}
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
                ? editTeam
                  ? "Updating..."
                  : "Adding..."
                : editTeam
                ? "Update Team"
                : "Create Team"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamForm;
