"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import {
  Settings,
  Phone,
  MapPin,
  Edit2,
  Check,
  X,
  Lock
} from "lucide-react"

export default function LabSettingsPage() {
  const [isEditing, setIsEditing] = useState(false)

  const [labProfile, setLabProfile] = useState({
    phone: "+92 300 1234567",
    address: "45-B Medical Complex, Lahore, Punjab"
  })

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  })

  const handleSave = () => {
    alert("Lab information updated successfully!")
    setIsEditing(false)
  }

  const handleChangePassword = (e) => {
    e.preventDefault()

    if (!passwords.currentPassword || !passwords.newPassword || !passwords.confirmPassword) {
      alert("Please fill all password fields.")
      return
    }

    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("New password and confirm password do not match.")
      return
    }

    alert("Password changed successfully!")
    setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" })
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
              <p className="text-gray-200">
                Manage your lab contact information and security
              </p>
            </div>
          </div>
        </div>

        {/* Lab Info Card */}
        <Card className="shadow-lg border">
          <CardHeader className="border-b bg-hero/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-hero">
                  <Phone className="w-5 h-5" /> Lab Information
                </CardTitle>
                <CardDescription>
                  Update your lab's contact & address
                </CardDescription>
              </div>

              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  size="sm"
                  className="border-hero text-hero"
                >
                  <Edit2 className="w-4 h-4 mr-2" /> Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    onClick={handleSave}
                    size="sm"
                    className="bg-green-600 text-white"
                  >
                    <Check className="w-4 h-4 mr-2" /> Save
                  </Button>

                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    size="sm"
                  >
                    <X className="w-4 h-4 mr-2" /> Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>

          <CardContent className="p-6 space-y-6">

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Number
              </label>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lab Address
              </label>
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

          </CardContent>
        </Card>

        {/* Change Password Card */}
        <Card className="shadow-lg border">
          <CardHeader className="border-b bg-hero-gradient text-white">
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" /> Change Password
            </CardTitle>
            <CardDescription className="text-gray-200">
              Update your account password
            </CardDescription>
          </CardHeader>

          <CardContent className="p-6">
            <form onSubmit={handleChangePassword} className="space-y-4">

              <div>
                <label className="block text-sm font-medium mb-2">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwords.currentPassword}
                  onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwords.newPassword}
                  onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Confirm New Password
                </label>
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
