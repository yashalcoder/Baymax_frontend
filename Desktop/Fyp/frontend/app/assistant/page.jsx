"use client"

import ProtectedRoute from "@/components/ProtectedRoutes"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card"
import { Users, Activity, Phone } from "lucide-react"

export default function AssistantDashboard() {
  // You can later replace this with the real logged-in assistant name
  const assistantName = "Assistant Name"

  const patients = [
    {
      id: "PT-001",
      name: "Ahmed Raza",
      phone: "+92 300 1234567",
      hasVitals: true
    },
    {
      id: "PT-002",
      name: "Fatima Noor",
      phone: "+92 321 7654321",
      hasVitals: true
    },
    {
      id: "PT-003",
      name: "Hassan Ali",
      phone: "+92 333 9876543",
      hasVitals: false
    },
    {
      id: "PT-004",
      name: "Sara Khan",
      phone: "+92 345 1122334",
      hasVitals: false
    }
  ]

  const patientsWithVitals = patients.filter(p => p.hasVitals)

  return (
    <ProtectedRoute allowedRoles={["assistant"]}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Header with assistant name */}
          <div className="bg-hero-gradient text-white rounded-2xl p-6 md:p-8 shadow-lg">
           <div className="flex items-center justify-between flex-wrap gap-4">
             <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-lg">
              <Users className="w-8 h-8" />
            </div>
         <div>
        <h1 className="text-2xl md:text-3xl font-bold">{assistantName}</h1>
        <p className="text-white/80">Patients whose vitals you have recorded</p>
      </div>
    </div>
  </div>
</div>


          {/* Patients with vitals only */}
          <Card className="shadow-lg border">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Vitals Recorded – Patients List
              </CardTitle>
              <CardDescription>
                Showing only patients whose vitals have been recorded
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="text-sm text-gray-600 mb-2">
                Total patients with vitals recorded:{" "}
                <span className="font-semibold">
                  {patientsWithVitals.length}
                </span>
              </div>

              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="grid grid-cols-3 gap-2 px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600">
                  <span>Patient ID</span>
                  <span>Name</span>
                  <span>Phone</span>
                </div>
                <div className="divide-y">
                  {patientsWithVitals.map(p => (
                    <div
                      key={p.id}
                      className="grid grid-cols-3 gap-2 px-4 py-3 text-sm items-center hover:bg-gray-50"
                    >
                      <span className="font-mono text-gray-700">{p.id}</span>
                      <span className="font-medium text-gray-800">
                        {p.name}
                      </span>
                      <span className="flex items-center gap-1 text-gray-700">
                        <Phone className="w-4 h-4 text-gray-400" />
                        {p.phone}
                      </span>
                    </div>
                  ))}

                  {patientsWithVitals.length === 0 && (
                    <div className="px-4 py-6 text-center text-sm text-gray-500">
                      No patients found with recorded vitals.
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}