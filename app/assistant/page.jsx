"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/protectedRoutes";
import { Users, Activity, UserPlus, Search, Settings, Heart } from "lucide-react";

export default function AssistantDashboard() {
  const user = useMemo(() => {
    try { return JSON.parse(localStorage.getItem("user") || "{}"); } catch { return {}; }
  }, []);

  const [stats, setStats] = useState({ patientsManaged: 0 });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    fetch("http://localhost:5000/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.status === "success") {
          setStats({
            patientsManaged: data.data?.profile?.patientsManaged?.length || 0,
          });
        }
      })
      .catch(() => {});
  }, []);

  const quickLinks = [
    {
      href:  "/assistant/patients",
      title: "My Patients",
      desc:  "View and manage all patients assigned to you",
      icon:  Users,
      color: "bg-blue-50 text-blue-700 border-blue-100",
    },
    {
      href:  "/assistant/search",
      title: "Search Patient",
      desc:  "Find existing patients by name, email, or phone",
      icon:  Search,
      color: "bg-purple-50 text-purple-700 border-purple-100",
    },
    {
      href:  "/assistant/add-patient",
      title: "Add New Patient",
      desc:  "Register a patient and assign them to a doctor",
      icon:  UserPlus,
      color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    },
    {
      href:  "/assistant/vitals",
      title: "Take Vitals",
      desc:  "Search a patient and record blood pressure, temperature, pulse",
      icon:  Heart,
      color: "bg-rose-50 text-rose-700 border-rose-100",
    },
    {
      href:  "/assistant/settings",
      title: "Settings",
      desc:  "View your profile information",
      icon:  Settings,
      color: "bg-slate-50 text-slate-700 border-slate-100",
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["assistant"]}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Header */}
          <div className="bg-hero-gradient text-white rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Users className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Welcome, {user?.name || "Assistant"}
                  </h1>
                  <p className="text-white/80 mt-0.5">
                    Manage patients, record vitals, and coordinate care.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/15 border border-white/25 rounded-xl px-4 py-3">
                <Activity className="w-5 h-5" />
                <div>
                  <p className="text-xs text-white/70">Patients Managed</p>
                  <p className="text-xl font-bold">{stats.patientsManaged}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickLinks.map((l) => {
                const Icon = l.icon;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="group rounded-2xl border bg-white p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-150"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2.5 rounded-xl border ${l.color} group-hover:scale-110 transition-transform`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{l.title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{l.desc}</p>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}