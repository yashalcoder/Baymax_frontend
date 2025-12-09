"use client"
import { useState } from "react"
import { User, MapPin, Save, Edit2, Camera, Shield, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Sidebar from "@/components/sidebar"
import Navbar from "@/components/Navbar"

export default function LabSettings() {
  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)

  const tabs = [
    { id: "profile", name: "Profile Information", icon: User },
    { id: "contact", name: "Contact & Location", icon: MapPin },
    { id: "account", name: "Account & Security", icon: Shield },
    { id: "notifications", name: "Notifications", icon: Bell },
  ]

  const [labData, setLabData] = useState({
    labName: "Advanced Diagnostics Lab",
    ownerName: "Dr. Fatima Khan",
    email: "info@advancedlab.com",
    phone: "+92 300 2345678",
    alternatePhone: "+92 321 8765432",
    address: "Medical Center, 5th Avenue",
    city: "Karachi",
    state: "Sindh",
    country: "Pakistan",
    postalCode: "75500",
    latitude: "24.8607",
    longitude: "67.0011",
    licenseNumber: "LAB-2023-005",
    accreditation: "ISO 15189:2022",
    registrationYear: "2019",
    username: "lab_advanced",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    emailNotifications: true,
    smsNotifications: true,
    reportAlerts: true,
    newTestAlerts: true,
  })

  const handleInputChange = (field, value) => {
    setLabData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    console.log("Saving lab data:", labData)
    setIsEditing(false)
    alert("Changes saved successfully!")
  }

  const renderProfile = () => (
    <div className="space-y-6">
      <div className="flex items-start gap-6 mb-8 pb-6 border-b border-border">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-hero-gradient flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {labData.labName.charAt(0)}
          </div>
          {isEditing && (
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity shadow-lg">
              <Camera className="w-5 h-5" />
            </button>
          )}
        </div>
        <div>
          <h3 className="text-3xl font-bold text-foreground">{labData.labName}</h3>
          <p className="text-muted-foreground mt-2">Owner: {labData.ownerName}</p>
          <p className="text-sm text-muted-foreground">Accreditation: {labData.accreditation}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Lab Name</label>
          <input
            type="text"
            value={labData.labName}
            onChange={(e) => handleInputChange("labName", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 border border-border rounded-lg disabled:bg-secondary/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Owner Name</label>
          <input
            type="text"
            value={labData.ownerName}
            onChange={(e) => handleInputChange("ownerName", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 border border-border rounded-lg disabled:bg-secondary/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">License Number</label>
          <input
            type="text"
            value={labData.licenseNumber}
            onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 border border-border rounded-lg disabled:bg-secondary/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Accreditation</label>
          <input
            type="text"
            value={labData.accreditation}
            onChange={(e) => handleInputChange("accreditation", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 border border-border rounded-lg disabled:bg-secondary/30"
          />
        </div>
      </div>
    </div>
  )

  const renderContact = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
        <input
          type="email"
          value={labData.email}
          onChange={(e) => handleInputChange("email", e.target.value)}
          disabled={!isEditing}
          className="w-full px-4 py-2 border border-border rounded-lg disabled:bg-secondary/30"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
          <input
            type="tel"
            value={labData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 border border-border rounded-lg disabled:bg-secondary/30"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Alternate Phone</label>
          <input
            type="tel"
            value={labData.alternatePhone}
            onChange={(e) => handleInputChange("alternatePhone", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 border border-border rounded-lg disabled:bg-secondary/30"
          />
        </div>
      </div>

      <div className="pt-6 border-t border-border">
        <h4 className="font-semibold text-foreground mb-4">Location Details</h4>
        <div>
          <label className="block text-sm font-medium text-foreground mb-2">Address</label>
          <input
            type="text"
            value={labData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-2 border border-border rounded-lg disabled:bg-secondary/30"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <input
            type="text"
            placeholder="City"
            value={labData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            disabled={!isEditing}
            className="px-4 py-2 border border-border rounded-lg disabled:bg-secondary/30"
          />
          <input
            type="text"
            placeholder="State"
            value={labData.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
            disabled={!isEditing}
            className="px-4 py-2 border border-border rounded-lg disabled:bg-secondary/30"
          />
          <input
            type="text"
            placeholder="Postal Code"
            value={labData.postalCode}
            onChange={(e) => handleInputChange("postalCode", e.target.value)}
            disabled={!isEditing}
            className="px-4 py-2 border border-border rounded-lg disabled:bg-secondary/30"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Latitude</label>
            <input
              type="text"
              value={labData.latitude}
              onChange={(e) => handleInputChange("latitude", e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-border rounded-lg disabled:bg-secondary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Longitude</label>
            <input
              type="text"
              value={labData.longitude}
              onChange={(e) => handleInputChange("longitude", e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-border rounded-lg disabled:bg-secondary/30"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderAccount = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">Username</label>
        <input
          type="text"
          value={labData.username}
          disabled
          className="w-full px-4 py-2 border border-border rounded-lg bg-secondary/30"
        />
      </div>

      <div className="pt-6 border-t border-border">
        <h4 className="font-semibold text-foreground mb-4">Change Password</h4>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
            <input
              type="password"
              value={labData.currentPassword}
              onChange={(e) => handleInputChange("currentPassword", e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-border rounded-lg disabled:bg-secondary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
            <input
              type="password"
              value={labData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-border rounded-lg disabled:bg-secondary/30"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Confirm Password</label>
            <input
              type="password"
              value={labData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              disabled={!isEditing}
              className="w-full px-4 py-2 border border-border rounded-lg disabled:bg-secondary/30"
            />
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotifications = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
        <div>
          <h4 className="font-medium text-foreground">Email Notifications</h4>
          <p className="text-sm text-muted-foreground">Receive updates via email</p>
        </div>
        <input
          type="checkbox"
          checked={labData.emailNotifications}
          onChange={(e) => handleInputChange("emailNotifications", e.target.checked)}
          disabled={!isEditing}
          className="w-4 h-4"
        />
      </div>
      <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
        <div>
          <h4 className="font-medium text-foreground">SMS Notifications</h4>
          <p className="text-sm text-muted-foreground">Receive SMS alerts</p>
        </div>
        <input
          type="checkbox"
          checked={labData.smsNotifications}
          onChange={(e) => handleInputChange("smsNotifications", e.target.checked)}
          disabled={!isEditing}
          className="w-4 h-4"
        />
      </div>
      <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
        <div>
          <h4 className="font-medium text-foreground">Report Alerts</h4>
          <p className="text-sm text-muted-foreground">New report notifications</p>
        </div>
        <input
          type="checkbox"
          checked={labData.reportAlerts}
          onChange={(e) => handleInputChange("reportAlerts", e.target.checked)}
          disabled={!isEditing}
          className="w-4 h-4"
        />
      </div>
      <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
        <div>
          <h4 className="font-medium text-foreground">New Test Alerts</h4>
          <p className="text-sm text-muted-foreground">Alert when new tests are added</p>
        </div>
        <input
          type="checkbox"
          checked={labData.newTestAlerts}
          onChange={(e) => handleInputChange("newTestAlerts", e.target.checked)}
          disabled={!isEditing}
          className="w-4 h-4"
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-4xl font-bold font-poppins text-foreground mb-2">Settings</h1>
                <p className="text-muted-foreground">Manage your lab profile and preferences</p>
              </div>
              {!isEditing ? (
                <Button className="bg-hero-gradient text-white shadow-medical-lg" onClick={() => setIsEditing(true)}>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-hero-gradient text-white" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>

            <Card className="shadow-medical-lg border-border">
              <div className="flex border-b border-border overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center gap-2 ${
                      activeTab === tab.id
                        ? "text-primary border-b-2 border-primary"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="hidden md:inline">{tab.name}</span>
                  </button>
                ))}
              </div>

              <CardContent className="p-8">
                {activeTab === "profile" && renderProfile()}
                {activeTab === "contact" && renderContact()}
                {activeTab === "account" && renderAccount()}
                {activeTab === "notifications" && renderNotifications()}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
