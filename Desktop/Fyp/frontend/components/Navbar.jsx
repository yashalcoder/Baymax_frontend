// Navbar.jsx
"use client";
import { useSidebar } from "@/components/sidebar-provider";
import { Button } from "@/components/ui/button";
import { Menu, Settings } from "lucide-react";
import Sidebar from "./sidebar";
import Image from "next/image";
import profileImage from "../public/images.jpg";
import logo from "../public/logo-removebg-preview.png";

export default function Navbar() {
  const { collapsed, setCollapsed } = useSidebar();

  return (
    <>
      {/* Sidebar - Fixed on left */}
      <Sidebar />

      {/* Navbar - Fixed with proper width */}
      <nav
        className={`bg-white border-b border-gray-200 shadow-sm fixed top-0 right-0 z-40 transition-all duration-300 ${
          collapsed ? "left-20" : "left-[260px]"
        }`}
      >
        <div className="max-w-full px-6">
          <div className="flex items-center justify-between h-16">
            {/* Left section */}
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
                  <Image alt="no image" src={logo} className="w-16 h-16" />
                </div>
              </div>
            </div>

            {/* Right section */}
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
              <div className="flex items-center gap-2">
                <div>
                  <Image
                    src={profileImage}
                    alt="no image"
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-semibold shadow-md"
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
