"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  FileText, 
  Calendar,
  User,
  Upload,
  Download,
  Search,
  Filter,
  Eye,
  Trash2,
  CheckCircle,
  FileImage,
  File,
  X,
  Clock,
  Activity,
  Stethoscope,
  TestTube,
  Pill
} from "lucide-react"

export default function MedicalHistoryPage() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadedFile, setUploadedFile] = useState(null)

  const medicalRecords = [
    {
      id: "MH-2025-001",
      type: "consultation",
      title: "General Check-up",
      doctorName: "Dr. Muhammad Ali",
      specialization: "General Physician",
      hospital: "City General Hospital",
      date: "2025-01-10",
      diagnosis: "Common Cold",
      symptoms: ["Fever", "Cough", "Sore throat"],
      treatment: "Rest and medication prescribed",
      prescriptions: ["Paracetamol 500mg", "Cough Syrup"],
      notes: "Patient advised to rest for 2-3 days and drink plenty of fluids.",
      followUp: "2025-01-17",
      attachments: []
    },
    {
      id: "MH-2025-002",
      type: "lab",
      title: "Blood Test Report",
      labName: "City Diagnostic Lab",
      date: "2025-01-08",
      testType: "Complete Blood Count (CBC)",
      results: {
        "Hemoglobin": "14.5 g/dL (Normal)",
        "WBC Count": "7,500 cells/μL (Normal)",
        "Platelet Count": "250,000 cells/μL (Normal)",
        "RBC Count": "5.0 million cells/μL (Normal)"
      },
      status: "Normal",
      reportedBy: "Dr. Ahmed Hassan",
      attachments: ["blood_test_report.pdf"]
    },
    {
      id: "MH-2025-003",
      type: "consultation",
      title: "Cardiology Consultation",
      doctorName: "Dr. Fatima Khan",
      specialization: "Cardiologist",
      hospital: "Heart Care Center",
      date: "2025-01-05",
      diagnosis: "Hypertension Management",
      symptoms: ["High blood pressure", "Occasional headaches"],
      treatment: "Blood pressure medication and lifestyle modifications",
      prescriptions: ["Amlodipine 5mg", "Aspirin 75mg"],
      notes: "Monitor blood pressure daily. Follow low-sodium diet. Regular exercise recommended.",
      followUp: "2025-02-05",
      attachments: []
    },
    {
      id: "MH-2024-004",
      type: "lab",
      title: "X-Ray Report - Chest",
      labName: "Medical Imaging Center",
      date: "2024-12-30",
      testType: "Chest X-Ray",
      results: {
        "Findings": "Clear lung fields",
        "Heart Size": "Normal",
        "Conclusion": "No acute abnormality detected"
      },
      status: "Normal",
      reportedBy: "Dr. Sarah Ahmed",
      attachments: ["chest_xray.pdf", "xray_image.jpg"]
    },
    {
      id: "MH-2024-005",
      type: "consultation",
      title: "ENT Consultation",
      doctorName: "Dr. Hassan Raza",
      specialization: "ENT Specialist",
      hospital: "ENT Care Clinic",
      date: "2024-12-28",
      diagnosis: "Sinusitis",
      symptoms: ["Nasal congestion", "Facial pain", "Headache"],
      treatment: "Antibiotics and nasal spray prescribed",
      prescriptions: ["Amoxicillin 500mg", "Nasal Spray"],
      notes: "Steam inhalation twice daily. Avoid allergens.",
      followUp: "2025-01-04",
      attachments: []
    },
    {
      id: "MH-2024-006",
      type: "lab",
      title: "Lipid Profile Test",
      labName: "Health Diagnostics Lab",
      date: "2024-12-20",
      testType: "Lipid Profile",
      results: {
        "Total Cholesterol": "180 mg/dL (Normal)",
        "LDL Cholesterol": "110 mg/dL (Normal)",
        "HDL Cholesterol": "50 mg/dL (Normal)",
        "Triglycerides": "140 mg/dL (Normal)"
      },
      status: "Normal",
      reportedBy: "Dr. Imran Shah",
      attachments: ["lipid_profile.pdf"]
    }
  ]

  const getRecordIcon = (type) => {
    switch(type) {
      case "consultation":
        return <Stethoscope className="w-5 h-5" />
      case "lab":
        return <TestTube className="w-5 h-5" />
      case "prescription":
        return <Pill className="w-5 h-5" />
      default:
        return <FileText className="w-5 h-5" />
    }
  }

  const getRecordColor = (type) => {
    switch(type) {
      case "consultation":
        return "bg-blue-100 text-blue-600"
      case "lab":
        return "bg-purple-100 text-purple-600"
      case "prescription":
        return "bg-green-100 text-green-600"
      default:
        return "bg-gray-100 text-gray-600"
    }
  }

  const filteredRecords = medicalRecords.filter(record => {
    const matchesFilter = selectedFilter === "all" || record.type === selectedFilter
    const matchesSearch = 
      record.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (record.doctorName && record.doctorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (record.diagnosis && record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesFilter && matchesSearch
  })

  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleUploadSubmit = () => {
    if (uploadedFile) {
      alert(`Uploading ${uploadedFile.name}...`)
      setUploadedFile(null)
      setShowUploadModal(false)
    }
  }

  const handleExportHistory = () => {
    alert("Exporting complete medical history as PDF...")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r bg-hero-gradient text-white rounded-2xl p-6 md:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-white/20 rounded-lg">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold">
                  Medical History
                </h1>
                <p className="text-blue-100">
                  Complete record of your medical consultations and reports
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setShowUploadModal(true)}
                className="bg-white text-blue-600 hover:bg-blue-50"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Report
              </Button>
              <Button
                onClick={handleExportHistory}
                variant="outline"
                className="border-white text-blue-500 hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-2 text-blue-500" />
                Export History
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <Card className="shadow-lg border">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search by doctor, diagnosis, test type, or record ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setSelectedFilter("all")}
                  variant={selectedFilter === "all" ? "default" : "outline"}
                  className={selectedFilter === "all" ? "bg-blue-600 text-white" : ""}
                >
                  <Filter className="w-4 h-4 mr-2" />
                  All
                </Button>
                <Button
                  onClick={() => setSelectedFilter("consultation")}
                  variant={selectedFilter === "consultation" ? "default" : "outline"}
                  className={selectedFilter === "consultation" ? "bg-blue-600 text-white" : ""}
                >
                  <Stethoscope className="w-4 h-4 mr-2" />
                  Consultations
                </Button>
                <Button
                  onClick={() => setSelectedFilter("lab")}
                  variant={selectedFilter === "lab" ? "default" : "outline"}
                  className={selectedFilter === "lab" ? "bg-purple-600 text-white" : ""}
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Lab Reports
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Consultations</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {medicalRecords.filter(r => r.type === "consultation").length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Stethoscope className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Lab Reports</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {medicalRecords.filter(r => r.type === "lab").length}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <TestTube className="w-8 h-8 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-gray-500">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Records</p>
                  <p className="text-3xl font-bold text-gray-600">
                    {medicalRecords.length}
                  </p>
                </div>
                <div className="p-3 bg-gray-100 rounded-lg">
                  <FileText className="w-8 h-8 text-gray-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Medical Records Timeline */}
        <div className="space-y-4">
          {filteredRecords.map((record) => (
            <Card key={record.id} className="shadow-lg border hover:shadow-xl transition-all">
              <CardContent className="p-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-4 pb-4 border-b">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${getRecordColor(record.type)}`}>
                      {getRecordIcon(record.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold">{record.title}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${getRecordColor(record.type)}`}>
                          {record.type.toUpperCase()}
                        </span>
                      </div>
                      {record.doctorName && (
                        <p className="text-sm text-gray-600 mb-1">
                          <User className="w-3 h-3 inline mr-1" />
                          {record.doctorName} - {record.specialization}
                        </p>
                      )}
                      {record.labName && (
                        <p className="text-sm text-gray-600 mb-1">
                          <Activity className="w-3 h-3 inline mr-1" />
                          {record.labName}
                        </p>
                      )}
                      {record.hospital && (
                        <p className="text-sm text-muted-foreground">{record.hospital}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-sm font-semibold text-gray-700">ID: {record.id}</span>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {record.date}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setSelectedRecord(record)}
                        variant="outline"
                        size="sm"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Record Type Specific Content */}
                {record.type === "consultation" && (
                  <div className="space-y-3">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-sm mb-2">Diagnosis</h4>
                      <p className="text-sm text-gray-700">{record.diagnosis}</p>
                    </div>
                    
                    {record.symptoms && record.symptoms.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Symptoms</h4>
                        <div className="flex flex-wrap gap-2">
                          {record.symptoms.map((symptom, idx) => (
                            <span key={idx} className="text-xs px-3 py-1 bg-red-100 text-red-700 rounded-full">
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {record.prescriptions && record.prescriptions.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Prescriptions</h4>
                        <div className="flex flex-wrap gap-2">
                          {record.prescriptions.map((med, idx) => (
                            <span key={idx} className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full">
                              {med}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {record.followUp && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span className="text-muted-foreground">Follow-up:</span>
                        <span className="font-semibold text-orange-600">{record.followUp}</span>
                      </div>
                    )}
                  </div>
                )}

                {record.type === "lab" && (
                  <div className="space-y-3">
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-semibold text-sm">Test: {record.testType}</h4>
                        <span className="text-xs px-3 py-1 bg-green-100 text-green-700 rounded-full font-semibold">
                          {record.status}
                        </span>
                      </div>
                      <div className="space-y-2">
                        {Object.entries(record.results).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center text-sm">
                            <span className="text-gray-600">{key}:</span>
                            <span className="font-semibold text-gray-800">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Reported by: {record.reportedBy}
                    </p>
                  </div>
                )}

                {/* Attachments */}
                {record.attachments && record.attachments.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-semibold text-sm mb-2">Attachments</h4>
                    <div className="flex flex-wrap gap-2">
                      {record.attachments.map((file, idx) => (
                        <div key={idx} className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-sm">
                          {file.endsWith('.pdf') ? (
                            <File className="w-4 h-4 text-red-600" />
                          ) : (
                            <FileImage className="w-4 h-4 text-blue-600" />
                          )}
                          <span className="text-gray-700">{file}</span>
                          <Button variant="ghost" size="sm" className="p-1 h-auto">
                            <Download className="w-3 h-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    Upload Lab Report
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowUploadModal(false)
                      setUploadedFile(null)
                    }}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                <CardDescription>
                  Upload your lab reports, X-rays, or medical documents
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors">
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                  />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm font-semibold text-gray-700 mb-1">
                      Click to upload or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF, JPG, JPEG or PNG (Max 10MB)
                    </p>
                  </label>
                </div>

                {uploadedFile && (
                  <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-green-700 flex-1">
                      {uploadedFile.name}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setUploadedFile(null)}
                      className="p-1 h-auto"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setShowUploadModal(false)
                      setUploadedFile(null)
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="flex-1 bg-blue-600 text-white"
                    onClick={handleUploadSubmit}
                    disabled={!uploadedFile}
                  >
                    Upload Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}