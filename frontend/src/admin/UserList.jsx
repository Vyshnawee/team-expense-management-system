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

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="6" cy="6" r="4.5"/><line x1="9.5" y1="9.5" x2="13" y2="13"/>
  </svg>
);

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
    fetchRoles();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      const data = await response.json();
      setUsers(data || []);
      setFilteredUsers(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await fetch(`${API_URL}/roles`);
      const data = await response.json();
      setRoles(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    let filtered = users;

    if (search) {
      filtered = filtered.filter((user) =>
        user.userName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (role) {
      filtered = filtered.filter((user) => user.role === role);
    }

    setFilteredUsers(filtered);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
    });

    fetchUsers();
  };

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading...</div>;

  return (
    <div className="p-8 font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Manage user accounts, roles, and department assignments</p>
        </div>
        <button
          onClick={() => navigate("/admin/addUser")}
          className="btn-primary"
        >
          + Add User
        </button>
      </div>

      {/* Filter Row */}
      <div className="panel p-4 mb-6 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search by username..."
            className="field-input pl-8"
          />
          <div className="absolute left-2.5 top-3 text-gray-400">
            <SearchIcon />
          </div>
        </div>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="field-input w-40"
        >
          <option value="">All Roles</option>
          {roles.map((r, i) => (
            <option key={i} value={r.roleName}>
              {r.roleName}
            </option>
          ))}
        </select>

        <button onClick={handleSearch} className="btn-ledger">
          Search
        </button>
        <button
          onClick={() => {
            setSearch("");
            setRole("");
            setFilteredUsers(users);
          }}
          className="btn-secondary"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Team</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-12 text-center text-sm text-gray-400">
                    No users matching criteria
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.userId}>
                    <td className="font-medium text-ledger">{user.userName}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="pill-default">{user.role}</span>
                    </td>
                    <td>{user.teamName || "Unassigned"}</td>
                    <td>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() =>
                            navigate("/admin/addUser", { state: { user } })
                          }
                          className="text-amber hover:text-amber/80 transition-colors p-1"
                          title="Edit user"
                        >
                          <EditIcon />
                        </button>
                        <button
                          onClick={() => handleDelete(user.userId)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                          title="Delete user"
                        >
                          <TrashIcon />
                        </button>
                      </div>
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

export default UserList;
