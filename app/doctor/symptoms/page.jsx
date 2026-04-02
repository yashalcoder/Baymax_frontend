"use client";
import React, { useState,useEffect } from "react";
import {
  Search,
  AlertCircle,
  CheckCircle,
  Calendar,
  User,
  FileText,
  Pill,
  Activity,
} from "lucide-react";
import {usePatient} from "@/components/Context/PatientContext";
export default function DiagnosisPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSymptom, setEditingSymptom] = useState(null);
  const [editingDisease, setEditingDisease] = useState(null);
  const [editingPatient, setEditingPatient] = useState(false);
// At top of DiagnosisPage component
const [loading, setLoading] = useState(true);
const consultationId=localStorage.getItem("consultationId");
const backendUrl=process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const [diagnosisData, setDiagnosisData] = useState()
const {setPatientData} = usePatient();
  const handleSavePatient = (updatedData) => {
    setDiagnosisData((prev) => ({
      ...prev,
      patientInfo: updatedData,
    }));
    setEditingPatient(false);
  };
  
  // const handleSaveSymptom = (updatedSymptom) => {
  //   setDiagnosisData((prev) => ({
  //     ...prev,
  //     symptoms: prev.symptoms.map((s) =>
  //       s.id === updatedSymptom.id ? updatedSymptom : s
  //     ),
  //   }));
  //   setEditingSymptom(null);
  // };

  // const handleSaveDisease = (updatedDisease) => {
  //   setDiagnosisData((prev) => ({
  //     ...prev,
  //     diseases: prev.diseases.map((d) =>
  //       d.id === updatedDisease.id ? updatedDisease : d
  //     ),
  //   }));
  //   setEditingDisease(null);
  // };
const handleEditSymptom = (symptomId) => {
    setEditingSymptom(symptomId);
    const respone = fetch(`${backendUrl}/api/diagnosis/${consultationId}/symptom/${symptomId}`,{
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then(res => res.json())
    .then(data => {
      console.log("Symptom details:", data);
      // You can set the symptom details in state if needed for editing
    })
    .catch(err => {
      console.error("Error fetching symptom details:", err);
    });

  };

  const handleEditDisease = (diseaseId) => {
    setEditingDisease(diseaseId);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-700 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-700 border-green-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
    }
  };
  const handleSaveSymptom = (updatedSymptom) => {
  // API call to backend
  fetch(`${backendUrl}/api/diagnosis/${consultationId}/symptoms/${updatedSymptom.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      name: updatedSymptom.name,
      duration: updatedSymptom.duration,
      severity: updatedSymptom.severity,
    }),
  });

  // Update local state
  setDiagnosisData((prev) => ({
    ...prev,
    symptoms: prev.symptoms.map((s) =>
      s.id === updatedSymptom.id ? updatedSymptom : s
    ),
  }));
  setEditingSymptom(null);
};
const handleSaveDisease = (updatedDisease) => {
  // API call to backend
  fetch(`${backendUrl}/api/diagnosis/${consultationId}/diseases/${updatedDisease.id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(updatedDisease),
  });

  // Update local state
  setDiagnosisData((prev) => ({
    ...prev,
    diseases: prev.diseases.map((d) =>
      d.id === updatedDisease.id ? updatedDisease : d
    ),
  }));
  setEditingDisease(null);
};

useEffect(() => {
  fetch(`${backendUrl}/api/diagnosis/${consultationId}`,{
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    //yaha pr patientid pass kr aur conroller mein patient name waegara users table s se nikalwa le rather then finding from consualatiaon
  }
  )
    .then(res => res.json())
    .then(data => {
      setDiagnosisData(data);
      setPatientData(data.patientInfo); // Set patient data in context
      setLoading(false);
    });
}, []);

if (loading) return <div>Loading...</div>;
  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return "text-red-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-blue-600";
  };
  const handleExportReport = async () => {
  try {
    const response = await fetch(`${backendUrl}/api/diagnosis/${consultationId}/export`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await response.json();

    const printDiv = document.createElement('div');
printDiv.id = 'print-report';
printDiv.innerHTML = `
  <style>
    #print-report {
      font-family: Arial, sans-serif;
      font-size: 12px;
    }
    .fixed-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      background: white;
      text-align: center;
      padding: 12px 40px 8px;
      border-bottom: 2px solid #2563eb;
      z-index: 1000;
    }
    .fixed-footer {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      background: #fefce8;
      border-top: 1px solid #fde047;
      padding: 10px 40px;
      z-index: 1000;
    }
    .main-content {
      margin-top: 90px;
      margin-bottom: 100px;
      padding: 0 40px;
    }
  </style>

  <!-- Fixed Header -->
  <div class="fixed-header">
    <h1 style="color: #2563eb; font-size: 18px; margin: 0;">BayMax+</h1>
    <p style="color: #374151; font-size: 12px; margin: 2px 0;">Diagnosis Report</p>
    <p style="color: #6b7280; font-size: 10px; margin: 0;">Date: ${new Date(data.reportDate).toLocaleDateString('en-PK', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
  </div>

  <!-- Fixed Footer -->
  <div class="fixed-footer">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <div>
        <span style="color: #854d0e; font-size: 11px; font-weight: bold;">⚠️ Medical Disclaimer: </span>
        <span style="color: #713f12; font-size: 10px;">
          ${data.disclaimer || 'This is an AI-assisted diagnosis tool. All diagnoses should be verified by a qualified healthcare professional.'}
        </span>
      </div>
      <span style="color: #9ca3af; font-size: 10px; white-space: nowrap; margin-left: 12px;">
        Generated by BayMax+ | ${new Date().toLocaleDateString()}
      </span>
    </div>
  </div>

  <!-- Main Content -->
  <div class="main-content">

    <!-- Patient & Doctor Info -->
    <div style="display: flex; gap: 12px; margin-bottom: 14px;">
      <div style="flex: 1; background: #eff6ff; padding: 10px; border-radius: 6px;">
        <h3 style="color: #1d4ed8; margin: 0 0 6px; font-size: 12px;">Patient Information</h3>
        <p style="margin: 2px 0;"><strong>Name:</strong> ${diagnosisData.patientInfo.name}</p>
        <p style="margin: 2px 0;"><strong>ID:</strong> ${diagnosisData.patientInfo.id}</p>
        <p style="margin: 2px 0;"><strong>Age:</strong> ${diagnosisData.patientInfo.age} years</p>
      </div>
      <div style="flex: 1; background: #f0fdf4; padding: 10px; border-radius: 6px;">
        <h3 style="color: #15803d; margin: 0 0 6px; font-size: 12px;">Doctor Information</h3>
        <p style="margin: 2px 0;"><strong>Name:</strong> ${data.doctor || 'N/A'}</p>
        <p style="margin: 2px 0;"><strong>Date:</strong> ${diagnosisData.patientInfo.date}</p>
      </div>
    </div>

    <!-- Symptoms Table -->
    <div style="margin-bottom: 14px;">
      <h3 style="color: #1d4ed8; border-left: 3px solid #2563eb; padding-left: 8px; margin-bottom: 8px; font-size: 13px;">
        Extracted Symptoms (${diagnosisData.symptoms.length})
      </h3>
      <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
        <thead>
          <tr style="background: #2563eb; color: white;">
            <th style="padding: 6px 8px; text-align: left; border: 1px solid #ddd;">#</th>
            <th style="padding: 6px 8px; text-align: left; border: 1px solid #ddd;">Symptom</th>
            <th style="padding: 6px 8px; text-align: left; border: 1px solid #ddd;">Duration</th>
          </tr>
        </thead>
        <tbody>
          ${diagnosisData.symptoms.map((s, i) => `
            <tr style="background: ${i % 2 === 0 ? '#f9fafb' : 'white'};">
              <td style="padding: 6px 8px; border: 1px solid #ddd;">${i + 1}</td>
              <td style="padding: 6px 8px; border: 1px solid #ddd;">${s.name}</td>
              <td style="padding: 6px 8px; border: 1px solid #ddd;">${s.duration}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <!-- Diagnoses -->
    <div style="margin-bottom: 14px;">
      <h3 style="color: #1d4ed8; border-left: 3px solid #2563eb; padding-left: 8px; margin-bottom: 8px; font-size: 13px;">
        Potential Diagnoses
      </h3>
      ${diagnosisData.diseases.map((d, i) => `
        <div style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px; margin-bottom: 8px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
            <h4 style="margin: 0; color: #111827; font-size: 13px;">${i + 1}. ${d.name}</h4>
            <span style="color: ${d.confidence >= 80 ? '#dc2626' : d.confidence >= 60 ? '#d97706' : '#2563eb'}; font-weight: bold; font-size: 14px;">${d.confidence}%</span>
          </div>
          <span style="background: #f3e8ff; color: #7c3aed; padding: 1px 6px; border-radius: 4px; font-size: 10px;">${d.category || 'General'}</span>
          <p style="color: #6b7280; margin: 4px 0; font-size: 11px;">${d.description || ''}</p>
          <p style="margin: 4px 0; font-size: 11px;"><strong>Matching:</strong> <span style="color: #15803d;">${d.matchingSymptoms?.join(', ')}</span></p>
          <div style="margin-top: 4px; font-size: 11px;">
            <strong>Recommendations:</strong>
            <ul style="margin: 2px 0; padding-left: 16px;">
              ${d.recommendations?.map(r => `<li>${r}</li>`).join('')}
            </ul>
          </div>
        </div>
      `).join('')}
    </div>

<!-- Disclaimer -->
    <div style="background: #fefce8; border: 1px solid #fde047; border-radius: 6px; padding: 10px;">
      <h4 style="color: #854d0e; margin: 0 0 4px; font-size: 12px;">⚠️ Medical Disclaimer</h4>
      <p style="color: #713f12; font-size: 11px; margin: 0;">
        ${data.disclaimer || 'This is an AI-assisted diagnosis tool. All diagnoses should be verified by a qualified healthcare professional.'}
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; margin-top: 12px; padding-top: 8px; border-top: 1px solid #e5e7eb; color: #9ca3af; font-size: 10px;">
      Generated by BayMax+ | ${new Date().toLocaleString()}
    </div>

  </div>
`;
    document.body.appendChild(printDiv);
    window.print();
    document.body.removeChild(printDiv);

  } catch (err) {
    console.error("Export failed:", err);
    alert("Export failed. Please try again.");
  }
};
  const filteredSymptoms = diagnosisData.symptoms.filter((symptom) =>
    symptom.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Diagnosis Report
          </h1>
          <p className="text-gray-600">
            Extracted symptoms and potential diagnoses
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          {editingPatient ? (
            <div>
              <div className="space-y-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    defaultValue={diagnosisData.patientInfo.name}
                    id="patient-name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    defaultValue={diagnosisData.patientInfo.age}
                    id="patient-age"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
  type="date"
  defaultValue={new Date().toISOString().split("T")[0]} // ✅ current date "2026-03-08"
  id="patient-date"
  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Patient ID
                  </label>
                  <input
                    type="text"
                    defaultValue={diagnosisData.patientInfo.id}
                    id="patient-id"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    handleSavePatient({
                      name: document.getElementById("patient-name").value,
                      age: parseInt(
                        document.getElementById("patient-age").value
                      ),
                      date: document.getElementById("patient-date").value,
                      id: document.getElementById("patient-id").value,
                    });
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingPatient(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {diagnosisData.patientInfo.name}
                    </h2>
                    <p className="text-gray-600">
                      Patient ID: {diagnosisData.patientInfo.id}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEditingPatient(true)}
                  className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  Edit
                </button>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-gray-700">
                  <User className="w-4 h-4" />
                  <span>Age: {diagnosisData.patientInfo.age} years</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4" />
                  <span>Date: {new Date().toISOString().split("T")[0]}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Activity className="w-4 h-4" />
                  <span>Status: Active</span>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Extracted Symptoms
                  </h2>
                </div>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                  {diagnosisData.symptoms.length} symptoms
                </span>
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search symptoms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="p-6 space-y-3 max-h-96 overflow-y-auto">
              {filteredSymptoms.map((symptom) => (
                <div
                  key={symptom.id}
                  className={`p-4 rounded-lg border-2  transition-all hover:shadow-md`}
                >
                  {editingSymptom === symptom.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Symptom Name
                        </label>
                        <input
                          type="text"
                          defaultValue={symptom.name}
                          id={`symptom-name-${symptom.id}`}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Duration
                        </label>
                        <input
                          type="text"
                          defaultValue={symptom.duration}
                          id={`symptom-duration-${symptom.id}`}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Severity
                        </label>
                        <select
                          // defaultValue={symptom.severity}
                          id={`symptom-severity-${symptom.id}`}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {/* <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option> */}
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveSymptom({
                            id: symptom.id,
                            name: document.getElementById(`symptom-name-${symptom.id}`).value,
                            duration: document.getElementById(`symptom-duration-${symptom.id}`).value,
                            severity: document.getElementById(`symptom-severity-${symptom.id}`).value,
                          })}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingSymptom(null)}
                          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{symptom.name}</h3>
                          <p className="text-sm opacity-80">
                            Duration: {symptom.duration}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-1 rounded text-xs font-medium uppercase">
                            {symptom.severity}
                          </span>
                          <button
                            onClick={() => setEditingSymptom(symptom.id)}
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Potential Diagnoses
                </h2>
              </div>
              <p className="text-sm text-gray-600">
                Ranked by confidence level
              </p>
            </div>

            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {diagnosisData.diseases.map((disease, index) => (
                <div
                  key={disease.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all"
                >
                  {editingDisease === disease.id ? (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Disease Name
                        </label>
                        <input
                          type="text"
                          defaultValue={disease.name}
                          id={`disease-name-${disease.id}`}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Category
                        </label>
                        <input
                          type="text"
                          defaultValue={disease.category}
                          id={`disease-category-${disease.id}`}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Confidence (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          defaultValue={disease.confidence}
                          id={`disease-confidence-${disease.id}`}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Description
                        </label>
                        <textarea
                          defaultValue={disease.description}
                          id={`disease-description-${disease.id}`}
                          rows="2"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Matching Symptoms (comma separated)
                        </label>
                        <input
                          type="text"
                          defaultValue={disease.matchingSymptoms.join(", ")}
                          id={`disease-symptoms-${disease.id}`}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium mb-1">
                          Recommendations (one per line)
                        </label>
                        <textarea
                          defaultValue={disease.recommendations.join("\n")}
                          id={`disease-recommendations-${disease.id}`}
                          rows="3"
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveDisease({
                            id: disease.id,
                            name: document.getElementById(`disease-name-${disease.id}`).value,
                            category: document.getElementById(`disease-category-${disease.id}`).value,
                            confidence: parseInt(document.getElementById(`disease-confidence-${disease.id}`).value),
                            description: document.getElementById(`disease-description-${disease.id}`).value,
                            matchingSymptoms: document.getElementById(`disease-symptoms-${disease.id}`).value.split(",").map(s => s.trim()),
                            recommendations: document.getElementById(`disease-recommendations-${disease.id}`).value.split("\n").map(r => r.trim()),
                          })}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingDisease(null)}
                          className="px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                              index === 0
                                ? "bg-red-100 text-red-600"
                                : index === 1
                                ? "bg-yellow-100 text-yellow-600"
                                : "bg-blue-100 text-blue-600"
                            }`}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {disease.name}
                            </h3>
                            <span className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-medium mb-2">
                              {disease.category}
                            </span>
                            <p className="text-sm text-gray-600">
                              {disease.description}
                            </p>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div
                            className={`text-2xl font-bold ${getConfidenceColor(
                              disease.confidence
                            )}`}
                          >
                            {disease.confidence}%
                          </div>
                          <div className="text-xs text-gray-500 mb-2">
                            confidence
                          </div>
                          <button
                            onClick={() => setEditingDisease(disease.id)}
                            className="text-blue-600 hover:text-blue-700 text-sm"
                          >
                            Edit
                          </button>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          Matching Symptoms:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {disease.matchingSymptoms.map((symptom, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded text-xs"
                            >
                              <CheckCircle className="w-3 h-3" />
                              {symptom}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-gray-700 mb-2">
                          Recommendations:
                        </p>
                        <ul className="space-y-1">
                          {disease.recommendations.map((rec, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-gray-600 flex items-start gap-2"
                            >
                              <span className="text-blue-600 mt-1">•</span>
                              <span>{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

       <div className="mt-6 flex gap-4 justify-end no-print">
  <button
    onClick={handleExportReport}
    className="px-6 py-2 hover:cursor-pointer border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2"
  >
    <FileText className="w-4 h-4" />
    Export Report
  </button>
</div>

        <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900 mb-1">
              Medical Disclaimer
            </h4>
            <p className="text-sm text-yellow-800">
              This is an AI-assisted diagnosis tool. All diagnoses should be
              verified by a qualified healthcare professional. This report
              should not be used as the sole basis for medical decisions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
