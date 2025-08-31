"use client";
import { useState } from "react";
import { Bell } from "lucide-react";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export default function Notifications() {
  const [showNotifications, setShowNotifications] = useState(false);

  // Mock notifications - replace with API/DB fetch later
  const notifications: Notification[] = [
    {
      id: "1",
      title: "New Order",
      message: "You have received a new order #1234",
      time: "5 min ago",
      read: false,
    },
    {
      id: "2",
      title: "Low Stock Alert",
      message: "Product XYZ is running low on stock",
      time: "1 hour ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 relative"
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <div className="absolute -right-14 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <h3 className="font-semibold">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800 ${
                  !notification.read ? "bg-blue-50 dark:bg-blue-900/20" : ""
                }`}
              >
                <h4 className="font-medium">{notification.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {notification.message}
                </p>
                <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {notification.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
