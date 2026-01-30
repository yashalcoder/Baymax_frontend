"use client"
import { useState } from "react"
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
} from "lucide-react"

export default function PrescriptionPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const prescriptions = [
    {
      id: "RX-2025-001",
      doctorName: "Dr. Muhammad Ali",
      specialization: "General Physician",
      hospital: "City General Hospital",
      date: "2025-01-10",
      diagnosis: "Common Cold",
      status: "active",
      validUntil: "2025-01-17",
      medicines: [
        {
          name: "Paracetamol",
          dosage: "500mg",
          frequency: "3 times a day",
          duration: "5 days",
          timing: "After meals",
          instructions: "Take with water",
        },
        {
          name: "Cough Syrup",
          dosage: "10ml",
          frequency: "2 times a day",
          duration: "7 days",
          timing: "Morning & Night",
          instructions: "Shake well before use",
        },
      ],
      contactNumber: "+92 300 1234567",
    },
    {
      id: "RX-2025-002",
      doctorName: "Dr. Fatima Khan",
      specialization: "Cardiologist",
      hospital: "Heart Care Center",
      date: "2025-01-05",
      diagnosis: "Hypertension Management",
      status: "active",
      validUntil: "2025-02-05",
      medicines: [
        {
          name: "Amlodipine",
          dosage: "5mg",
          frequency: "Once daily",
          duration: "30 days",
          timing: "Morning",
          instructions: "Take on empty stomach",
        },
        {
          name: "Aspirin",
          dosage: "75mg",
          frequency: "Once daily",
          duration: "30 days",
          timing: "After dinner",
          instructions: "Take with food",
        },
      ],
      contactNumber: "+92 321 7654321",
    },
    {
      id: "RX-2024-003",
      doctorName: "Dr. Hassan Raza",
      specialization: "ENT Specialist",
      hospital: "ENT Care Clinic",
      date: "2024-12-28",
      diagnosis: "Sinusitis",
      status: "completed",
      validUntil: "2025-01-04",
      medicines: [
        {
          name: "Amoxicillin",
          dosage: "500mg",
          frequency: "3 times a day",
          duration: "7 days",
          timing: "Every 8 hours",
          instructions: "Complete full course",
        },
        {
          name: "Nasal Spray",
          dosage: "2 sprays",
          frequency: "2 times a day",
          duration: "10 days",
          timing: "Morning & Night",
          instructions: "Use as directed",
        },
      ],
      contactNumber: "+92 333 9876543",
    },
    {
      id: "RX-2024-004",
      doctorName: "Dr. Sarah Ahmed",
      specialization: "Dermatologist",
      hospital: "Skin Care Hospital",
      date: "2024-12-15",
      diagnosis: "Skin Allergy",
      status: "expired",
      validUntil: "2024-12-22",
      medicines: [
        {
          name: "Cetirizine",
          dosage: "10mg",
          frequency: "Once daily",
          duration: "7 days",
          timing: "Night",
          instructions: "May cause drowsiness",
        },
        {
          name: "Hydrocortisone Cream",
          dosage: "1%",
          frequency: "Apply twice",
          duration: "7 days",
          timing: "Morning & Night",
          instructions: "Apply thin layer on affected area",
        },
      ],
      contactNumber: "+92 345 1122334",
    },
  ]

  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return (
          <div className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            Active
          </div>
        )
      case "completed":
        return (
          <div className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3 h-3" />
            Completed
          </div>
        )
      case "expired":
        return (
          <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
            <XCircle className="w-3 h-3" />
            Expired
          </div>
        )
      default:
        return null
    }
  }

  const filteredPrescriptions = prescriptions.filter((prescription) => {
    const q = searchQuery.toLowerCase()
    return (
      prescription.doctorName.toLowerCase().includes(q) ||
      prescription.diagnosis.toLowerCase().includes(q) ||
      prescription.id.toLowerCase().includes(q)
    )
  })

  const handleDownloadPDF = (prescriptionId) => {
    alert(`Downloading prescription ${prescriptionId} as PDF...`)
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
              <p className="text-blue-100">
                View and manage all your medical prescriptions
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <Card className="shadow-lg border">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by doctor, diagnosis, or prescription ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
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
                  No Prescriptions Found
                </h3>
                <p className="text-gray-500">
                  Try adjusting your search keywords
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredPrescriptions.map((prescription) => (
              <Card
                key={prescription.id}
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
                            {prescription.doctorName}
                          </h3>
                          {getStatusBadge(prescription.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {prescription.specialization}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" />
                          {prescription.hospital}
                        </p>

                        {/* compact info chips (no valid until) */}
                        <div className="flex flex-wrap gap-2 mt-3 text-xs md:text-[0.8rem]">
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-50 border text-gray-700">
                            <Calendar className="w-3 h-3" />
                            <span className="font-medium">
                              {prescription.date}
                            </span>
                          </span>

                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700">
                            <FileText className="w-3 h-3" />
                            <span className="font-semibold">
                              {prescription.diagnosis}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className="text-xs md:text-sm font-semibold text-gray-700 bg-gray-50 border px-3 py-1 rounded-full">
                        ID: {prescription.id}
                      </span>
                      <Button
                        onClick={() => handleDownloadPDF(prescription.id)}
                        variant="outline"
                        size="sm"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                  </div>

                  {/* Medicines Section */}
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
                              <h5 className="font-bold text-base text-gray-800">
                                {medicine.name}
                              </h5>
                              <p className="text-sm text-gray-600">
                                {medicine.dosage}
                              </p>
                            </div>
                            <span className="text-xs font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full self-start md:self-auto">
                              {medicine.duration}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Frequency
                              </p>
                              <p className="font-medium">
                                {medicine.frequency}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-muted-foreground">
                                Timing
                              </p>
                              <p className="font-medium">
                                {medicine.timing}
                              </p>
                            </div>
                            <div className="col-span-2 md:col-span-1">
                              <p className="text-xs text-muted-foreground">
                                Instructions
                              </p>
                              <p className="font-medium">
                                {medicine.instructions}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      <span>
                        Doctor&apos;s Contact: {prescription.contactNumber}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
