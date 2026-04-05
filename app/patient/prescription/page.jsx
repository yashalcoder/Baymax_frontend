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
  Loader2,
  Stethoscope,
  ClipboardList,
  Info,
  ShoppingBag,
  Beaker,
} from "lucide-react"
import { useRouter } from "next/navigation";


const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function PrescriptionPage() {
  const [searchQuery, setSearchQuery]     = useState("")
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState(null)
  const [downloadingId, setDownloadingId] = useState(null)
  const [expandedId, setExpandedId]       = useState(null)
 

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
  const router = useRouter();

const handleFindInPharmacy = (rx) => {
  const names = rx.medicines?.map((m) => m.name).filter(Boolean).join(",");
  router.push(`/patient/pharmacies?medicines=${encodeURIComponent(names)}`);
};

const handleFindInLab = (rx) => {
  const tests = rx.diseases?.filter(Boolean).join(",");
  router.push(`/patient/laboratories?tests=${encodeURIComponent(tests)}`);
};

  const getStatusBadge = (prescription) => {
    const created    = new Date(prescription.createdAt)
    const expireDate = new Date(created)
    expireDate.setDate(expireDate.getDate() + 30)
    const isActive = new Date() < expireDate

    return isActive ? (
      <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
        <CheckCircle className="w-3 h-3" /> Active
      </div>
    ) : (
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

  // ── search against the new response shape ──────────────────────────────────
  // backend now returns: { _id, createdAt, doctor (string), diagnosis,
  //                        medicines[{name,type,dosage,duration,precautions}],
  //                        advice[], disclaimer, diseases[], severity }
  const filteredPrescriptions = prescriptions.filter((rx) => {
    const q = searchQuery.toLowerCase()
    return (
      rx.doctor?.toLowerCase().includes(q) ||
      rx.diagnosis?.toLowerCase().includes(q) ||
      rx._id?.toLowerCase().includes(q) ||
      rx.medicines?.some((m) => m.name?.toLowerCase().includes(q)) ||
      rx.diseases?.some((d) => d?.toLowerCase().includes(q))
    )
  })

  // ── Loading ────────────────────────────────────────────────────────────────
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

  // ── Error ──────────────────────────────────────────────────────────────────
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

  // ── Main ───────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl p-6 md:p-8 shadow-lg">
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

        {/* Search */}
        <Card className="shadow-lg border">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by doctor name, medicine, diagnosis..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* List */}
        <div className="space-y-4">
          {filteredPrescriptions.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  {prescriptions.length === 0 ? "No Prescriptions Yet" : "No Prescriptions Found"}
                </h3>
                <p className="text-gray-500">
                  {prescriptions.length === 0
                    ? "Your doctor hasn't added any prescriptions yet."
                    : "Try adjusting your search keywords."}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPrescriptions.map((rx) => (
              <Card key={rx._id} className="shadow-lg border hover:shadow-xl transition-all">
                <CardContent className="p-6">

                  {/* ── Card header ── */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4 pb-4 border-b">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg shrink-0">
                        <User className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          {/* ✅ rx.doctor is a plain string now */}
                          <h3 className="text-lg font-bold">
                            {rx.doctor ? `Dr. ${rx.doctor}` : "Unknown Doctor"}
                          </h3>
                          {getStatusBadge(rx)}
                        </div>
                        <p className="text-sm text-muted-foreground">Prescribing Physician</p>

                        {/* Date */}
                        <div className="flex flex-wrap gap-2 mt-2 text-xs">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-50 border text-gray-700">
                            <Calendar className="w-3 h-3" />
                            {new Date(rx.createdAt).toLocaleDateString("en-US", {
                              year: "numeric", month: "short", day: "numeric",
                            })}
                          </span>

                          {/* Diseases badges */}
                          {rx.diseases?.map((d, i) => (
                            <span key={i} className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 font-medium">
                              {d}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* ID + Download */}
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className="text-xs font-semibold text-gray-700 bg-gray-50 border px-3 py-1 rounded-full">
                        ID: {String(rx._id).slice(-8).toUpperCase()}
                      </span>
                      <Button
                        onClick={() => handleDownloadPDF(rx._id)}
                        disabled={downloadingId === rx._id}
                        variant="outline"
                        size="sm"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        {downloadingId === rx._id
                          ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Downloading...</>
                          : <><Download className="w-4 h-4 mr-2" />Download PDF</>
                        }
                      </Button>
                      <button
                        onClick={() => setExpandedId(expandedId === rx._id ? null : rx._id)}
                        className="text-xs text-blue-500 hover:underline"
                      >
                        {expandedId === rx._id ? "Hide details ▲" : "Show details ▼"}
                      </button>
                    </div>
                  </div>

                  {/* ── Diagnosis ── */}
                  {rx.diagnosis && (
                    <div className="mb-4 flex items-start gap-2 bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-3">
                      <Stethoscope className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-indigo-500 mb-0.5">Diagnosis</p>
                        <p className="text-sm text-gray-800">{rx.diagnosis}</p>
                      </div>
                    </div>
                  )}

                  {/* ── Medicines ── */}
                  {rx.medicines?.length > 0 && (
                    <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4 border border-blue-100">
                      <h4 className="font-semibold text-sm mb-3 flex items-center gap-2">
                        <Pill className="w-4 h-4" /> Prescribed Medicines
                      </h4>
                      <div className="space-y-3">
                        {rx.medicines.map((med, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-4 border flex flex-col gap-2">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                              <div>
                                {/* ✅ med.name is mapped from med.medicine in backend */}
                                <h5 className="font-bold text-base text-gray-800">{med.name}</h5>
                                {med.type && (
                                  <p className="text-xs text-gray-500 mt-0.5">{med.type}</p>
                                )}
                              </div>
                              {med.duration && (
                                <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full self-start md:self-auto">
                                  {med.duration}
                                </span>
                              )}
                            </div>
                            <div className="grid grid-cols-2 gap-3 text-sm">
                              <div>
                                <p className="text-xs text-muted-foreground">Dosage</p>
                                <p className="font-medium">{med.dosage || "—"}</p>
                              </div>
                              {med.precautions && (
                                <div className="col-span-2">
                                  <p className="text-xs text-muted-foreground">Precautions</p>
                                  <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 mt-0.5">{med.precautions}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Find in Pharmacy / Lab ── */}
                  <div className="flex gap-2 pt-3 border-t mt-2 mb-4">
                    <button
                      onClick={() => handleFindInPharmacy(rx)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium hover:bg-green-100 transition"
                    >
                      <ShoppingBag className="w-4 h-4" /> Find in Pharmacy
                    </button>
                    <button
                      onClick={() => handleFindInLab(rx)}
                      className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 text-sm font-medium hover:bg-purple-100 transition"
                    >
                      <Beaker className="w-4 h-4" /> Find in Lab
                    </button>
                  </div>

                  {/* ── Expandable: Advice + Disclaimer ── */}
                  
                  {expandedId === rx._id && (
                    <>
                      {rx.advice?.length > 0 && (
                        <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-4">
                          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2 text-green-800">
                            <ClipboardList className="w-4 h-4" /> Doctor's Advice
                          </h4>
                          <ul className="space-y-1.5">
                            {rx.advice.map((a, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm text-green-900">
                                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500 shrink-0" />
                                {a}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {rx.disclaimer && (
                        <div className="flex items-start gap-2 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                          <Info className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                          <p className="text-xs text-gray-500">{rx.disclaimer}</p>
                        </div>
                      )}
                    </>
                  )}

                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Footer count */}
        {prescriptions.length > 0 && (
          <p className="text-center text-xs text-gray-400 pb-4">
            Showing {filteredPrescriptions.length} of {prescriptions.length} prescription{prescriptions.length !== 1 ? "s" : ""}
          </p>
        )}
      </div>
    </div>
  )
}