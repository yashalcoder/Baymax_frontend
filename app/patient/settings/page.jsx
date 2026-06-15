"use client";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Settings, User, Mail, Phone, MapPin, Lock, Loader2,
  Calendar, Users, CreditCard, Save, Edit2, Shield, Eye, EyeOff,
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

// ─── Tab nav ──────────────────────────────────────────────────────────────────
const TABS = [
  { id: "profile", label: "Personal Information", icon: User },
  { id: "security", label: "Account & Security", icon: Shield },
];

export default function PatientSettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [profile, setProfile] = useState({
    name: "", email: "", contact: "", address: "",
    dateOfBirth: "", gender: "", cnic: "",
  });

  const [passwords, setPasswords] = useState({
    current: "", newPass: "", confirm: "",
  });

  // ── Load from localStorage ────────────────────────────────────────────────
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setProfile({
          name: u.name || "",
          email: u.email || "",
          contact: u.contact || "",
          address: u.address || "",
          dateOfBirth: u.dateOfBirth ? u.dateOfBirth.split("T")[0] : "",
          gender: u.gender || "",
          cnic: u.cnic || "",
        });
      } catch { /* ignore */ }
    }
    setLoading(false);
  }, []);

  // ── Save profile ──────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const stored = localStorage.getItem("user");
      const user = stored ? JSON.parse(stored) : {};

      const res = await fetch(`${API}/api/auth/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: profile.name,
          contact: profile.contact,
          address: profile.address,
          dateOfBirth: profile.dateOfBirth || undefined,
          gender: profile.gender || undefined,
          cnic: profile.cnic || undefined,
        }),
      });
      const data = await res.json();

      if (res.ok && data.status === "success") {
        const updatedUser = {
          ...user,
          name: data.user?.name ?? profile.name,
          contact: data.user?.contact ?? profile.contact,
          address: data.user?.address ?? profile.address,
          dateOfBirth: data.user?.dateOfBirth ?? profile.dateOfBirth,
          gender: data.user?.gender ?? profile.gender,
          cnic: data.user?.cnic ?? profile.cnic,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
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
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/auth/change-password`, {
        method: "PUT",
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

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 text-gray-400 text-sm">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-1" />
        <span>Loading settings engine…</span>
      </div>
    </div>
  );

  // ── Render Personal Info tab ──────────────────────────────────────────────
  const renderProfile = () => (
    <div className="space-y-6">

      {/* Avatar + name hero */}
      <div className="flex items-center gap-5 pb-6 border-b border-gray-100">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg flex-shrink-0">
          {profile.name?.charAt(0)?.toUpperCase() || "P"}
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{profile.name || "—"}</h3>
          <p className="text-gray-400 text-sm mt-0.5">{profile.email}</p>
          {profile.dateOfBirth && (
            <span className="inline-block mt-1.5 px-3 py-0.5 bg-blue-50 border border-blue-100 text-blue-600 text-xs font-semibold rounded-full">
              {getAge(profile.dateOfBirth)} years old
            </span>
          )}
        </div>
      </div>

      {/* Fields grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
          <input
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed font-medium text-gray-800"
          />
        </div>

        {/* Email — read-only */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-gray-400" /> Email Address
          </label>
          <input
            value={profile.email}
            disabled
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-slate-50 text-slate-400 font-medium cursor-not-allowed"
          />
        </div>

        {/* Contact */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <Phone className="w-4 h-4 text-gray-400" /> Contact Number
          </label>
          <input
            value={profile.contact}
            onChange={(e) => setProfile({ ...profile, contact: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed font-medium text-gray-800"
          />
        </div>

        {/* CNIC */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-gray-400" /> CNIC
          </label>
          <input
            value={profile.cnic}
            onChange={(e) => setProfile({ ...profile, cnic: e.target.value })}
            disabled={!isEditing}
            placeholder="XXXXX-XXXXXXX-X"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed font-medium text-gray-800 tracking-wide"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
            <Users className="w-4 h-4 text-gray-400" /> Gender
          </label>
          <select
            value={profile.gender}
            onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white transition-all focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed font-medium text-gray-800"
          >
            <option value="">Select…</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
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
              className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 font-medium text-gray-800"
            />
          ) : (
            <input
              value={formatDOB(profile.dateOfBirth)}
              disabled
              className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-slate-50 text-slate-500 font-medium cursor-not-allowed"
            />
          )}
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
            className="w-full px-4 py-3 border border-gray-200 rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed font-medium text-gray-800 resize-none leading-relaxed"
          />
        </div>
      </div>
    </div>
  );

  // ── Render Security tab ───────────────────────────────────────────────────
  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="bg-blue-50/40 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
        <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div className="text-sm text-blue-900">
          <p className="font-semibold mb-0.5">Keep Your Account Secure</p>
          <p className="text-blue-700/90 leading-relaxed">Use a strong password with at least 8 characters, uppercase letters, numbers, and custom symbols.</p>
        </div>
      </div>

      <form onSubmit={handleChangePassword} className="space-y-5">
        {[
          { label: "Current Password", key: "current", show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
          { label: "New Password", key: "newPass", show: showNew, toggle: () => setShowNew(!showNew) },
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
                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl transition-all focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 font-medium text-gray-800"
              />
              <button type="button" onClick={toggle}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        ))}

        <button type="submit"
          className="w-full px-6 py-3 bg-hero-gradient text-white rounded-xl transition hover:opacity-95 font-semibold flex items-center justify-center gap-2 shadow-lg">
          <Save className="w-4 h-4" /> Update Password
        </button>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Page header */}
        <div className="bg-hero-gradient text-white rounded-2xl p-6 shadow-lg flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/10">
            <Settings className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
            <p className="text-blue-100 text-sm mt-0.5 font-medium">Manage your profile parameters and account security</p>
          </div>
        </div>

        {/* Tab bar navigation container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200/80 p-2.5">
          <nav className="flex gap-2 overflow-x-auto">
            {TABS.map(({ id, label, icon: Icon }) => (
              <button key={id} onClick={() => { setActiveTab(id); setIsEditing(false); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all whitespace-nowrap
                  ${activeTab === id
                    ? "bg-hero-gradient text-white shadow"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>
        </div>

        {/* Core Profile Wrapper Layout Card */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200/80 p-6">
          {/* Card header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">
              {TABS.find((t) => t.id === activeTab)?.label}
            </h2>
            {activeTab === "profile" && (
              <button
                onClick={() => isEditing ? setIsEditing(false) : setIsEditing(true)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all
                  ${isEditing
                    ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                    : "bg-hero-gradient text-white shadow-md hover:opacity-95"}`}
              >
                <Edit2 className="w-4 h-4" />
                {isEditing ? "Cancel" : "Edit Profile"}
              </button>
            )}
          </div>

          {/* Tab content conditional engines */}
          {activeTab === "profile" && renderProfile()}
          {activeTab === "security" && renderSecurity()}

          {/* Save Action Triggers Row */}
          {isEditing && activeTab === "profile" && (
            <div className="mt-6 pt-6 border-t border-gray-100 flex gap-3 justify-end">
              <button onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-semibold">
                Cancel
              </button>
              <button onClick={handleSaveProfile} disabled={saving}
                className="px-5 py-2.5 bg-hero-gradient text-white rounded-xl transition text-sm font-semibold flex items-center gap-2 disabled:opacity-60 shadow-lg">
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}