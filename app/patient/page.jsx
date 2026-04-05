"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Pill,
  Calendar,
  User,
  FileText,
  Mail,
  IdCard,
  Loader2,
  AlertCircle,
} from "lucide-react"

const PatientDashboard = () => {
  const [patientData, setPatientData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("No auth token found. Please log in again.")
          setLoading(false)
          return
        }

        const res = await fetch("http://localhost:5000/api/patient/dashboard", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        const data = await res.json()

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to fetch dashboard data.")
          setLoading(false)
          return
        }

        setPatientData(data)
      } catch (err) {
        console.error("Dashboard fetch error:", err)
        setError("Could not connect to server.")
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-blue-600">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-red-500">
          <AlertCircle className="w-10 h-10" />
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    )
  }

  // Map API response fields
  const user = patientData?.user        // { name, email, contact, address, role }
  const patient = patientData?.patient  // { bloodGroup, allergies, majorDisease, vitals, ... }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header with Patient Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Welcome / Banner Card */}
          <div className="lg:col-span-2 bg-gradient-to-r bg-hero-gradient text-white rounded-2xl p-4 md:p-5 shadow-lg">
            <div className="flex items-start justify-between">
              <div className="w-full">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Welcome back, {user?.name?.split(" ")[0] || "Patient"}!
                </h1>
                <p className="text-blue-100 mb-4">
                  Here&apos;s your health overview for today
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>{today}</span>
                </div>

                {/* Patient Quick Details */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs md:text-sm font-medium">
                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-2 col-span-1 md:col-span-2">
                    <Mail className="w-4 h-4" />
                    <span className="break-all">{user?.email || "N/A"}</span>
                  </div>

                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-2">
                    <User className="w-4 h-4" />
                    <span>{user?.contact || "No contact"}</span>
                  </div>

                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-2 col-span-1 md:col-span-2">
                    <IdCard className="w-4 h-4" />
                    <span className="break-all">{user?.address || "No address"}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Patient Info Card */}
          <Card className="shadow-lg border-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" />
                Patient Information
              </CardTitle>
              <CardDescription className="text-xs">
                Basic details saved during registration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Patient ID</span>
                <span className="font-semibold text-xs">{String(patient?._id).slice(-8).toUpperCase()}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Name</span>
                <span className="font-semibold">{user?.name || "N/A"}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Blood Group</span>
                <span className="font-semibold text-red-600">
                  {patient?.bloodGroup || "Not set"}
                </span>
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Contact No.</span>
                  <span className="font-medium">{user?.contact || "Not provided"}</span>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Full Address</span>
                  <span className="font-medium text-xs md:text-sm leading-snug">
                    {user?.address || "Not provided"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medical Conditions Section */}
        <Card className="shadow-lg border-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              🩺 Medical Conditions
            </CardTitle>
            <CardDescription className="text-xs">
              Important health details for safe treatment
            </CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-red-50 border border-red-200 p-3 rounded-xl shadow-sm">
              <p className="text-xs uppercase font-medium text-red-600 mb-1">
                Allergies
              </p>
              <p className="font-semibold text-sm text-gray-800">
                {patient?.allergies || "No known allergies"}
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl shadow-sm">
              <p className="text-xs uppercase font-medium text-yellow-700 mb-1">
                Major Disease
              </p>
              <p className="font-semibold text-sm text-gray-800">
                {patient?.majorDisease || "None recorded"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Vitals Section — shown only if vitals exist */}
        {patient?.vitals?.length > 0 && (
          <Card className="shadow-lg border">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2 text-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-600" />
                </div>
                Recent Vitals
              </CardTitle>
              <CardDescription>Recorded by your assistant or doctor</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {[...patient.vitals]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map((vital, idx) => (
                  <div
                    key={vital._id || idx}
                    className="p-4 rounded-xl border-2 border-border hover:border-blue-300 hover:bg-blue-50/50 transition-all"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium text-muted-foreground">
                        {new Date(vital.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Blood Pressure</p>
                        <p className="font-semibold">{vital.bloodPressure || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Temperature</p>
                        <p className="font-semibold">{vital.temperature || "—"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Heart Rate</p>
                        <p className="font-semibold">{vital.heartRate || "—"}</p>
                      </div>
                    </div>
                    {vital.notes && (
                      <p className="text-xs text-muted-foreground mt-2 italic">
                        Note: {vital.notes}
                      </p>
                    )}
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        {/* Medications Section — shown only if medications exist */}
        {patient?.medications?.length > 0 && (
          <Card className="shadow-lg border-l-4 border-l-blue-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Pill className="w-5 h-5 text-blue-600" />
                Current Medications
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {patient.medications.map((med, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium"
                  >
                    {med}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  )
}

export default PatientDashboard