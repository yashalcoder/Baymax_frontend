"use client";
import React, { useState } from "react";
import {
  Search,
  User,
  Calendar,
  Phone,
  MapPin,
  AlertCircle,
  FileText,
  Pill,
  Activity,
  Stethoscope,
  TestTube,
  Download,
  Clock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

export default function MedicalHistoryDashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    visits: true,
    medications: true,
    labReports: true,
    diagnosis: true,
  });

  // Sample patients data
  const patients = [
    {
      id: 1,
      name: "Ahmad Khan",
      age: 45,
      gender: "Male",
      phone: "+92 300 1234567",
      address: "123 Main Street, Shahkot",
      bloodGroup: "B+",
      lastVisit: "2025-01-10",
      photo: null,
    },
    {
      id: 2,
      name: "Sara Ahmed",
      age: 32,
      gender: "Female",
      phone: "+92 300 2345678",
      address: "456 Hospital Road, Shahkot",
      bloodGroup: "A+",
      lastVisit: "2025-01-08",
      photo: null,
    },
    {
      id: 3,
      name: "Ali Hassan",
      age: 28,
      gender: "Male",
      phone: "+92 300 3456789",
      address: "789 Market Plaza, Shahkot",
      bloodGroup: "O+",
      lastVisit: "2025-01-05",
      photo: null,
    },
  ];

  // Medical history data for selected patient
  const medicalHistory = {
    visits: [
      {
        id: 1,
        date: "2025-01-10",
        reason: "Regular Checkup",
        doctor: "Dr. Ahmed",
        symptoms: ["Mild fever", "Headache"],
        diagnosis: "Viral Infection",
        prescription: "Paracetamol 500mg",
        notes: "Patient advised rest and plenty of fluids",
      },
      {
        id: 2,
        date: "2024-12-15",
        reason: "Follow-up",
        doctor: "Dr. Ahmed",
        symptoms: ["Chest pain", "Shortness of breath"],
        diagnosis: "Mild Angina",
        prescription: "Aspirin 75mg daily",
        notes: "ECG normal, advised lifestyle changes",
      },
      {
        id: 3,
        date: "2024-11-20",
        reason: "Consultation",
        doctor: "Dr. Ahmed",
        symptoms: ["Persistent cough"],
        diagnosis: "Bronchitis",
        prescription: "Antibiotics course",
        notes: "Completed medication course successfully",
      },
    ],
    currentMedications: [
      {
        id: 1,
        name: "Aspirin 75mg",
        dosage: "Once daily",
        duration: "Ongoing",
        startDate: "2024-12-15",
        prescribedBy: "Dr. Ahmed",
      },
      {
        id: 2,
        name: "Atorvastatin 10mg",
        dosage: "Once at night",
        duration: "3 months",
        startDate: "2024-11-01",
        prescribedBy: "Dr. Ahmed",
      },
    ],
    labReports: [
      {
        id: 1,
        testName: "Complete Blood Count",
        date: "2025-01-08",
        lab: "City Diagnostic Lab",
        result: "Normal",
        status: "completed",
        details: "WBC: 7500, RBC: 5.2M, Platelets: 250K",
      },
      {
        id: 2,
        testName: "Lipid Profile",
        date: "2024-12-10",
        lab: "Medicare Diagnostics",
        result: "Borderline High",
        status: "completed",
        details: "Total Cholesterol: 210 mg/dL, LDL: 140 mg/dL",
      },
      {
        id: 3,
        testName: "X-Ray Chest",
        date: "2024-11-20",
        lab: "Health Plus Lab",
        result: "Normal",
        status: "completed",
        details: "No abnormalities detected",
      },
    ],
    allergies: ["Penicillin", "Peanuts"],
    chronicConditions: ["Hypertension", "Type 2 Diabetes"],
    surgeries: [
      {
        name: "Appendectomy",
        date: "2018-05-15",
        hospital: "City Hospital",
      },
    ],
    familyHistory: ["Father: Heart Disease", "Mother: Diabetes"],
  };

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.phone.includes(searchTerm)
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "urgent":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Patient Medical History
          </h1>
          <p className="text-gray-600">
            View complete medical records and history
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Patient List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Patients</h2>

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Patient List */}
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient.id}
                    onClick={() => setSelectedPatient(patient)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedPatient?.id === patient.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300 hover:shadow-md"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {patient.name.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {patient.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {patient.age} years • {patient.gender}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Last visit: {patient.lastVisit}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel - Medical History */}
          <div className="lg:col-span-2">
            {selectedPatient ? (
              <div className="space-y-6">
                {/* Patient Info Card */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-bold backdrop-blur-sm">
                        {selectedPatient.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-2xl font-bold mb-2">
                          {selectedPatient.name}
                        </h2>
                        <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>
                              {selectedPatient.age} years •{" "}
                              {selectedPatient.gender}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4" />
                            <span>Blood: {selectedPatient.bloodGroup}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <span>{selectedPatient.phone}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            <span>Last: {selectedPatient.lastVisit}</span>
                          </div>
                        </div>
                        <div className="flex items-start gap-2 mt-2">
                          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">
                            {selectedPatient.address}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-white text-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Export
                    </button>
                  </div>
                </div>

                {/* Key Medical Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Allergies */}
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      <h3 className="font-semibold text-red-900">Allergies</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {medicalHistory.allergies.map((allergy, idx) => (
                        <span
                          key={idx}
                          className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Chronic Conditions */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Stethoscope className="w-5 h-5 text-orange-600" />
                      <h3 className="font-semibold text-orange-900">
                        Chronic Conditions
                      </h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {medicalHistory.chronicConditions.map(
                        (condition, idx) => (
                          <span
                            key={idx}
                            className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-medium"
                          >
                            {condition}
                          </span>
                        )
                      )}
                    </div>
                  </div>
                </div>

                {/* Visit History */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                  <div
                    className="p-6 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleSection("visits")}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <h3 className="text-xl font-bold text-gray-900">
                        Visit History
                      </h3>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {medicalHistory.visits.length} visits
                      </span>
                    </div>
                    {expandedSections.visits ? <ChevronUp /> : <ChevronDown />}
                  </div>

                  {expandedSections.visits && (
                    <div className="p-6 space-y-4">
                      {medicalHistory.visits.map((visit) => (
                        <div
                          key={visit.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-900 text-lg">
                                {visit.reason}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  {visit.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <User className="w-4 h-4" />
                                  {visit.doctor}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                            <div>
                              <p className="text-xs font-semibold text-gray-700 mb-1">
                                Symptoms:
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {visit.symptoms.map((symptom, idx) => (
                                  <span
                                    key={idx}
                                    className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs"
                                  >
                                    {symptom}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-gray-700 mb-1">
                                Diagnosis:
                              </p>
                              <p className="text-sm text-gray-900 font-medium">
                                {visit.diagnosis}
                              </p>
                            </div>
                          </div>

                          <div className="mb-3">
                            <p className="text-xs font-semibold text-gray-700 mb-1">
                              Prescription:
                            </p>
                            <p className="text-sm text-gray-900">
                              {visit.prescription}
                            </p>
                          </div>

                          <div className="bg-gray-50 rounded p-3">
                            <p className="text-xs font-semibold text-gray-700 mb-1">
                              Notes:
                            </p>
                            <p className="text-sm text-gray-600">
                              {visit.notes}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Current Medications */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                  <div
                    className="p-6 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleSection("medications")}
                  >
                    <div className="flex items-center gap-3">
                      <Pill className="w-5 h-5 text-green-600" />
                      <h3 className="text-xl font-bold text-gray-900">
                        Current Medications
                      </h3>
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {medicalHistory.currentMedications.length} active
                      </span>
                    </div>
                    {expandedSections.medications ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </div>

                  {expandedSections.medications && (
                    <div className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {medicalHistory.currentMedications.map((med) => (
                          <div
                            key={med.id}
                            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                          >
                            <h4 className="font-semibold text-gray-900 mb-2">
                              {med.name}
                            </h4>
                            <div className="space-y-1 text-sm text-gray-600">
                              <p>
                                <span className="font-medium">Dosage:</span>{" "}
                                {med.dosage}
                              </p>
                              <p>
                                <span className="font-medium">Duration:</span>{" "}
                                {med.duration}
                              </p>
                              <p>
                                <span className="font-medium">Started:</span>{" "}
                                {med.startDate}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                Prescribed by {med.prescribedBy}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Lab Reports */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200">
                  <div
                    className="p-6 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleSection("labReports")}
                  >
                    <div className="flex items-center gap-3">
                      <TestTube className="w-5 h-5 text-purple-600" />
                      <h3 className="text-xl font-bold text-gray-900">
                        Lab Reports
                      </h3>
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {medicalHistory.labReports.length} reports
                      </span>
                    </div>
                    {expandedSections.labReports ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </div>

                  {expandedSections.labReports && (
                    <div className="p-6 space-y-3">
                      {medicalHistory.labReports.map((report) => (
                        <div
                          key={report.id}
                          className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">
                                {report.testName}
                              </h4>
                              <div className="flex items-center gap-3 text-sm text-gray-600 mt-1 mb-2">
                                <span className="flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />
                                  {report.date}
                                </span>
                                <span>•</span>
                                <span>{report.lab}</span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {report.details}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                  report.status
                                )}`}
                              >
                                {report.result}
                              </span>
                              <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center gap-1">
                                <Download className="w-4 h-4" />
                                Download
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Additional Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Surgeries */}
                  <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-600" />
                      Past Surgeries
                    </h3>
                    <div className="space-y-2">
                      {medicalHistory.surgeries.map((surgery, idx) => (
                        <div key={idx} className="text-sm">
                          <p className="font-medium text-gray-900">
                            {surgery.name}
                          </p>
                          <p className="text-gray-600 text-xs">
                            {surgery.date} • {surgery.hospital}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Family History */}
                  <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-indigo-600" />
                      Family History
                    </h3>
                    <ul className="space-y-1">
                      {medicalHistory.familyHistory.map((history, idx) => (
                        <li key={idx} className="text-sm text-gray-700">
                          • {history}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-12 text-center h-full flex items-center justify-center">
                <div>
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Select a Patient
                  </h3>
                  <p className="text-gray-600">
                    Choose a patient from the list to view their complete
                    medical history
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
