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
import {
  Activity,
  Search,
  Hash,
  Thermometer,
  HeartPulse,
  Stethoscope,
  AlertCircle,
  Phone
} from "lucide-react"

export default function TakeVitalsPage() {
  const [searchId, setSearchId] = useState("")
  const [foundPatient, setFoundPatient] = useState(null)
  const [searchLoading, setSearchLoading] = useState(false)
  const [searchError, setSearchError] = useState("")

  const [vitals, setVitals] = useState({
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    notes: ""
  })

  const [saveLoading, setSaveLoading] = useState(false)
  const [saveError, setSaveError] = useState("")
  const [saveSuccess, setSaveSuccess] = useState("")

  const handleSearch = async () => {
    setSearchError("")
    setFoundPatient(null)
    setSaveSuccess("")
    setSaveError("")

    const trimmed = searchId.trim()
    if (!trimmed) {
      setSearchError("Please enter a Patient ID to search.")
      return
    }

    try {
      setSearchLoading(true)

      // ⚠️ API shape example: adjust according to your backend
      // e.g. GET /api/patients?patientId=PT-001
      const res = await fetch(`/api/patients?patientId=${encodeURIComponent(trimmed)}`)
      const data = await res.json()

      if (!res.ok || !data || !data.patient) {
        setSearchError(data?.message || "No patient found with this ID.")
        return
      }

      setFoundPatient(data.patient) // { id, name, phone, ... }
    } catch (err) {
      console.error(err)
      setSearchError("Something went wrong while searching. Try again.")
    } finally {
      setSearchLoading(false)
    }
  }

  const handleSaveVitals = async (e) => {
    e.preventDefault()
    setSaveError("")
    setSaveSuccess("")

    if (!foundPatient) {
      setSaveError("Please search and select a valid patient first.")
      return
    }

    if (!vitals.bloodPressure.trim() || !vitals.heartRate.trim() || !vitals.temperature.trim()) {
      setSaveError("Blood Pressure, Heart Rate, and Temperature are required.")
      return
    }

    try {
      setSaveLoading(true)

      // ⚠️ Backend endpoint example: change as per your API
      // Expected body: { patientId, bloodPressure, heartRate, temperature, notes }
      const res = await fetch("/api/vitals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientId: foundPatient.id,
          ...vitals
        })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.message || "Failed to save vitals.")
      }

      setSaveSuccess("Vitals saved successfully.")
      setVitals({
        bloodPressure: "",
        heartRate: "",
        temperature: "",
        notes: ""
      })
    } catch (err) {
      console.error(err)
      setSaveError(err.message || "Something went wrong while saving vitals.")
    } finally {
      setSaveLoading(false)
    }
  }

  return (
    <ProtectedRoute allowedRoles={["assistant"]}>
      <div className="min-h-screen p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* HEADER */}
          <div className="bg-hero-gradient text-white rounded-2xl p-6 md:p-8 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <Activity className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Take Patient Vitals
                </h1>
                <p className="text-blue-100">
                  Search patient by ID and record clinical vitals
                </p>
              </div>
            </div>
          </div>

          {/* MAIN CARD */}
          <Card className="shadow-lg border">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <Stethoscope className="w-5 h-5" />
                Vitals Recording
              </CardTitle>
              <CardDescription>
                Enter patient ID, confirm patient details, then save vitals to the system.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              {/* SEARCH SECTION */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Patient by ID
                </label>
                <div className="flex flex-col md:flex-row gap-3">
                  <div className="relative flex-1">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="e.g., PT-001"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <Button
                    type="button"
                    onClick={handleSearch}
                    className="bg-blue-600 text-white flex items-center gap-2"
                    disabled={searchLoading}
                  >
                    <Search className="w-4 h-4" />
                    {searchLoading ? "Searching..." : "Search"}
                  </Button>
                </div>
                {searchError && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                    <AlertCircle className="w-4 h-4 mt-0.5" />
                    <span>{searchError}</span>
                  </div>
                )}
              </div>

              {/* PATIENT INFO */}
              {foundPatient && (
                <div className="rounded-xl border bg-white px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      Selected Patient
                    </p>
                    <p className="text-sm font-semibold text-gray-800">
                      {foundPatient.name || foundPatient.fullName}{" "}
                      <span className="ml-2 text-xs font-mono text-gray-500">
                        ({foundPatient.id})
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{foundPatient.phone || "No phone on record"}</span>
                  </div>
                </div>
              )}

              {/* SAVE ALERTS */}
              {saveError && (
                <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  <span>{saveError}</span>
                </div>
              )}
              {saveSuccess && (
                <div className="flex items-start gap-2 rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  <span>{saveSuccess}</span>
                </div>
              )}

              {/* VITALS FORM */}
              <form onSubmit={handleSaveVitals} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
                      <HeartPulse className="w-4 h-4 text-red-500" />
                      Blood Pressure
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., 120/80"
                      value={vitals.bloodPressure}
                      onChange={(e) =>
                        setVitals({ ...vitals, bloodPressure: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
                      <Activity className="w-4 h-4 text-green-500" />
                      Heart Rate (bpm)
                    </label>
                    <input
                      type="number"
                      placeholder="e.g., 78"
                      value={vitals.heartRate}
                      onChange={(e) =>
                        setVitals({ ...vitals, heartRate: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-700 flex items-center gap-1 mb-1">
                      <Thermometer className="w-4 h-4 text-orange-500" />
                      Body Temperature (°C)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="e.g., 37.0"
                      value={vitals.temperature}
                      onChange={(e) =>
                        setVitals({ ...vitals, temperature: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1">
                    Notes (optional)
                  </label>
                  <textarea
                    placeholder="Any extra observations, complaints, or remarks..."
                    value={vitals.notes}
                    onChange={(e) =>
                      setVitals({ ...vitals, notes: e.target.value })
                    }
                    rows={3}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    type="submit"
                    className="bg-blue-600 text-white"
                    disabled={saveLoading}
                  >
                    {saveLoading ? "Saving..." : "Save Vitals"}
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
