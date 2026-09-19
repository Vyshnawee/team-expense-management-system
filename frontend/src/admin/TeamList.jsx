import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

const TeamList = () => {
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const res = await fetch(`${API_URL}/teams`);
      const data = await res.json();
      setTeams(data || []);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this team?");
    if (!confirmDelete) return;

    await fetch(`${API_URL}/teams/${id}`, {
      method: "DELETE",
    });

    fetchTeams();
  };

  const handleEdit = (team) => {
    navigate("/admin/addTeam", { state: { team } });
  };

  if (loading) return <div className="p-8 text-sm text-gray-500">Loading...</div>;

  return (
    <div className="p-8 font-sans">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="page-title">Teams</h1>
          <p className="page-subtitle">Manage organizational teams and department leads</p>
        </div>
        <button
          onClick={() => navigate("/admin/addTeam")}
          className="btn-primary"
        >
          + Add Team
        </button>
      </div>

      <div className="panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Team Name</th>
                <th>Team ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teams.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-12 text-center text-sm text-gray-400">
                    No teams configured yet
                  </td>
                </tr>
              ) : (
                teams.map((team) => (
                  <tr key={team.teamId}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-ledger text-white font-display text-sm font-semibold flex items-center justify-center flex-shrink-0">
                          {team.teamName?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-ledger">{team.teamName}</span>
                      </div>
                    </td>
                    <td className="font-mono text-xs text-gray-500">{team.teamId}</td>
                    <td>
                      <div className="flex items-center gap-4 text-xs font-medium">
                        <button
                          onClick={() =>
                            navigate("/admin/teamDetails", { state: { team } })
                          }
                          className="text-cleared hover:underline"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleEdit(team)}
                          className="text-gray-600 hover:text-ledger"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(team.teamId)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
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

export default TeamList;
