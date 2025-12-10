"use client";

import { useState } from "react";
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
import { motion, AnimatePresence } from "framer-motion";
import myImage from "../public/images.jpg";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/sidebar-provider";

export default function Sidebar() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const { collapsed } = useSidebar();

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

  const handleClick = (index, route) => {
    setActiveIndex(index);
    router.push(route);
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 260 }}
      transition={{ type: "spring", stiffness: 120, damping: 15 }}
      className="fixed left-0 top-0 h-screen bg-card border-r border-border shadow-lg z-20 flex flex-col"
    >
      {/* Profile Section */}
      <div className="p-6 border-b border-border">
        <div className="flex flex-col items-center">
          <motion.div
            animate={{ scale: collapsed ? 0.8 : 1 }}
            className="relative"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg ring-4 ring-blue-100">
              <Image
                src={myImage}
                alt="Profile Picture"
                className="w-16 h-16 rounded-full"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
          </motion.div>

          <AnimatePresence>
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ delay: 0.1 }}
                className="mt-3 text-center"
              >
                <h3 className="font-semibold text-foreground">Dr. Ahmed</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  General Physician
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        {menuItems.map((item, idx) => (
          <button
            key={idx}
            onClick={() => handleClick(idx, item.route)}
            className={`hover:cursor-pointer w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
              activeIndex === idx
                ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <item.icon className="w-5 h-5 shrink-0" />
            <AnimatePresence>
              {!collapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -5 }}
                  className="font-medium"
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-2 border-t border-border">
        <AnimatePresence>
          {!collapsed ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground space-y-1"
            >
              <div
                className="flex gap-2 p-2 text-lg font-bold hover:cursor-pointer"
                onClick={() => router.push("/")}
              >
                <ArrowBigLeft className="text-black" size={30} /> Logout
              </div>
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-muted-foreground text-center"
            ></motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}
