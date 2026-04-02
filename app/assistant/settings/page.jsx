"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import ProtectedRoute from "@/components/protectedRoutes";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Settings, User, Mail, Phone, MapPin, GraduationCap, LogOut, ShieldCheck, Users,
} from "lucide-react";

export default function AssistantSettingsPage() {
  const router = useRouter();
  const token  = useMemo(() => localStorage.getItem("token"), []);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    fetch("http://localhost:5000/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.status === "success") setProfile(data.data);
        else setError(data?.message || "Could not load profile");
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [token]);

  const handleSignOut = () => {
    Swal.fire({
      title: "Sign out?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, sign out",
      confirmButtonColor: "#ef4444",
    }).then((r) => {
      if (r.isConfirmed) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        document.cookie = "token=; Max-Age=0; path=/;";
        router.replace("/login");
      }
    });
  };

  const user    = profile?.user;
  const asst    = profile?.profile;

  const infoRows = [
    { icon: User,          label: "Full Name",        value: user?.name },
    { icon: Mail,          label: "Email",            value: user?.email },
    { icon: Phone,         label: "Contact",          value: user?.contact    || "Not provided" },
    { icon: MapPin,        label: "Address",          value: user?.address    || "Not provided" },
    { icon: GraduationCap, label: "Highest Degree",   value: asst?.degree     || "Not provided" },
    { icon: ShieldCheck,   label: "Role",             value: "Assistant" },
  ];

  return (
    <ProtectedRoute allowedRoles={["assistant"]}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Header */}
          <div className="bg-hero-gradient text-white rounded-2xl p-6 shadow-lg flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl"><Settings className="w-7 h-7" /></div>
            <div>
              <h1 className="text-2xl font-bold">Settings</h1>
              <p className="text-white/80 text-sm">Your profile and account information</p>
            </div>
          </div>

          {/* Profile card */}
          <Card className="shadow-lg border">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" /> Profile Information
              </CardTitle>
              <CardDescription>
                Contact your administrator to update profile details
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {loading && (
                <p className="py-10 text-center text-sm text-gray-400">Loading profile…</p>
              )}
              {!loading && error && (
                <p className="py-6 text-center text-sm text-red-500">{error}</p>
              )}
              {!loading && !error && profile && (
                <div className="space-y-4">
                  {/* Avatar */}
                  <div className="flex justify-center mb-2">
                    <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center border-4 border-white shadow-md">
                      <User className="w-10 h-10 text-blue-600" />
                    </div>
                  </div>

                  {/* Info rows */}
                  <div className="grid gap-2">
                    {infoRows.map(({ icon: Icon, label, value }) => (
                      <div
                        key={label}
                        className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100"
                      >
                        <Icon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-xs font-medium text-gray-500">{label}</p>
                          <p className="text-sm font-semibold text-gray-900">{value || "—"}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Patients managed count */}
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-blue-600" />
                      <span className="text-sm text-blue-700 font-medium">Patients Managed</span>
                    </div>
                    <span className="text-xl font-bold text-blue-800">
                      {asst?.patientsManaged?.length ?? 0}
                    </span>
                  </div>

                  {/* Sign out */}
                  <div className="pt-2 border-t">
                    <Button
                      onClick={handleSignOut}
                      variant="outline"
                      className="w-full flex items-center gap-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </ProtectedRoute>
  );
}