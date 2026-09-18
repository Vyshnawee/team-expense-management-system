import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { API_URL } from "../config";

const TeamDetails = () => {
  const location = useLocation();
  const { team } = location.state || {};

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if (!team?.teamId) return;

        const res = await fetch(`${API_URL}/teams/${team.teamId}/users`);
        if (!res.ok) throw new Error("Failed to fetch users");

        const data = await res.json();
        setUsers(data || []);
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching team members.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [team]);

  useEffect(() => {
    const fetchAvailableUsers = async () => {
      try {
        // Bug fix: template literal instead of plain string literal "${API_URL}/users/available-employees"
        const res = await fetch(`${API_URL}/users/available-employees`);
        if (!res.ok) throw new Error("Failed to fetch employees");

        const data = await res.json();
        setAvailableUsers(data || []);
      } catch (err) {
        console.error(err);
      }
    };

    if (showModal) {
      fetchAvailableUsers();
    }
  }, [showModal]);

  const handleAddUser = async () => {
    if (!selectedUserId) return;
    const userId = parseInt(selectedUserId);

    try {
      const res = await fetch(
        `${API_URL}/teams/${team.teamId}/member/${userId}`,
        { method: "POST" }
      );

      if (!res.ok) throw new Error("Failed to add user");

      const updatedRes = await fetch(`${API_URL}/teams/${team.teamId}/users`);
      const updatedUsers = await updatedRes.json();
      setUsers(updatedUsers || []);

      setAvailableUsers((prev) => prev.filter((u) => u.userId !== userId));
      setShowModal(false);
      setSelectedUserId("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemove = async (userId) => {
    try {
      const res = await fetch(
        `${API_URL}/teams/${team.teamId}/users/${userId}/remove`,
        { method: "PUT" }
      );

      if (!res.ok) throw new Error("Failed to remove user");

      setUsers((prev) => prev.filter((u) => u.userId !== userId));
    } catch (err) {
      console.error(err);
    }
  };

  if (!team) {
    return (
      <div className="p-8 font-sans">
        <div className="panel p-6 text-red-600 text-sm">
          No team selected. Please return to the Teams list and select View Details.
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="page-title">Team: {team.teamName}</h1>
          <p className="page-subtitle">Manage members assigned to this team</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          + Add Member
        </button>
      </div>

      {loading && <div className="p-4 text-sm text-gray-500">Loading team members...</div>}
      {error && <div className="p-4 text-sm text-red-600 mb-4">{error}</div>}

      {!loading && (
        <div className="panel overflow-hidden">
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-sm text-gray-400">
                      No members assigned to this team
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.userId}>
                      <td className="font-mono text-xs text-gray-500">{user.userId}</td>
                      <td className="font-medium text-ledger">{user.userName}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className="pill-default">{user.role?.roleName || user.role}</span>
                      </td>
                      <td>
                        <button
                          onClick={() => handleRemove(user.userId)}
                          className="text-xs text-red-600 hover:text-red-800 font-medium"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-ledger/40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-96 shadow-lg border border-gray-100 font-sans">
            <h2 className="font-display text-lg font-semibold text-ledger mb-4">
              Add Member to {team.teamName}
            </h2>

            <label className="block text-xs font-medium text-gray-600 mb-1.5 uppercase tracking-wide">
              Select Employee
            </label>
            <select
              className="field-input mb-5"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
            >
              <option value="">Choose an available employee</option>
              {availableUsers.map((user) => (
                <option key={user.userId} value={user.userId}>
                  {user.userName} ({user.email})
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleAddUser}
                disabled={!selectedUserId}
                className="btn-primary text-xs"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamDetails;
