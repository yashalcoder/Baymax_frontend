"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Pill,
  Calendar,
  User,
  Download,
  Search,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  Stethoscope,
  ClipboardList,
  Info,
  ShoppingBag,
  Beaker,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

export default function PrescriptionPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [prescriptions, setPrescriptions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [downloadingId, setDownloadingId] = useState(null)
  const [expandedId, setExpandedId] = useState(null)
  const router = useRouter();

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

  const handleFindInPharmacy = (rx) => {
    const names = rx.medicines?.map((m) => m.name).filter(Boolean).join(",");
    router.push(`/patient/pharmacies?medicines=${encodeURIComponent(names)}`);
  };

  const handleFindInLab = (rx) => {
    const tests = rx.diseases?.filter(Boolean).join(",");
    router.push(`/patient/laboratories?tests=${encodeURIComponent(tests)}`);
  };

  const getStatusBadge = (prescription) => {
    const created = new Date(prescription.createdAt)
    const expireDate = new Date(created)
    expireDate.setDate(expireDate.getDate() + 30)
    const isActive = new Date() < expireDate

    return isActive ? (
      <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-green-50 border border-green-200/80 text-green-700 rounded-full text-xs font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active
      </div>
    ) : (
      <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-500 rounded-full text-xs font-semibold">
        <span className="w-1.5 h-1.5 rounded-full bg-slate-400" /> Completed
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
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
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
      rx.doctor?.toLowerCase().includes(q) ||
      rx.diagnosis?.toLowerCase().includes(q) ||
      rx._id?.toLowerCase().includes(q) ||
      rx.medicines?.some((m) => m.name?.toLowerCase().includes(q)) ||
      rx.diseases?.some((d) => d?.toLowerCase().includes(q))
    )
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-slate-50 to-indigo-50/20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-slate-400 text-sm font-medium">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-1" />
          <span>Syncing prescription data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-slate-50 to-indigo-50/20 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-red-500 p-6 bg-white rounded-2xl border border-red-100 shadow-xl max-w-sm text-center">
          <AlertCircle className="w-10 h-10 text-red-500" />
          <p className="text-base font-bold text-slate-800">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/40 via-slate-50 to-indigo-50/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Title Header */}
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">My Prescriptions</h1>
          <p className="text-sm md:text-base text-slate-500 font-medium">View, download PDFs, and source medication inventories from connected centers</p>
        </div>

        {/* Search Input Box */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by physician name, medicine types, or diagnoses logs..."
              className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-500 text-sm md:text-base transition-all bg-slate-50/50 font-medium text-slate-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Grid List Elements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredPrescriptions.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl border border-slate-200/60 p-12 text-center shadow-sm">
              <AlertCircle className="w-12 h-12 text-blue-200 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-slate-700 mb-1">
                {prescriptions.length === 0 ? "No Prescriptions Yet" : "No Prescriptions Found"}
              </h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto">
                {prescriptions.length === 0
                  ? "Medical checkup scripts appear automatically upon creation."
                  : "Try checking keywords or adjustments."}
              </p>
            </div>
          ) : (
            filteredPrescriptions.map((rx) => {
              const isExpanded = expandedId === rx._id;
              return (
                <Card key={rx._id} className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden flex flex-col justify-between hover:shadow-md transition-all duration-200">
                  <div className="p-5 md:p-6">

                    {/* Top Main Heading Row */}
                    <div className="flex items-start justify-between gap-4 mb-4 pb-4 border-b border-slate-100">
                      <div className="flex gap-3 min-w-0">
                        <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl shrink-0 h-fit">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-900 text-base md:text-lg leading-snug truncate">
                            {rx.doctor ? `Dr. ${rx.doctor}` : "Medical Officer"}
                          </h3>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            {getStatusBadge(rx)}
                            <span className="inline-flex items-center gap-1 text-xs text-slate-500 font-medium">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(rx.createdAt).toLocaleDateString("en-US", {
                                year: "numeric", month: "short", day: "numeric",
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end shrink-0 gap-2">
                        <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-100">
                          ID: {String(rx._id).slice(-6).toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Diseases Tag Pills */}
                    {rx.diseases?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {rx.diseases.map((d, i) => (
                          <span key={i} className="text-xs px-2.5 py-0.5 bg-red-50/60 border border-red-100/80 text-red-600 font-semibold rounded-md">
                            ⚠️ {d}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Standard Diagnosis Text Block */}
                    {rx.diagnosis && (
                      <div className="mb-4 bg-indigo-50/40 border border-indigo-100/60 rounded-xl px-4 py-3 flex gap-2.5 items-start">
                        <Stethoscope className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-[11px] font-bold text-indigo-600 tracking-wide uppercase mb-0.5">Primary Diagnosis</p>
                          <p className="text-xs md:text-sm text-slate-700 font-medium leading-relaxed">{rx.diagnosis}</p>
                        </div>
                      </div>
                    )}

                    {/* Dynamic Toggle Action Segment */}
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : rx._id)}
                      className="w-full flex items-center justify-between text-xs font-bold py-2.5 px-3.5 border border-slate-200 rounded-xl bg-slate-50/80 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors mb-4"
                    >
                      <span>{isExpanded ? "Hide Medication Content" : `View Medication Details (${rx.medicines?.length || 0})`}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                    </button>

                    {/* Expandable Core Modules */}
                    {isExpanded && (
                      <div className="space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
                        {rx.medicines?.length > 0 && (
                          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                            <h4 className="font-bold text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <Pill className="w-3.5 h-3.5 text-slate-400" /> Prescribed Routine
                            </h4>
                            {rx.medicines.map((med, idx) => (
                              <div key={idx} className="bg-white border border-slate-100 rounded-lg p-3 shadow-xs flex flex-col gap-1.5">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <h5 className="font-bold text-sm text-slate-800">{med.name}</h5>
                                    {med.type && <p className="text-[11px] text-slate-400 font-medium mt-0.5">{med.type}</p>}
                                  </div>
                                  {med.duration && (
                                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md border border-blue-100 shrink-0">
                                      ⏱️ {med.duration}
                                    </span>
                                  )}
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-50 pt-2 mt-1">
                                  <div>
                                    <p className="text-[10px] text-slate-400 font-medium">Dosage Schedule</p>
                                    <p className="font-semibold text-slate-700 mt-0.5">{med.dosage || "As Directed"}</p>
                                  </div>
                                  {med.precautions && (
                                    <div className="col-span-2 bg-amber-50/60 text-amber-800 p-2.5 rounded-md border border-amber-100/60 text-[11px] font-medium leading-relaxed mt-1">
                                      🎯 <span className="text-amber-900 font-bold">Precaution:</span> {med.precautions}
                                    </div>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {rx.advice?.length > 0 && (
                          <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-4">
                            <h4 className="font-bold text-xs text-emerald-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                              <ClipboardList className="w-3.5 h-3.5" /> Clinical Instructions
                            </h4>
                            <ul className="space-y-1.5">
                              {rx.advice.map((a, i) => (
                                <li key={i} className="flex items-start gap-2 text-xs md:text-sm text-emerald-900 font-medium">
                                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-emerald-500 shrink-0" />
                                  <span className="leading-relaxed">{a}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {rx.disclaimer && (
                          <div className="flex items-start gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-3">
                            <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                            <p className="text-[11px] text-slate-400 font-medium leading-relaxed">{rx.disclaimer}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Operational Footer Buttons */}
                  <div className="px-5 pb-5 md:px-6 md:pb-6 bg-slate-50/40 border-t border-slate-100 pt-4 space-y-2.5">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleFindInPharmacy(rx)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-bold hover:opacity-95 transition shadow-sm shadow-emerald-100"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Settle Medicines
                      </button>
                      <button
                        onClick={() => handleFindInLab(rx)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs font-bold hover:opacity-95 transition shadow-sm shadow-indigo-100"
                      >
                        <Beaker className="w-3.5 h-3.5" /> Diagnose Labs
                      </button>
                    </div>

                    <Button
                      onClick={() => handleDownloadPDF(rx._id)}
                      disabled={downloadingId === rx._id}
                      variant="outline"
                      size="sm"
                      className="w-full border-slate-200 text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 py-4 font-semibold text-xs rounded-xl shadow-xs transition-all"
                    >
                      {downloadingId === rx._id ? (
                        <><Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin text-slate-500" /> Compiling Document...</>
                      ) : (
                        <><Download className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Download Official PDF Record</>
                      )}
                    </Button>
                  </div>
                </Card>
              )
            })
          )}
        </div>

        {/* Symmetrical Footprint Indicator */}
        {prescriptions.length > 0 && (
          <p className="text-center text-xs text-slate-400 pt-2 font-medium">
            Displaying {filteredPrescriptions.length} of {prescriptions.length} archival history statements
          </p>
        )}
      </div>
    </div>
  )
}