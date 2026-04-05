"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card"
import { Settings, Phone, MapPin, Edit2, Check, X, Lock, User } from "lucide-react"

export default function LabSettingsPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [successMsg, setSuccessMsg] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  const [labProfile, setLabProfile] = useState({
    ownerName: "",
    phone: "",
    address: "",
    coordinates: "",
  })

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/laboratory/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        )
        const data = await response.json()
        if (data) {
          setLabProfile({
            ownerName: data.ownerName || "",
            phone: data.contactNumber || "",
            address: data.address?.street || "",
            coordinates: data.location?.coordinates
              ? `${data.location.coordinates[1]}, ${data.location.coordinates[0]}`
              : "",
          })
        }
      } catch (error) {
        console.error("Error loading profile:", error)
      }
    }
    loadProfile()
  }, [])

  const handleSave = async () => {
    // Validation
    if (!labProfile.phone) {
      setErrorMsg("Contact number is required")
      return
    }

    if (!labProfile.address) {
      setErrorMsg("Address is required")
      return
    }
    if (!labProfile.coordinates) {
      setErrorMsg("Location coordinates are required")
      return
    }
    const phoneRegex = /^03[0-9]{2}-[0-9]{7}$/
    if (!phoneRegex.test(labProfile.phone)) {
      setErrorMsg("Invalid phone format — use 03XX-XXXXXXX")
      return
    }

    if (labProfile.coordinates) {
      const coords = labProfile.coordinates.split(",").map((c) => parseFloat(c.trim()))
      if (coords.length !== 2 || isNaN(coords[0]) || isNaN(coords[1])) {
        setErrorMsg("Invalid coordinates format — use: latitude, longitude (e.g. 31.5204, 74.3587)")
        return
      }
      if (coords[0] < -90 || coords[0] > 90) {
        setErrorMsg("Latitude must be between -90 and 90")
        return
      }
      if (coords[1] < -180 || coords[1] > 180) {
        setErrorMsg("Longitude must be between -180 and 180")
        return
      }
    }

    try {
      setErrorMsg("")
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/laboratory/profile/location`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            ownerName: labProfile.ownerName,
            contactNumber: labProfile.phone,
            address: { street: labProfile.address },
            coordinates: labProfile.coordinates
              ? labProfile.coordinates.split(",").map((c) => parseFloat(c.trim())).reverse()
              : undefined,
          }),
        }
      )
      const data = await response.json()
      if (data.message) {
        setSuccessMsg("Lab information updated successfully!")
        setIsEditing(false)
        setTimeout(() => setSuccessMsg(""), 3000)
      } else {
        setErrorMsg("Failed to update lab information")
      }
    } catch (error) {
      console.error("Error updating lab:", error)
      setErrorMsg("Failed to update lab information")
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")

    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      setErrorMsg("Please fill all password fields.")
      return
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      setErrorMsg("New password and confirm password do not match.")
      return
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            currentPassword: passwords.currentPassword,
            newPassword: passwords.newPassword,
          }),
        }
      )
      const data = await response.json()
      if (data.status === "success") {
        setSuccessMsg("Password changed successfully!")
        setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" })
        setTimeout(() => setSuccessMsg(""), 3000)
      } else {
        setErrorMsg(data.message || "Failed to change password")
      }
    } catch (error) {
      console.error("Error changing password:", error)
      setErrorMsg("Failed to change password")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-hero-gradient text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <Settings className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
              <p className="text-gray-200">Manage your lab contact information and security</p>
            </div>
          </div>
        </div>

        {/* Success / Error */}
        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-lg text-sm">
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {errorMsg}
          </div>
        )}

        {/* Lab Info Card */}
        <Card className="shadow-lg border">
          <CardHeader className="border-b bg-hero/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-hero">
                  <Phone className="w-5 h-5" /> Lab Information
                </CardTitle>
                <CardDescription>Update your lab's contact & address</CardDescription>
              </div>
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline" size="sm" className="border-hero text-hero">
                  <Edit2 className="w-4 h-4 mr-2" /> Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button onClick={handleSave} size="sm" className="bg-green-600 text-white">
                    <Check className="w-4 h-4 mr-2" /> Save
                  </Button>
                  <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">

            {/* Owner Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={labProfile.ownerName}
                  onChange={(e) => setLabProfile({ ...labProfile, ownerName: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Owner name"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={labProfile.phone}
                  onChange={(e) => setLabProfile({ ...labProfile, phone: e.target.value })}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Lab Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  rows={2}
                  value={labProfile.address}
                  onChange={(e) => setLabProfile({ ...labProfile, address: e.target.value })}
                  disabled={!isEditing}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg disabled:bg-gray-100"
                ></textarea>
              </div>
            </div>

            {/* Coordinates */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location Coordinates
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={labProfile.coordinates}
                  onChange={(e) => setLabProfile({ ...labProfile, coordinates: e.target.value })}
                  disabled={!isEditing}
                  placeholder="e.g. 31.5204, 74.3587"
                  className="w-full pl-10 pr-4 py-2 border rounded-lg disabled:bg-gray-100"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">Format: latitude, longitude</p>
            </div>

          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card className="shadow-lg border">
          <CardHeader className="border-b bg-hero-gradient text-white">
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" /> Change Password
            </CardTitle>
            <CardDescription className="text-gray-200">Update your account password</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Password</label>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">New Password</label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                <input
                  type="password"
                  value={passwords.confirmPassword}
                  onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>
              <Button type="submit" className="w-full bg-hero-gradient text-white">
                Update Password
              </Button>
            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  )
}