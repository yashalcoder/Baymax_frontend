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
  Activity,
  Heart,
  Thermometer,
  Droplets,
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

        const API = process.env.NEXT_PUBLIC_BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${API}/api/patient/dashboard`, {
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

  // Optimized Master Background State Fallback
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-gray-400 text-sm">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-1" />
          <span>Loading your dashboard…</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-rose-500 max-w-sm text-center bg-white border p-6 rounded-2xl shadow-sm">
          <AlertCircle className="w-10 h-10 text-rose-500 animate-pulse" />
          <p className="text-sm font-medium text-gray-800">{error}</p>
        </div>
      </div>
    )
  }

  // Map API response fields safely
  const user = patientData?.user
  const patient = patientData?.patient

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Grid Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Welcome Dashboard Banner Card */}
          <div className="lg:col-span-2 bg-hero-gradient text-white rounded-2xl p-6 shadow-lg flex flex-col justify-between">
            <div className="w-full">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
                Welcome back, {user?.name?.split(" ")[0] || "Patient"}!
              </h1>
              <p className="text-white/80 text-sm font-medium mb-5">
                Here is your verified health profile summary dashboard.
              </p>

              <div className="inline-flex items-center gap-2 text-xs bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm border border-white/10">
                <Calendar className="w-3.5 h-3.5 text-blue-200" />
                <span className="font-medium">{today}</span>
              </div>

              {/* Patient Quick Info Blocks */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs md:text-sm font-medium">
                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5 col-span-1 md:col-span-2 backdrop-blur-sm border border-white/5">
                  <Mail className="w-4 h-4 text-blue-200 flex-shrink-0" />
                  <span className="break-all tracking-wide text-white/90">{user?.email || "—"}</span>
                </div>

                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5 backdrop-blur-sm border border-white/5">
                  <User className="w-4 h-4 text-blue-200 flex-shrink-0" />
                  <span className="text-white/90">{user?.contact || "—"}</span>
                </div>

                <div className="flex items-center gap-2 bg-white/10 rounded-xl px-4 py-2.5 col-span-1 md:col-span-3 backdrop-blur-sm border border-white/5">
                  <IdCard className="w-4 h-4 text-blue-200 flex-shrink-0" />
                  <span className="break-all leading-relaxed text-white/90">{user?.address || "No address documented"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Core Patient Info Card */}
          <Card className="shadow-lg border bg-white">
            <CardHeader className="pb-3 border-b bg-gradient-to-r from-blue-50/40 to-transparent">
              <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-900">
                <User className="w-4 h-4 text-blue-600" />
                Account Registration
              </CardTitle>
              <CardDescription className="text-xs text-gray-400">
                Primary system parameters recorded on creation
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4 text-sm">
              <div className="flex justify-between items-center pb-2.5 border-b border-gray-100">
                <span className="text-gray-500 font-medium">System Reference ID</span>
                <span className="font-mono font-bold text-xs text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-lg border border-gray-200">
                  {patient?._id ? String(patient._id).slice(-8).toUpperCase() : "—"}
                </span>
              </div>

              <div className="flex justify-between items-center pb-2.5 border-b border-gray-100">
                <span className="text-gray-500 font-medium">Legal Full Name</span>
                <span className="font-semibold text-gray-900">{user?.name || "—"}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-500 font-medium">Verified Blood Type</span>
                <span className="font-bold text-rose-600 bg-rose-50 border border-rose-100 px-2.5 py-0.5 rounded-full text-xs">
                  {patient?.bloodGroup || "Pending State"}
                </span>
              </div>

              <div className="pt-2 space-y-3">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-gray-400 font-medium">Primary Contact Vector</span>
                  <span className="font-semibold text-gray-700">{user?.contact || "—"}</span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-gray-400 font-medium">Physical Delivery Address</span>
                  <span className="font-medium text-gray-600 text-xs leading-relaxed">
                    {user?.address || "—"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medical Conditions Section */}
        <Card className="shadow-lg border bg-white">
          <CardHeader className="pb-3 border-b bg-gradient-to-r from-slate-50/80 to-transparent">
            <CardTitle className="text-base font-bold flex items-center gap-2 text-gray-900">
              <Activity className="w-4 h-4 text-purple-600" /> Diagnostic Profile Overview
            </CardTitle>
            <CardDescription className="text-xs text-gray-400">
              Crucial parameters analyzed for clinical safety protocols
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-rose-50/40 border border-rose-100 p-4 rounded-xl">
              <p className="text-[11px] uppercase font-bold text-rose-600 tracking-wider mb-1">
                Documented Allergies
              </p>
              <p className="font-semibold text-sm text-rose-950">
                {patient?.allergies || "No documented contextual hypersensitivities"}
              </p>
            </div>

            <div className="bg-amber-50/40 border border-amber-100 p-4 rounded-xl">
              <p className="text-[11px] uppercase font-bold text-amber-800 tracking-wider mb-1">
                Major Diagnosed Pathologies
              </p>
              <p className="font-semibold text-sm text-amber-950">
                {patient?.majorDisease || "Clear history profile / no records recorded"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Recent Vitals Display Block */}
        {patient?.vitals?.length > 0 && (
          <Card className="shadow-lg border bg-white">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50/60 to-purple-50/20 pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-900">
                <FileText className="w-4 h-4 text-blue-600" />
                Historical Vitals Log
              </CardTitle>
              <CardDescription className="text-xs text-gray-400">
                Chronological biometric inputs processed by medical assistants
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-3">
              {[...patient.vitals]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 5)
                .map((vital, idx) => (
                  <div
                    key={vital._id || idx}
                    className="p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm transition-all duration-150"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200/60 px-2.5 py-0.5 rounded-md">
                        {new Date(vital.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div className="space-y-0.5">
                        <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                          <Droplets className="w-3 h-3 text-blue-500" /> Blood Pressure
                        </p>
                        <p className="font-bold text-gray-800">{vital.bloodPressure || <span className="text-gray-300 font-normal">—</span>}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                          <Thermometer className="w-3 h-3 text-amber-500" /> Temperature
                        </p>
                        <p className="font-bold text-gray-800">{vital.temperature || <span className="text-gray-300 font-normal">—</span>}</p>
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                          <Heart className="w-3 h-3 text-rose-500" /> Pulse Rate
                        </p>
                        <p className="font-bold text-gray-800">{vital.heartRate || <span className="text-gray-300 font-normal">—</span>}</p>
                      </div>
                    </div>
                    {vital.notes && (
                      <div className="mt-3 pt-2.5 border-t border-gray-100 text-xs text-gray-600 bg-slate-50/60 p-2.5 rounded-lg">
                        <span className="font-bold text-gray-700">Staff Observations:</span> {vital.notes}
                      </div>
                    )}
                  </div>
                ))}
            </CardContent>
          </Card>
        )}

        {/* Active Medical Prescriptions Block */}
        {patient?.medications?.length > 0 && (
          <Card className="shadow-lg border bg-white border-l-4 border-l-emerald-500">
            <CardHeader className="bg-gradient-to-r from-emerald-50/40 to-transparent pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-bold text-gray-900">
                <Pill className="w-4 h-4 text-emerald-600" />
                Active Pharmacological Prescriptions
              </CardTitle>
              <CardDescription className="text-xs text-gray-400">
                Current validated active medication schedules
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-2">
              <div className="flex flex-wrap gap-2">
                {patient.medications.map((med, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1.5 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-xl font-semibold shadow-sm"
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