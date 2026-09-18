import { useEffect, useState } from "react";
import { API_URL } from "../config";

const TeamMembers = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMembers = async () => {
    try {
      const teamId = localStorage.getItem("teamId");
      const res = await fetch(`${API_URL}/teams/${teamId}/users`);
      const data = await res.json();
      setMembers(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading...</div>;

  return (
    <div className="p-8 max-w-4xl font-sans">
      <div className="mb-6">
        <h1 className="page-title">Team Members</h1>
        <p className="page-subtitle">Roster of employees and managers in your department</p>
      </div>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-12 text-center text-sm text-gray-400">
                    No team members found
                  </td>
                </tr>
              ) : (
                members.map((m) => {
                  const roleName = m.role?.roleName || m.role || "EMPLOYEE";
                  const isManager = roleName.toUpperCase().includes("MANAGER");

                  return (
                    <tr key={m.userId}>
                      <td className="font-medium text-ledger">{m.userName}</td>
                      <td>{m.email}</td>
                      <td>
                        <span
                          className={`pill ${
                            isManager ? "bg-ledger text-white" : "pill-default"
                          }`}
                        >
                          {roleName.replace("ROLE_", "")}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TeamMembers;
