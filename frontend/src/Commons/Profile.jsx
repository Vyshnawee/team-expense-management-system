import { useEffect, useState } from "react";
import { API_URL } from "../config";

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetch(`${API_URL}/users/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId]);

  if (loading) {
    return <div className="p-8 text-sm text-gray-500">Loading...</div>;
  }

  const initials = profile.userName
    ? profile.userName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const getRole = () => {
    const role = profile.role || "";
    return role.replace("ROLE_", "");
  };

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="page-title mb-6">Profile</h1>

      {/* Identity card */}
      <div className="panel p-6 mb-4 flex items-center gap-5">
        <div className="w-14 h-14 rounded-full bg-ledger flex items-center justify-center text-white font-display font-semibold text-lg flex-shrink-0">
          {initials}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-display text-xl font-semibold text-ledger truncate">
            {profile.userName || "—"}
          </h2>
          <p className="text-sm text-gray-500 truncate">{profile.email || "—"}</p>
          <span className="pill-default mt-2 inline-block">{getRole()}</span>
        </div>
      </div>

      {/* Details */}
      <div className="panel p-6">
        <h3 className="font-display text-base font-semibold text-ledger mb-5">
          Account details
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Username
            </p>
            <p className="text-sm text-ledger font-medium">
              {profile.userName || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Email
            </p>
            <p className="text-sm text-ledger font-medium">
              {profile.email || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Role
            </p>
            <p className="text-sm text-ledger font-medium">{getRole() || "—"}</p>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Team
            </p>
            <p className="text-sm text-ledger font-medium">
              {profile.teamName || "No team assigned"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
