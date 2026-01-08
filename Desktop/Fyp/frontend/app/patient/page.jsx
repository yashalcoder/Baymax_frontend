"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Pill,
  Calendar,
  User,
  FileText,
  Mail,
  IdCard
} from "lucide-react"

const PatientDashboard = () => {
  // Patient profile (coming from backend in real app)
  const patientProfile = {
    id: "PAT-2025-001",
    name: "Ali Ahmed Hassan",
    email: "ali.ahmed@example.com",
    contactNumber: "+92 300 1234567",
    address: "House # 123, Street 4, Johar Town, Lahore, Pakistan",
    cnic: "35202-1234567-1",
    gender: "Male",
    allergies: "Penicillin, Dust",
    majorDisease: "Hypertension",
    bloodGroup: "O+",
  }

  const recentConsultations = [
    {
      id: 1,
      doctorName: "Dr. Muhammad Ali",
      specialization: "General Physician",
      date: "2025-01-10",
      diagnosis: "Common Cold",
      medicines: ["Paracetamol 500mg", "Cough Syrup"],
      status: "Completed",
    },
    {
      id: 2,
      doctorName: "Dr. Fatima Khan",
      specialization: "Cardiologist",
      date: "2025-01-05",
      diagnosis: "Hypertension Check-up",
      medicines: ["Amlodipine 5mg", "Aspirin 75mg"],
      status: "Completed",
    },
    {
      id: 3,
      doctorName: "Dr. Hassan Raza",
      specialization: "ENT Specialist",
      date: "2024-12-28",
      diagnosis: "Sinusitis",
      medicines: ["Amoxicillin 500mg", "Nasal Spray"],
      status: "Completed",
    },
  ]

  const notifications = [
    {
      id: 1,
      type: "prescription",
      title: "New Prescription Ready",
      message: "Your prescription from Dr. Muhammad Ali is ready for pickup",
      time: "2 hours ago",
      icon: Pill,
      color: "bg-blue-100",
      textColor: "text-blue-700",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Patient Info */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Welcome / Banner Card */}
          <div className="lg:col-span-2 bg-gradient-to-r bg-hero-gradient text-white rounded-2xl p-4 md:p-5 shadow-lg">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-bold mb-2">
                  Welcome back, {patientProfile.name.split(" ")[0]}!
                </h1>
                <p className="text-blue-100 mb-4">
                  Here&apos;s your health overview for today
                </p>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4" />
                  <span>Wednesday, December 10, 2025</span>
                </div>

                {/* Patient Quick Details in Blue Section */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs md:text-sm font-medium">
                  {/* Email – bigger pill, 2 columns on desktop */}
                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-2 col-span-1 md:col-span-2">
                    <Mail className="w-4 h-4" />
                    <span className="break-all">
                      {patientProfile.email}
                    </span>
                  </div>

                  {/* Gender */}
                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-2 col-span-1">
                    <User className="w-4 h-4" />
                    <span>{patientProfile.gender}</span>
                  </div>

                  {/* CNIC */}
                  <div className="flex items-center gap-2 bg-white/10 rounded-full px-3 py-2 col-span-1 md:col-span-1">
                    <IdCard className="w-4 h-4" />
                    <span className="break-all">{patientProfile.cnic}</span>
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
                <span className="font-semibold">{patientProfile.id}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Name</span>
                <span className="font-semibold">{patientProfile.name}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Blood Group</span>
                <span className="font-semibold text-red-600">
                  {patientProfile.bloodGroup}
                </span>
              </div>

              <div className="border-t pt-3 space-y-2">
                <div className="flex justify-between gap-4">
                  <div className="flex flex-col gap-1 w-full">
                    <span className="text-muted-foreground">Contact No.</span>
                    <span className="font-medium">
                      {patientProfile.contactNumber}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">Full Address</span>
                  <span className="font-medium text-xs md:text-sm leading-snug">
                    {patientProfile.address}
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
            {/* Allergies */}
            <div className="bg-red-50 border border-red-200 p-3 rounded-xl shadow-sm">
              <p className="text-xs uppercase font-medium text-red-600 mb-1">
                Allergies
              </p>
              <p className="font-semibold text-sm text-gray-800">
                {patientProfile.allergies || "No known allergies"}
              </p>
            </div>

            {/* Major Disease */}
            <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-xl shadow-sm">
              <p className="text-xs uppercase font-medium text-yellow-700 mb-1">
                Major Disease
              </p>
              <p className="font-semibold text-sm text-gray-800">
                {patientProfile.majorDisease || "None recorded"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications Banner */}
        <Card className="shadow-lg border-l-4 border-l-blue-600">
          <CardContent className="p-4">
            {notifications.map((notif) => {
              const IconComponent = notif.icon
              return (
                <div
                  key={notif.id}
                  className="flex items-center gap-4 p-3 rounded-xl hover:bg-blue-50/50 transition-all cursor-pointer"
                >
                  <div className={`p-3 rounded-xl ${notif.color}`}>
                    <IconComponent className={`w-6 h-6 ${notif.textColor}`} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-base mb-1">
                      {notif.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {notif.message}
                    </p>
                  </div>
                  <span className="text-xs font-medium text-blue-600 whitespace-nowrap">
                    {notif.time}
                  </span>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Consultations */}
        <Card className="shadow-lg border">
          <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
            <CardTitle className="flex items-center gap-2 text-lg">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
              Recent Consultations
            </CardTitle>
            <CardDescription>Your latest medical visits</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {recentConsultations.map((consultation) => (
              <div
                key={consultation.id}
                className="p-4 rounded-xl border-2 border-border hover:border-purple-300 hover:bg-purple-50/50 transition-all"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-base">
                      {consultation.doctorName}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {consultation.specialization}
                    </p>
                  </div>
                  <span className="text-xs font-medium px-3 py-1 bg-green-100 text-green-700 rounded-full">
                    {consultation.date}
                  </span>
                </div>
                <div className="mb-3 pb-3 border-b">
                  <p className="text-sm font-medium text-gray-700">
                    <span className="text-muted-foreground">Diagnosis:</span>{" "}
                    {consultation.diagnosis}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    Prescribed Medicines:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {consultation.medicines.map((med, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium"
                      >
                        {med}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default PatientDashboard
