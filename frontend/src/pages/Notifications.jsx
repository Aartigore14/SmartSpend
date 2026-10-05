import Navbar from "../components/Navbar";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import "../styles/notifications.css";

function Notifications() {
  const { user } = useAuth();

  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState("ALL");
  const [typeFilter, setTypeFilter] = useState("ALL");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.userId) {
      fetchNotifications();
    }
  }, [user]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get(
        `/notifications/user/${user.userId}`
      );

      setNotifications(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, isRead: true }
            : notification
        )
      );
    } catch (err) {
      console.error(err);
      setError("Failed to mark notification as read.");
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put(
        `/notifications/user/${user.userId}/read-all`
      );

      setNotifications((prev) =>
        prev.map((notification) => ({
          ...notification,
          isRead: true,
        }))
      );
    } catch (err) {
      console.error(err);
      setError("Failed to mark all notifications as read.");
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.delete(`/notifications/${id}`);

      setNotifications((prev) =>
        prev.filter((notification) => notification.id !== id)
      );
    } catch (err) {
      console.error(err);
      setError("Failed to delete notification.");
    }
  };

  const unreadCount = notifications.filter(
    (notification) => !notification.isRead
  ).length;

  const notificationTypes = useMemo(() => {
    const types = notifications
      .map((notification) => notification.type)
      .filter(Boolean)
      .map((type) => type.toUpperCase());

    return [...new Set(types)];
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((notification) => {
      const matchesReadFilter =
        filter === "ALL" ||
        (filter === "UNREAD" && !notification.isRead) ||
        (filter === "READ" && notification.isRead);

      const matchesTypeFilter =
        typeFilter === "ALL" ||
        notification.type?.toUpperCase() === typeFilter;

      return matchesReadFilter && matchesTypeFilter;
    });
  }, [notifications, filter, typeFilter]);

  const getTypeLabel = (type) => {
    if (!type) return "Notification";

    return type
      .toLowerCase()
      .split("_")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  const getTypeClass = (type) => {
    const normalizedType = type?.toUpperCase();

    if (normalizedType?.includes("BUDGET")) {
      return "budget";
    }

    if (normalizedType?.includes("SAVING")) {
      return "saving";
    }

    if (normalizedType?.includes("TRANSACTION")) {
      return "transaction";
    }

    if (normalizedType?.includes("ALERT")) {
      return "alert";
    }

    return "general";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return dateString;
    }

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
        <><Navbar/>
      <div className="notifications-page">
        <div className="notifications-loading">
          Loading notifications...
        </div>
      </div>
      </>
    );
  }

  return (
     <><Navbar/>
    <div className="notifications-page">

      {/* Header */}
      <div className="notifications-header">
        <div>
          <p className="page-eyebrow">
            SMARTSPEND ALERTS
          </p>

          <h1>Notifications</h1>

          <p>
            Stay updated with important activity and alerts
            from your SmartSpend account.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            className="mark-all-btn"
            onClick={markAllAsRead}
          >
            Mark all as read
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="notifications-error">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="notifications-summary">

        <div className="notification-stat">
          <span>Total</span>
          <strong>{notifications.length}</strong>
        </div>

        <div className="notification-stat">
          <span>Unread</span>
          <strong>{unreadCount}</strong>
        </div>

        <div className="notification-stat">
          <span>Read</span>
          <strong>
            {notifications.length - unreadCount}
          </strong>
        </div>

      </div>

      {/* Filters */}
      <div className="notification-filters">

        <div className="read-filters">
          <button
            className={
              filter === "ALL" ? "active" : ""
            }
            onClick={() => setFilter("ALL")}
          >
            All
          </button>

          <button
            className={
              filter === "UNREAD" ? "active" : ""
            }
            onClick={() => setFilter("UNREAD")}
          >
            Unread
            {unreadCount > 0 && (
              <span className="filter-count">
                {unreadCount}
              </span>
            )}
          </button>

          <button
            className={
              filter === "READ" ? "active" : ""
            }
            onClick={() => setFilter("READ")}
          >
            Read
          </button>
        </div>

        <select
          value={typeFilter}
          onChange={(e) =>
            setTypeFilter(e.target.value)
          }
        >
          <option value="ALL">All Types</option>

          {notificationTypes.map((type) => (
            <option key={type} value={type}>
              {getTypeLabel(type)}
            </option>
          ))}
        </select>

      </div>

      {/* Notifications */}
      {filteredNotifications.length === 0 ? (
        <div className="notifications-empty">

          <div className="empty-icon">🔔</div>

          <h2>
            {notifications.length === 0
              ? "No notifications yet"
              : "No matching notifications"}
          </h2>

          <p>
            {notifications.length === 0
              ? "You're all caught up. Important SmartSpend alerts will appear here."
              : "Try changing the filters to see other notifications."}
          </p>

        </div>
      ) : (
        <div className="notifications-list">

          {filteredNotifications.map(
            (notification) => (
              <div
                className={`notification-card ${
                  notification.isRead
                    ? "read"
                    : "unread"
                }`}
                key={notification.id}
              >

                <div
                  className={`notification-icon ${getTypeClass(
                    notification.type
                  )}`}
                >
                  {notification.type
                    ?.toUpperCase()
                    .includes("BUDGET")
                    ? "₹"
                    : notification.type
                        ?.toUpperCase()
                        .includes("SAVING")
                    ? "🎯"
                    : notification.type
                        ?.toUpperCase()
                        .includes("TRANSACTION")
                    ? "↔"
                    : "🔔"}
                </div>

                <div className="notification-content">

                  <div className="notification-top">

                    <div>
                      <div className="notification-title-row">

                        <h2>
                          {notification.title}
                        </h2>

                        {!notification.isRead && (
                          <span className="unread-dot" />
                        )}

                      </div>

                      <span
                        className={`notification-type ${getTypeClass(
                          notification.type
                        )}`}
                      >
                        {getTypeLabel(
                          notification.type
                        )}
                      </span>
                    </div>

                    <span className="notification-date">
                      {formatDate(
                        notification.createdAt
                      )}
                    </span>

                  </div>

                  <p className="notification-message">
                    {notification.message}
                  </p>

                  <div className="notification-actions">

                    {!notification.isRead && (
                      <button
                        className="read-btn"
                        onClick={() =>
                          markAsRead(
                            notification.id
                          )
                        }
                      >
                        Mark as read
                      </button>
                    )}

                    <button
                      className="delete-notification-btn"
                      onClick={() =>
                        deleteNotification(
                          notification.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              </div>
            )
          )}

        </div>
      )}

    </div>
    </>
  );
}

export default Notifications;