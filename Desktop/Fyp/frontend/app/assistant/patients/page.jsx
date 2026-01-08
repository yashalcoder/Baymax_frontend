"use client"
import { useState } from "react"
import ProtectedRoute from "@/components/ProtectedRoutes"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { UserPlus, Phone, Stethoscope, AlertCircle } from "lucide-react"

export default function RegisterPatientPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [generatedId, setGeneratedId] = useState("")

  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dateOfBirth: "",
    phone: "",
    email: "",
    address: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    bloodGroup: "",
    allergies: "",
    chronicDiseases: "",
    currentMedications: "",
    notes: ""
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setSuccess("")
    setGeneratedId("")

    if (!formData.fullName || !formData.phone) {
      setError("Full Name and Phone number are required.")
      return
    }

    try {
      setIsSubmitting(true)

      // 🚀 Backend API Call (example)
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || "Failed to save patient")
      }

      setGeneratedId(data.patientId) // auto generated ID from DB
      setSuccess("Patient registered successfully.")

      setFormData({
        fullName: "",
        gender: "",
        dateOfBirth: "",
        phone: "",
        email: "",
        address: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        bloodGroup: "",
        allergies: "",
        chronicDiseases: "",
        currentMedications: "",
        notes: ""
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["assistant"]}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* HEADER */}
          <div className="bg-hero-gradient text-white rounded-2xl p-6 shadow-lg flex items-center gap-3">
            <UserPlus className="w-8 h-8 bg-white/20 rounded-lg p-2" />
            <div>
              <h1 className="text-3xl font-bold">Register New Patient</h1>
              <p className="text-blue-100">
                Add patient profile and basic medical history
              </p>
            </div>
          </div>

          {/* FORM */}
          <Card className="shadow-lg border">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Patient Information
              </CardTitle>
              <CardDescription>
                Patient ID will be automatically assigned after saving
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* Errors */}
              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-300 text-red-600 px-3 py-2 rounded">
                  <AlertCircle className="w-4 h-4" />
                  {error}
                </div>
              )}
              {success && (
                <div className="flex flex-col gap-1 bg-green-50 border border-green-300 text-green-700 px-3 py-2 rounded">
                  <span>{success}</span>
                  {generatedId && (
                    <span className="font-bold">
                      Assigned Patient ID: {generatedId}
                    </span>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* BASIC FIELDS */}
                <div className="grid md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name *"
                    value={formData.fullName}
                    onChange={(e) =>
                      handleChange("fullName", e.target.value)
                    }
                    className="px-3 py-2 border rounded-lg"
                  />

                  <select
                    value={formData.gender}
                    onChange={(e) =>
                      handleChange("gender", e.target.value)
                    }
                    className="px-3 py-2 border rounded-lg"
                  >
                    <option value="">Gender</option>
                    <option>Male</option>
                    <option>Female</option>
                  </select>

                  <input
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) =>
                      handleChange("dateOfBirth", e.target.value)
                    }
                    className="px-3 py-2 border rounded-lg"
                  />
                </div>

                {/* PHONE + EMAIL */}
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="tel"
                    placeholder="Phone *"
                    value={formData.phone}
                    onChange={(e) =>
                      handleChange("phone", e.target.value)
                    }
                    className="px-3 py-2 border rounded-lg"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={(e) =>
                      handleChange("email", e.target.value)
                    }
                    className="px-3 py-2 border rounded-lg"
                  />
                </div>

                {/* MEDICAL HISTORY */}
                <textarea
                  placeholder="Chronic Diseases"
                  value={formData.chronicDiseases}
                  onChange={(e) =>
                    handleChange("chronicDiseases", e.target.value)
                  }
                  rows={3}
                  className="px-3 py-2 w-full border rounded-lg"
                />

                {/* SUBMIT */}
                <div className="flex justify-end">
                  <Button type="submit" className="bg-hero-gradient text-white">
                    {isSubmitting ? "Saving..." : "Register Patient"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
