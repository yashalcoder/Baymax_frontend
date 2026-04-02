"use client"
import { useState, useEffect } from "react"
import Swal from "sweetalert2"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Settings, User, Mail, Phone, Lock, Loader2 } from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function SettingsPage() {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [loading, setLoading]                   = useState(true)
  const [saving, setSaving]                     = useState(false)

  const [profile, setProfile] = useState({
    name:    "",
    email:   "",
    phone:   "",
    address: "",
  })

  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  })

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (stored) {
      try {
        const user = JSON.parse(stored)
        setProfile({
          name:    user.name    || "",
          email:   user.email   || "",
          phone:   user.contact || "",
          address: user.address || "",
        })
      } catch {
        // malformed JSON in localStorage — ignore
      }
    }
    setLoading(false)
  }, [])

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      const token  = localStorage.getItem("token")
      const stored = localStorage.getItem("user")
      const user   = stored ? JSON.parse(stored) : {}

      const res = await fetch(`${API}/api/auth/profile`, {
        method:  "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({
          name:    profile.name,
          contact: profile.phone,
          address: profile.address,
        }),
      })

      const data = await res.json()

      if (res.ok && data.status === "success") {
        // Sync localStorage with confirmed server values
        const updatedUser = {
          ...user,
          name:    data.user?.name    ?? profile.name,
          contact: data.user?.contact ?? profile.phone,
          address: data.user?.address ?? profile.address,
        }
        localStorage.setItem("user", JSON.stringify(updatedUser))

        Swal.fire("Success", "Profile updated successfully!", "success")
        setIsEditingProfile(false)
      } else {
        Swal.fire("Error", data.message || "Failed to update profile.", "error")
      }
    } catch (err) {
      console.error("Profile save error:", err)
      Swal.fire("Error", "Could not connect to server.", "error")
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (passwords.newPass !== passwords.confirm) {
      Swal.fire("Error", "New passwords do not match.", "error")
      return
    }
    if (passwords.newPass.length < 6) {
      Swal.fire("Error", "New password must be at least 6 characters.", "error")
      return
    }

    try {
      const token = localStorage.getItem("token")
      const res   = await fetch(`${API}/api/auth/change-password`, {
        method:  "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization:  `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: passwords.current,
          newPassword:     passwords.newPass,
        }),
      })

      const data = await res.json()

      if (res.ok && data.status === "success") {
        Swal.fire("Success", "Password changed successfully!", "success")
        setPasswords({ current: "", newPass: "", confirm: "" })
      } else {
        Swal.fire("Error", data.message || "Failed to change password.", "error")
      }
    } catch (err) {
      console.error("Change password error:", err)
      Swal.fire("Error", "Could not connect to server.", "error")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r bg-hero-gradient text-white rounded-2xl p-6 md:p-7 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <Settings className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">Settings</h1>
              <p className="text-blue-100 text-sm md:text-base">
                Manage your personal information and password
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Profile Card */}
          <Card className="shadow-lg border">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <User className="w-5 h-5" />
                    Personal Details
                  </CardTitle>
                  <CardDescription>
                    Update your name, contact number and address
                  </CardDescription>
                </div>
                {!isEditingProfile ? (
                  <Button
                    onClick={() => setIsEditingProfile(true)}
                    variant="outline"
                    size="sm"
                    className="border-blue-600 text-blue-600"
                  >
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSaveProfile}
                      size="sm"
                      className="bg-green-600 text-white"
                      disabled={saving}
                    >
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                    </Button>
                    <Button
                      onClick={() => setIsEditingProfile(false)}
                      variant="outline"
                      size="sm"
                      disabled={saving}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">

                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    disabled={!isEditingProfile}
                    className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Email — always read-only */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={profile.email}
                      disabled
                      className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-100 text-gray-500"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Contact Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      disabled={!isEditingProfile}
                      className="w-full pl-10 pr-4 py-2 border rounded-lg disabled:bg-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <textarea
                    rows={3}
                    value={profile.address}
                    onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                    disabled={!isEditingProfile}
                    className="w-full px-4 py-2 border rounded-lg disabled:bg-gray-100 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Change Password Card */}
          <Card className="shadow-lg border">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Lock className="w-5 h-5" />
                Change Password
              </CardTitle>
              <CardDescription>
                Keep your account secure with a strong password
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={passwords.newPass}
                    onChange={(e) => setPasswords({ ...passwords, newPass: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    required
                    className="w-full px-4 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <Button type="submit" className="w-full bg-blue-600 text-white">
                  Update Password
                </Button>
              </form>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  )
}