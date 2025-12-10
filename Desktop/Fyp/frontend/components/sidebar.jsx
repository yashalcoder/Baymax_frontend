"use client";

import { useState, useEffect } from "react";
import {
  Stethoscope,
  Activity,
  Users,
  FileText,
  Settings,
  Pill,
  Hospital,
  ArrowBigLeft,
} from "lucide-react";
import Image from "next/image";
import myImage from "../public/images.jpg";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/sidebar-provider";

export default function Sidebar() {
  const router = useRouter();
  const { collapsed } = useSidebar();
  const [activeIndex, setActiveIndex] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
      console.log(JSON.parse(stored));
    }
  }, []);

  const doctorMenu = [
    { icon: Activity, label: "Dashboard", route: "/doctor" },
    { icon: Users, label: "Patients", route: "/doctor/patients" },
    { icon: Pill, label: "Consultation", route: "/doctor/transcription" },
    { icon: Stethoscope, label: "Diagnosis", route: "/doctor/symptoms" },
    { icon: FileText, label: "Prescriptions", route: "/doctor/prescriptions" },
    { icon: Pill, label: "View Reports", route: "/doctor/ViewReports" },
    {
      icon: Hospital,
      label: "Medical History",
      route: "/doctor/MedicalHistory",
    },
    { icon: Settings, label: "Settings", route: "/doctor/settings" },
  ];
const pharmacyMenu = [
  { icon: Activity, label: "Dashboard", route: "/pharmacy" },

  {
    icon: Pill,
    label: "Manage Medicines",
    route: "/pharmacy/medicines",
  },

  {
    icon: Hospital,
    label: "Pharmacy Profile & Location",
    route: "/pharmacy/profile",
  },

  {
    icon: Settings,
    label: "Settings",
    route: "/pharmacy/settings",
  },
];
console.log("user role",user?.role);
// Selected menu based on user.role
const menuItems =
  user?.role === "doctor"
    ? doctorMenu
    : user?.role === "pharmacy"
    ? pharmacyMenu
    : [];

  const handleClick = (idx, route) => {
    setActiveIndex(idx);
    router.push(route);
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-card border-r border-border shadow-lg z-20 flex flex-col transition-all duration-200 ${
        collapsed ? "w-20" : "w-65"
      }`}
    >
      {/* Profile Section */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col items-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden shadow ring-4 ring-blue-200">
              <Image
                src={myImage}
                alt="Profile Picture"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
          </div>

          {!collapsed && (
            <div className="mt-3 text-center">
              <h3 className="font-semibold text-foreground">
                Dr. {user?.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                General Physician
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx, item.route)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
              activeIndex === idx
                ? "bg-blue-600 text-white shadow"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <item.icon className="w-5 h-5" />
            {!collapsed && <span className="font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-border">
        {!collapsed && (
          <div
            className="flex gap-2 p-2 text-sm font-semibold hover:cursor-pointer"
            onClick={() => router.push("/")}
          >
            <ArrowBigLeft size={20} /> Logout
          </div>
        )}
      </div>
    </aside>
  );
}
