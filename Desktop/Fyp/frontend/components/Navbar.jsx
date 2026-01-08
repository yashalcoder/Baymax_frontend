// Navbar.jsx
"use client";
import { useMemo } from "react";
import assistantImage from "../public/assistantImage.png";
import patientImage from "../public/patientImage.png";
import { useSidebar } from "@/components/sidebar-provider";
import { Button } from "@/components/ui/button";
// Import enhanced icons for notifications and management
import {
  Bell,
  Menu,
  Settings,
  Mail,
  FileText,
  Clock,
  CheckCheck,
} from "lucide-react";
import Sidebar from "./sidebar";
import Image from "next/image";
import doctorImage from "../public/images.jpg";
import logo from "../public/logo-removebg-preview.png";
import { useState, useRef, useEffect } from "react";

// --- Initial Notification Data (used to initialize state) ---
const initialNotifications = [
  {
    id: 1,
    type: "message",
    text: "New message from Jane Doe.",
    icon: Mail,
    time: "2 min ago",
  },
  {
    id: 2,
    type: "report",
    text: "Your report is ready for download.",
    icon: FileText,
    time: "1 hour ago",
  },
  {
    id: 3,
    type: "overdue",
    text: 'Task "Implement Feature X" is overdue.',
    icon: Clock,
    time: "3 hours ago",
  },
];

// --- Notification Icon Mapping Function ---
const getNotificationIcon = (type) => {
  switch (type) {
    case "message":
      return { Icon: Mail, color: "text-blue-500" };
    case "report":
      return { Icon: FileText, color: "text-indigo-500" };
    case "overdue":
      return { Icon: Clock, color: "text-red-500" };
    default:
      return { Icon: Mail, color: "text-gray-500" };
  }
};

export default function Navbar() {
  const { collapsed, setCollapsed } = useSidebar();
  const [showNotifications, setShowNotifications] = useState(false);
  // State for notifications
  const [notifications, setNotifications] = useState(initialNotifications);
  const notificationRef = useRef(null);
  const [user, setUser] = useState(null);
  // Calculate notification count
  const notificationCount = notifications.length;

  const toggleNotifications = () => {
    setShowNotifications((prev) => !prev);
  };

  // Function to clear all notifications
  const markAllAsRead = () => {
    setNotifications([]); // Clears all notifications
    setShowNotifications(false); // Closes the dropdown
  };
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
      console.log(JSON.parse(stored));
    }
  }, []);
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const profileImageSource = useMemo(() => {
    if (user?.role === "pharmacy") {
      return patientImage;
    } else if (user?.role === "doctor") {
      return doctorImage;
    } else if (user?.role === "patient") {
      return patientImage;
    } else if (user?.role === "lab") {
      return patientImage;
    } else if (user?.role === "assistant") {
      return assistantImage;
    }
    // Default to doctor image or a fallback
    return doctorImage;
  }, [user?.role]);
  return (
    <>
      {/* Sidebar - Fixed on left */}
      <Sidebar />

      {/* Navbar - Fixed with proper width */}
      <nav
        className={`bg-white shadow-sm fixed top-0 right-0 z-40 transition-all duration-300 ${
          collapsed ? "left-20" : "left-[260px]"
        }`}
      >
        <div className="max-w-full px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left section (Menu Button & Logo) */}
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                {/* Menu Button */}
                <div
                  onClick={() => setCollapsed((prev) => !prev)}
                  className="p-2 text-black cursor-pointer hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Menu size={20} />
                </div>

                {/* Logo */}
                <div>
                  <Image
                    alt="logo"
                    src={logo}
                    className="w-16 h-16 object-contain"
                  />
                </div>
              </div>
            </div>

            {/* Right section (Notifications, Settings, Profile) */}
            <div className="flex items-center gap-3">
              {/* Notifications Button and Dropdown */}
              <div className="relative" ref={notificationRef}>
                {/* Bell Button container for badge */}
                <div className="relative">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleNotifications}
                    className="hover:bg-blue-50 hover:text-blue-600 focus:ring-2 focus:ring-blue-500"
                  >
                    <Bell className="w-4 h-4" />
                  </Button>

                  {/* 🔔 Notification Count Badge */}
                  {notificationCount > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold ring-2 ring-white">
                      {notificationCount}
                    </span>
                  )}
                </div>

                {/* Notifications Dropdown UI */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white shadow-2xl  z-50 transform origin-top-right transition-all duration-200 ease-out animate-in fade-in-0 zoom-in-95 rounded-xl">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-t-xl">
                      <h3 className="text-base font-semibold text-gray-800">
                        Notifications
                      </h3>

                      {/* 🗑️ Mark All As Read Button (Only shows if count > 0) */}
                      {notificationCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs text-blue-600 hover:bg-blue-100 p-1 h-auto"
                          onClick={markAllAsRead} // Call the function to clear notifications
                        >
                          <CheckCheck className="w-3 h-3 mr-1" />
                          Mark all as read
                        </Button>
                      )}
                    </div>

                    {/* Notification List */}
                    <div className="py-1 max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((notif) => {
                          const { Icon, color } = getNotificationIcon(
                            notif.type
                          );
                          return (
                            <a
                              key={notif.id}
                              href="#"
                              className="flex items-start gap-3 px-4 py-3 border-b border-gray-100 hover:bg-blue-50 transition-colors duration-150 last:border-b-0"
                            >
                              {/* Icon */}
                              <div
                                className={`flex-shrink-0 p-2 rounded-full ${color} bg-opacity-10`}
                                style={{
                                  backgroundColor: `${color
                                    .replace("text-", "")
                                    .replace("-500", "10")}`,
                                }}
                              >
                                <Icon size={18} />
                              </div>

                              {/* Content */}
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                  {notif.text}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {notif.time}
                                </p>
                              </div>
                            </a>
                          );
                        })
                      ) : (
                        // Empty State
                        <div className="text-center p-4 text-gray-500 text-sm">
                          <Bell
                            size={20}
                            className="mx-auto mb-2 text-gray-400"
                          />
                          You're all caught up!
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Settings Button */}
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-blue-50 hover:text-blue-600 focus:ring-2 focus:ring-blue-500"
              >
                <Settings className="w-4 h-4" />
              </Button>

              {/* Profile Image */}
              <div className="flex items-center gap-2">
                <div>
                  <Image
                    src={profileImageSource}
                    alt="profile"
                    className="w-9 h-9 rounded-full object-cover shadow-md ring-2 ring-blue-500/50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer to push content below navbar */}
      <div
        className={`h-16 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-[260px]"
        }`}
      />
    </>
  );
}