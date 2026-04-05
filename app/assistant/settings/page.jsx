"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import ProtectedRoute from "@/components/protectedRoutes";
import {
  Settings, User, Mail, Phone, MapPin, Lock, Loader2,
  Calendar, GraduationCap, Save, Edit2, Shield, Eye, EyeOff,
  Users, LogOut,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─── helpers ──────────────────────────────────────────────────────────────────
const getAge = (dob) => {
  if (!dob) return null;
  return Math.floor((Date.now() - new Date(dob)) / (365.25 * 24 * 60 * 60 * 1000));
};

const formatDOB = (dob) => {
  if (!dob) return "Not provided";
  return new Date(dob).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });
};

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = [
  { id: "profile",  label: "Personal Information", icon: User },
  { id: "security", label: "Account & Security",   icon: Shield },
];

export default function AssistantSettingsPage() {
  const router = useRouter();
  const token  = useMemo(() => {
    if (typeof window !== "undefined") return localStorage.getItem("token");
    return null;
  }, []);

  const [activeTab,   setActiveTab]   = useState("profile");
  const [isEditing,   setIsEditing]   = useState(false);
  const [loading,     setLoading]     = useState(true);
  const [saving,      setSaving]      = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew,     setShowNew]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Profile fields — only what's in the model
  const [profile, setProfile] = useState({
    name: "", email: "", contact: "", address: "",
    dateOfBirth: "", degree: "",
    patientsManaged: 0,
  });

  const [passwords, setPasswords] = useState({
    current: "", newPass: "", confirm: "",
  });

  // ── Fetch from API ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!token) { setLoading(false); return; }

    fetch(`${API}/api/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data?.status === "success") {
          const u = data.data?.user    || {};
          const a = data.data?.profile || {};
          setProfile({
            name:            u.name        || "",
            email:           u.email       || "",
            contact:         u.contact     || "",
            address:         u.address     || "",
            dateOfBirth:     u.dateOfBirth ? u.dateOfBirth.split("T")[0] : "",
            degree:          a.degree      || "",
            patientsManaged: a.patientsManaged?.length ?? 0,
          });
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  // ── Save profile ──────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res  = await fetch(`${API}/api/auth/profile`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name:        profile.name,
          contact:     profile.contact,
          address:     profile.address,
          dateOfBirth: profile.dateOfBirth || undefined,
        }),
      });
      const data = await res.json();

      if (res.ok && data.status === "success") {
        // Sync localStorage
        const stored = localStorage.getItem("user");
        const user   = stored ? JSON.parse(stored) : {};
        localStorage.setItem("user", JSON.stringify({
          ...user,
          name:        data.user?.name        ?? profile.name,
          contact:     data.user?.contact     ?? profile.contact,
          address:     data.user?.address     ?? profile.address,
          dateOfBirth: data.user?.dateOfBirth ?? profile.dateOfBirth,
        }));
        Swal.fire("Saved!", "Profile updated successfully.", "success");
        setIsEditing(false);
      } else {
        Swal.fire("Error", data.message || "Failed to update profile.", "error");
      }
    } catch {
      Swal.fire("Error", "Could not connect to server.", "error");
    } finally {
      setSaving(false);
    }
  };

  // ── Change password ───────────────────────────────────────────────────────
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwords.newPass !== passwords.confirm) {
      Swal.fire("Error", "New passwords do not match.", "error"); return;
    }
    if (passwords.newPass.length < 6) {
      Swal.fire("Error", "Password must be at least 6 characters.", "error"); return;
    }
    try {
      const res  = await fetch(`${API}/api/auth/change-password`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPass }),
      });
      const data = await res.json();
      if (res.ok && data.status === "success") {
        Swal.fire("Success", "Password changed successfully!", "success");
        setPasswords({ current: "", newPass: "", confirm: "" });
      } else {
        Swal.fire("Error", data.message || "Failed to change password.", "error");
      }
    } catch {
      Swal.fire("Error", "Could not connect to server.", "error");
    }
  };

  // ── Sign out ──────────────────────────────────────────────────────────────
  const handleSignOut = () => {
    Swal.fire({
      title: "Sign out?", icon: "question",
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );

  // ── Render Personal Info ──────────────────────────────────────────────────
  const renderProfile = () => (
    <div className="space-y-6">

      {/* Avatar hero */}
      <div className="flex items-center gap-5 pb-6 border-b border-gray-200">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0">
          {profile.name?.charAt(0)?.toUpperCase() || "A"}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{profile.name || "—"}</h3>
          <p className="text-gray-500 text-sm mt-0.5">{profile.email}</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {profile.dateOfBirth && (
              <span className="px-3 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                {getAge(profile.dateOfBirth)} years old
              </span>
            )}
            <span className="px-3 py-0.5 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
              Assistant
            </span>
            <span className="px-3 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              {profile.patientsManaged} patients managed
            </span>
          </div>
        </div>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
          <input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        {/* Email — always read-only */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-gray-400" /> Email Address
          </label>
          <input
            value={profile.email}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-gray-400" /> Contact Number
          </label>
          <input
            value={profile.contact}
            onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        {/* DOB */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-gray-400" /> Date of Birth
          </label>
          {isEditing ? (
            <input
              type="date"
              max={new Date().toISOString().split("T")[0]}
              value={profile.dateOfBirth}
              onChange={(e) => setProfile({ ...profile, dateOfBirth: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <input
              value={formatDOB(profile.dateOfBirth)}
              disabled
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
            />
          )}
        </div>

        {/* Degree — read-only (set at signup) */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-gray-400" /> Highest Degree
          </label>
          <input
            value={profile.degree}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
          />
        </div>

        {/* Patients count — read-only */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-gray-400" /> Patients Managed
          </label>
          <input
            value={profile.patientsManaged}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-500"
          />
        </div>

        {/* Address — full width */}
        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-gray-400" /> Address
          </label>
          <textarea
            rows={3}
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600 resize-none"
          />
        </div>
      </div>

      {/* Sign out button at bottom of profile tab */}
      <div className="pt-4 border-t border-gray-200">
        <button onClick={handleSignOut}
          className="flex items-center gap-2 px-5 py-2.5 border border-red-200 text-red-600 rounded-xl hover:bg-red-50 transition text-sm font-medium">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  // ── Render Security tab ───────────────────────────────────────────────────
  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-semibold mb-0.5">Keep Your Account Secure</p>
          <p className="text-blue-700">Use a strong password with uppercase, numbers and symbols.</p>
        </div>
      </div>

      <form onSubmit={handleChangePassword} className="space-y-5">
        {[
          { label: "Current Password", key: "current", show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
          { label: "New Password",     key: "newPass", show: showNew,     toggle: () => setShowNew(!showNew) },
          { label: "Confirm Password", key: "confirm", show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
        ].map(({ label, key, show, toggle }) => (
          <div key={key}>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-gray-400" /> {label}
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                value={passwords[key]}
                onChange={(e) => setPasswords({ ...passwords, [key]: e.target.value })}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={toggle}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        ))}

        <button type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium flex items-center justify-center gap-2">
          <Save className="w-4 h-4" /> Update Password
        </button>
      </form>
    </div>
  );

  return (
    <ProtectedRoute allowedRoles={["assistant"]}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Page header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-2xl p-6 shadow-lg flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Settings className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
              <p className="text-blue-100 text-sm mt-0.5">Manage your profile and account security</p>
            </div>
          </div>

          {/* Tab bar */}
          <div className="bg-white rounded-xl shadow border border-gray-200 p-3">
            <nav className="flex gap-2 overflow-x-auto">
              {TABS.map(({ id, label, icon: Icon }) => (
                <button key={id} onClick={() => { setActiveTab(id); setIsEditing(false); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                    ${activeTab === id
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100"}`}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>

          {/* Content card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">
                {TABS.find((t) => t.id === activeTab)?.label}
              </h2>
              {activeTab === "profile" && (
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors
                    ${isEditing
                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      : "bg-blue-600 text-white hover:bg-blue-700"}`}
                >
                  <Edit2 className="w-4 h-4" />
                  {isEditing ? "Cancel" : "Edit"}
                </button>
              )}
            </div>

            {activeTab === "profile"  && renderProfile()}
            {activeTab === "security" && renderSecurity()}

            {/* Save bar */}
            {isEditing && activeTab === "profile" && (
              <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3 justify-end">
                <button onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition text-sm font-medium">
                  Cancel
                </button>
                <button onClick={handleSaveProfile} disabled={saving}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium flex items-center gap-2 disabled:opacity-60">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Changes
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}