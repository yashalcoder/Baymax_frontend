"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Stethoscope,
  Activity,
  Users,
  FileText,
  Settings,
  Pill,
  Hospital,
  Flask,
  ArrowBigLeft,
  Clock,
} from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";
import doctorImage from "../public/images.jpg";
import assistantImage from "../public/assistantImage.png";
import patientImage from "../public/patientImage.png";
import { useRouter } from "next/navigation";
import { useSidebar } from "@/components/sidebar-provider";

export default function Sidebar() {
  const router = useRouter();
  const { collapsed } = useSidebar();
  const [activeIndex, setActiveIndex] = useState(0);
  const [user, setUser] = useState(null);
  const pathname = usePathname();


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
    label: "Medicines",
    route: "/pharmacy/medicines",
  },


  {
    icon: Settings,
    label: "Settings",
    route: "/pharmacy/settings",
  },
];
const labMenu = [
  { icon: Activity, label: "Dashboard", route: "/lab" },

  {
    icon: Pill,
    label: "Tests",
    route: "/lab/tests",
  },


  {
    icon: Settings,
    label: "Settings",
    route: "/lab/settings",
  },
];
const assistantMenu = [
  { icon: Activity, label: "Dashboard", route: "/assistant" },

  {
    icon: Pill,
    label: "Patients",
    route: "/assistant/patients",
  },

  {
    icon: Hospital,
    label: "Take Vitals",
    route: "/assistant/vitals",
  },

  {
    icon: Settings,
    label: "Settings",
    route: "/assistant/settings",
  },
];



const patientMenu = [
  { icon: Activity, label: "Dashboard", route: "/patient" },
   { icon: FileText, label: "Prescription", route: "/patient/prescription" },
  {
    icon: Hospital,
    label: "Laboratory",
    route: "/patient/laboratories",
  },

  {
    icon: Pill,
    label: "Pharmacy",
    route: "/patient/pharmacies",
  },
{
    icon: Clock,
    label: "Medical History",
    route: "/patient/medicalHistory",
  },
  {
    icon: Settings,
    label: "Settings",
    route: "/patient/settings",
  },
];

useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, [pathname]);
console.log("user role",user?.role);


// Selected menu based on user.role
const menuItems =
  user?.role === "doctor"
    ? doctorMenu
    : user?.role === "pharmacy"
    ? pharmacyMenu
    :user?.role==="patient"
    ? patientMenu
    :user?.role==="assistant"
    ?assistantMenu
    :user?.role==="laboratory"
    ?labMenu
    : [];

// Update handleClick:
const handleClick = (idx, route) => {
  // Remove setActiveIndex(idx);
  router.push(route);
};


const getTitle = (role) => {
  switch (role) {
    case "doctor":
      return "Dr.";
    case "patient":
      return "Patient"; 
    case "pharmacy":
      return "Pharmacy";
    case "laboratory":
      return "Lab";
    case "assistant":
      return "Assistant";
    default:
      return "";
  }
};
const getSubtitle = (role) => {
  switch (role) {
    case "doctor":
      return "General Physician";
    case "patient":
      return "Patient";
    case "pharmacy":
      return "Pharmacy Staff";
    case "laboratory":
      return "Lab Technician";
    case "assistant":
      return "Assistant";
    default:
      return "";
  }
};

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
useEffect(() => {
  // Find the index of the menu item that matches the current pathname
  const currentIndex = menuItems.findIndex(item => item.route === pathname);
  if (currentIndex !== -1) {
    setActiveIndex(currentIndex);
  }
}, [pathname, menuItems]);
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
                src={profileImageSource}
                alt="Profile Picture"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 rounded-full border-2 border-card"></div>
          </div>

          {!collapsed && (
            <div className="mt-3 text-center">
              <h3 className="font-semibold text-foreground">
  {getTitle(user?.role)} {user?.name}
</h3>

              <p className="text-xs text-muted-foreground mt-0.5">
  {getSubtitle(user?.role)}
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
            // Update the button className:
className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${ 
  pathname === item.route  // Changed this line
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