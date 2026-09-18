import { useEffect, useState } from "react";
import { API_URL } from "../config";

// Custom bell SVG mark (no Lucide)
const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 2a5 5 0 015 5v3l1.5 2.5H2.5L4 10V7a5 5 0 015-5z" />
    <path d="M7 15.5a2 2 0 004 0" />
  </svg>
);

const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [count, setCount] = useState(0);
  const [open, setOpen] = useState(false);

  const userId = localStorage.getItem("userId");

  const fetchData = async () => {
    try {
      const notifRes = await fetch(`${API_URL}/notifications/${userId}`);
      const notifData = await notifRes.json();
      setNotifications(notifData);

      const countRes = await fetch(`${API_URL}/notifications/unread/${userId}`);
      const countData = await countRes.json();
      setCount(countData.count);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggle = () => {
    setOpen(!open);
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`${API_URL}/notifications/read/${userId}`, { method: "PUT" });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setCount(0);
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const unreadNotifications = notifications.filter((n) => !n.isRead);

  const getNotifPill = (type) => {
    if (type === "APPROVED") return "bg-cleared-50 text-cleared";
    if (type === "REJECTED") return "bg-red-50 text-red-700";
    if (type === "PAYMENT") return "bg-amber-50 text-amber";
    return "bg-gray-50 text-gray-600";
  };

  return (
    <div className="relative">
      <button
        onClick={toggle}
        className="relative text-gray-500 hover:text-ledger transition-colors p-1"
        aria-label="Notifications"
      >
        <BellIcon />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center leading-none">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {/* Dropdown — intentional elevated element, only shadow here */}
      {open && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-100 rounded shadow-lg z-50">
          <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-sm text-ledger">Notifications</h3>
            <button
              onClick={markAllAsRead}
              className="text-xs text-cleared hover:underline"
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {unreadNotifications.length === 0 ? (
              <p className="px-4 py-6 text-sm text-gray-400 text-center">
                No new notifications
              </p>
            ) : (
              <ul className="divide-y divide-gray-50">
                {unreadNotifications.map((n) => (
                  <li key={n.id} className="px-4 py-3">
                    <span className={`pill text-xs ${getNotifPill(n.type)}`}>
                      {n.type}
                    </span>
                    <p className="text-sm text-gray-700 mt-1">{n.message}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
