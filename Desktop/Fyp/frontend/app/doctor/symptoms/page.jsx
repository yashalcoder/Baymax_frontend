"use client";
import React, { useState } from "react";
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

export default function DiagnosisPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingSymptom, setEditingSymptom] = useState(null);
  const [editingDisease, setEditingDisease] = useState(null);
  const [editingPatient, setEditingPatient] = useState(false);

  const [diagnosisData, setDiagnosisData] = useState({
    patientInfo: {
      name: "Ahmad Khan",
      age: 45,
      date: "2025-01-10",
      id: "P-2025-001",
    },
    symptoms: [
      {
        id: 1,
        name: "Persistent Cough",
        severity: "high",
        duration: "2 weeks",
      },
      { id: 2, name: "Fever", severity: "medium", duration: "3 days" },
      { id: 3, name: "Chest Pain", severity: "high", duration: "1 week" },
      { id: 4, name: "Fatigue", severity: "medium", duration: "2 weeks" },
      {
        id: 5,
        name: "Shortness of Breath",
        severity: "high",
        duration: "5 days",
      },
      { id: 6, name: "Headache", severity: "low", duration: "1 week" },
    ],
    diseases: [
      {
        id: 1,
        name: "Pneumonia",
        confidence: 85,
        category: "Respiratory",
        description:
          "Inflammation of the lungs caused by bacterial or viral infection",
        matchingSymptoms: [
          "Persistent Cough",
          "Fever",
          "Chest Pain",
          "Shortness of Breath",
        ],
        recommendations: [
          "Immediate medical consultation required",
          "Chest X-ray recommended",
          "Antibiotic treatment may be needed",
        ],
      },
      {
        id: 2,
        name: "Acute Bronchitis",
        confidence: 72,
        category: "Respiratory",
        description:
          "Inflammation of the bronchial tubes, often following a cold or flu",
        matchingSymptoms: ["Persistent Cough", "Fever", "Fatigue"],
        recommendations: [
          "Rest and hydration",
          "Over-the-counter cough medicine",
          "Follow-up if symptoms persist",
        ],
      },
      {
        id: 3,
        name: "Upper Respiratory Infection",
        confidence: 65,
        category: "Respiratory",
        description: "Common infection affecting the nose, throat, and airways",
        matchingSymptoms: ["Cough", "Fever", "Fatigue", "Headache"],
        recommendations: [
          "Adequate rest",
          "Plenty of fluids",
          "Symptom management with OTC medications",
        ],
      },
    ],
  });

  const handleSavePatient = (updatedData) => {
    setDiagnosisData((prev) => ({
      ...prev,
      patientInfo: updatedData,
    }));
    setEditingPatient(false);
  };

  const handleSaveSymptom = (updatedSymptom) => {
    setDiagnosisData((prev) => ({
      ...prev,
      symptoms: prev.symptoms.map((s) =>
        s.id === updatedSymptom.id ? updatedSymptom : s
      ),
    }));
    setEditingSymptom(null);
  };

  const handleSaveDisease = (updatedDisease) => {
    setDiagnosisData((prev) => ({
      ...prev,
      diseases: prev.diseases.map((d) =>
        d.id === updatedDisease.id ? updatedDisease : d
      ),
    }));
    setEditingDisease(null);
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

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return "text-red-600";
    if (confidence >= 60) return "text-yellow-600";
    return "text-blue-600";
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
                    defaultValue={diagnosisData.patientInfo.date}
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
                  <span>Date: {diagnosisData.patientInfo.date}</span>
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
                  className={`p-4 rounded-lg border-2 ${getSeverityColor(
                    symptom.severity
                  )} transition-all hover:shadow-md`}
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
                          defaultValue={symptom.severity}
                          id={`symptom-severity-${symptom.id}`}
                          className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            handleSaveSymptom({
                              ...symptom,
                              name: document.getElementById(
                                `symptom-name-${symptom.id}`
                              ).value,
                              duration: document.getElementById(
                                `symptom-duration-${symptom.id}`
                              ).value,
                              severity: document.getElementById(
                                `symptom-severity-${symptom.id}`
                              ).value,
                            });
                          }}
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
                          onClick={() => {
                            handleSaveDisease({
                              ...disease,
                              name: document.getElementById(
                                `disease-name-${disease.id}`
                              ).value,
                              category: document.getElementById(
                                `disease-category-${disease.id}`
                              ).value,
                              confidence: parseInt(
                                document.getElementById(
                                  `disease-confidence-${disease.id}`
                                ).value
                              ),
                              description: document.getElementById(
                                `disease-description-${disease.id}`
                              ).value,
                              matchingSymptoms: document
                                .getElementById(
                                  `disease-symptoms-${disease.id}`
                                )
                                .value.split(",")
                                .map((s) => s.trim()),
                              recommendations: document
                                .getElementById(
                                  `disease-recommendations-${disease.id}`
                                )
                                .value.split("\n")
                                .filter((r) => r.trim()),
                            });
                          }}
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

        <div className="mt-6 flex gap-4 justify-end">
          <button className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Export Report
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
            <Pill className="w-4 h-4" />
            Create Prescription
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
