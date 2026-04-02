"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Pill,
  Calendar,
  User,
  FileText,
  Download,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Phone,
  MapPin,
  Loader2,
} from "lucide-react"

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function PrescriptionPage() {
  const [searchQuery, setSearchQuery]         = useState("")
  const [prescriptions, setPrescriptions]     = useState([])
  const [loading, setLoading]                 = useState(true)
  const [error, setError]                     = useState(null)
  const [downloadingId, setDownloadingId]     = useState(null)

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setError("No auth token found. Please log in again.")
          setLoading(false)
          return
        }

        const res = await fetch(`${API}/api/patient/my-prescriptions`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        const data = await res.json()

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to load prescriptions.")
          setLoading(false)
          return
        }

        setPrescriptions(data.prescriptions || [])
      } catch (err) {
        console.error("Prescription fetch error:", err)
        setError("Could not connect to server.")
      } finally {
        setLoading(false)
      }
    }

    fetchPrescriptions()
  }, [])

  const getStatusBadge = (prescription) => {
    // Determine status: if createdAt + 30 days > today → active, else completed
    const created    = new Date(prescription.createdAt)
    const expireDate = new Date(created)
    expireDate.setDate(expireDate.getDate() + 30)
    const now = new Date()

    let status = now < expireDate ? "active" : "completed"

    if (status === "active") {
      return (
        <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
          <CheckCircle className="w-3 h-3" /> Active
        </div>
      )
    }
    return (
      <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
        <XCircle className="w-3 h-3" /> Completed
      </div>
    )
  }

  const handleDownloadPDF = async (prescriptionId) => {
    setDownloadingId(prescriptionId)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(
        `${API}/api/patient/prescription/${prescriptionId}/pdf`,
        { headers: { Authorization: `Bearer ${token}` } }
      )

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        alert(data.message || "Failed to download prescription.")
        return
      }

      const blob = await res.blob()
      const url  = window.URL.createObjectURL(blob)
      const a    = document.createElement("a")
      a.href     = url
      a.download = `prescription-${prescriptionId}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("PDF download error:", err)
      alert("Could not download prescription.")
    } finally {
      setDownloadingId(null)
    }
  }

  const filteredPrescriptions = prescriptions.filter((rx) => {
    const q = searchQuery.toLowerCase()
    return (
      rx.doctorId?.name?.toLowerCase().includes(q) ||
      rx.notes?.toLowerCase().includes(q) ||
      rx._id?.toLowerCase().includes(q) ||
      rx.medicines?.some((m) => m.name?.toLowerCase().includes(q))
    )
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-blue-600">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-lg font-medium">Loading prescriptions...</p>
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r bg-hero-gradient text-white rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-white/20 rounded-lg">
              <Pill className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">My Prescriptions</h1>
              <p className="text-blue-100">View and download all your medical prescriptions</p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="shadow-lg border">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by doctor name, medicine, or ID..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Prescriptions List */}
        <div className="space-y-4">
          {filteredPrescriptions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {prescriptions.length === 0
                    ? "No Prescriptions Yet"
                    : "No Prescriptions Found"}
                </h3>
                <p className="text-gray-500">
                  {prescriptions.length === 0
                    ? "Your doctor hasn't added any prescriptions yet."
                    : "Try adjusting your search keywords."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPrescriptions.map((prescription) => (
              <Card
                key={prescription._id}
                className="shadow-lg border hover:shadow-xl transition-all"
              >
                <CardContent className="p-6">
                  {/* Header Section */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3 pb-4 border-b">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-lg font-bold">
                            {prescription.doctorId?.name || "Unknown Doctor"}
                          </h3>
                          {getStatusBadge(prescription)}
                        </div>
                        <p className="text-sm text-muted-foreground">Prescribing Physician</p>
                        {prescription.doctorId?.contact && (
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <Phone className="w-3 h-3" />
                            {prescription.doctorId.contact}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-2 mt-3 text-xs md:text-[0.8rem]">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-50 border text-gray-700">
                            <Calendar className="w-3 h-3" />
                            <span className="font-medium">
                              {new Date(prescription.createdAt).toLocaleDateString("en-US", {
                                year: "numeric", month: "short", day: "numeric",
                              })}
                            </span>
                          </span>
                          {prescription.notes && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700">
                              <FileText className="w-3 h-3" />
                              <span className="font-semibold">{prescription.notes}</span>
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs md:text-sm font-semibold text-gray-700 bg-gray-50 border px-3 py-1 rounded-full">
                        ID: {String(prescription._id).slice(-8).toUpperCase()}
                      </span>
                      <Button
                        onClick={() => handleDownloadPDF(prescription._id)}
                        disabled={downloadingId === prescription._id}
                        variant="outline"
                        size="sm"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        {downloadingId === prescription._id
                          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Downloading...</>
                          : <><Download className="w-4 h-4 mr-2" />Download PDF</>
                        }
                      </Button>
                    </div>
                  </div>

                  {/* Medicines Section */}
                  {prescription.medicines?.length > 0 && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <Pill className="w-4 h-4" />
                        Prescribed Medicines
                      </h4>
                      <div className="space-y-3">
                        {prescription.medicines.map((medicine, idx) => (
                          <div
                            key={idx}
                            className="bg-white rounded-lg p-4 border flex flex-col gap-3"
                          >
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                              <div>
                                <h5 className="font-bold text-base text-gray-800">{medicine.name}</h5>
                                <p className="text-sm text-gray-600">{medicine.dosage || "—"}</p>
                              </div>
                              {medicine.duration && (
                                <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full self-start md:self-auto">
                                  {medicine.duration}
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-xs text-muted-foreground">Frequency</p>
                                <p className="font-medium">{medicine.frequency || "—"}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Lab Tests if any */}
                  {prescription.labTests?.length > 0 && (
                    <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-4">
                      <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-yellow-800">
                        <FileText className="w-4 h-4" />
                        Lab Tests Ordered
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {prescription.labTests.map((test, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full font-medium"
                          >
                            {test}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Doctor Contact */}
                  {prescription.doctorId?.contact && (
                    <div className="pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>Doctor&apos;s Contact: {prescription.doctorId.contact}</span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}