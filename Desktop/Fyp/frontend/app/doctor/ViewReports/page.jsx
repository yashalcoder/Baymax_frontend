"use client";
import { useState } from "react";
import {
  FileText,
  Download,
  Eye,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  ChevronDown,
  X,
  FileImage,
  FilePlus,
  Heart,
  Brain,
  Bone,
  Activity,
  Pill,
  TestTube,
  AlertCircle,
  CheckCircle,
  TrendingUp,
  Package,
} from "lucide-react";

export default function DoctorViewReports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateFilter, setDateFilter] = useState("all");
  const [reportTypeFilter, setReportTypeFilter] = useState("all");
  const [selectedReport, setSelectedReport] = useState(null);

  // Mock data for reports
  const reports = [
    {
      id: 1,
      patientName: "Ali Khan",
      patientId: "P-001",
      patientAge: 45,
      patientGender: "Male",
      reportType: "Blood Test",
      reportName: "Complete Blood Count (CBC)",
      uploadDate: "2025-10-28",
      reportDate: "2025-10-27",
      status: "new",
      urgency: "normal",
      fileType: "PDF",
      fileSize: "2.3 MB",
      labName: "City Diagnostic Center",
      findings: "Hemoglobin slightly low",
      notes: "Patient complains of fatigue",
    },
    {
      id: 2,
      patientName: "Fatima Ahmed",
      patientId: "P-002",
      patientAge: 32,
      patientGender: "Female",
      reportType: "X-Ray",
      reportName: "Chest X-Ray",
      uploadDate: "2025-10-27",
      reportDate: "2025-10-26",
      status: "reviewed",
      urgency: "urgent",
      fileType: "Image",
      fileSize: "5.1 MB",
      labName: "Medical Imaging Center",
      findings: "No abnormalities detected",
      notes: "Follow-up required in 2 weeks",
    },
    {
      id: 3,
      patientName: "Hassan Raza",
      patientId: "P-003",
      patientAge: 58,
      patientGender: "Male",
      reportType: "ECG",
      reportName: "Electrocardiogram",
      uploadDate: "2025-10-27",
      reportDate: "2025-10-27",
      status: "new",
      urgency: "urgent",
      fileType: "PDF",
      fileSize: "1.8 MB",
      labName: "Heart Care Clinic",
      findings: "Irregular rhythm detected",
      notes: "Patient has history of hypertension",
    },
    {
      id: 4,
      patientName: "Ayesha Malik",
      patientId: "P-004",
      patientAge: 28,
      patientGender: "Female",
      reportType: "Blood Test",
      reportName: "Lipid Profile",
      uploadDate: "2025-10-26",
      reportDate: "2025-10-25",
      status: "reviewed",
      urgency: "normal",
      fileType: "PDF",
      fileSize: "1.5 MB",
      labName: "City Diagnostic Center",
      findings: "All values within normal range",
      notes: "Maintain healthy diet",
    },
    {
      id: 5,
      patientName: "Muhammad Usman",
      patientId: "P-005",
      patientAge: 41,
      patientGender: "Male",
      reportType: "MRI",
      reportName: "Brain MRI",
      uploadDate: "2025-10-26",
      reportDate: "2025-10-24",
      status: "new",
      urgency: "normal",
      fileType: "Image",
      fileSize: "12.4 MB",
      labName: "Advanced Imaging Center",
      findings: "Pending radiologist review",
      notes: "Patient experiencing headaches",
    },
    {
      id: 6,
      patientName: "Sana Tariq",
      patientId: "P-006",
      patientAge: 35,
      patientGender: "Female",
      reportType: "Ultrasound",
      reportName: "Abdominal Ultrasound",
      uploadDate: "2025-10-25",
      reportDate: "2025-10-24",
      status: "reviewed",
      urgency: "normal",
      fileType: "Image",
      fileSize: "8.2 MB",
      labName: "Women's Health Center",
      findings: "Normal findings",
      notes: "Routine checkup",
    },
    {
      id: 7,
      patientName: "Kamran Ali",
      patientId: "P-007",
      patientAge: 52,
      patientGender: "Male",
      reportType: "Blood Test",
      reportName: "HbA1c Test",
      uploadDate: "2025-10-25",
      reportDate: "2025-10-24",
      status: "new",
      urgency: "urgent",
      fileType: "PDF",
      fileSize: "1.2 MB",
      labName: "Diabetes Care Lab",
      findings: "Elevated glucose levels",
      notes: "Diabetic patient - medication adjustment needed",
    },
    {
      id: 8,
      patientName: "Zainab Hassan",
      patientId: "P-008",
      patientAge: 29,
      patientGender: "Female",
      reportType: "Blood Test",
      reportName: "Thyroid Function Test",
      uploadDate: "2025-10-24",
      reportDate: "2025-10-23",
      status: "reviewed",
      urgency: "normal",
      fileType: "PDF",
      fileSize: "1.7 MB",
      labName: "Endocrine Lab",
      findings: "TSH levels slightly elevated",
      notes: "Patient on thyroid medication",
    },
  ];

  const getReportIcon = (type) => {
    switch (type) {
      case "Blood Test":
        return <TestTube className="w-5 h-5" />;
      case "X-Ray":
        return <Bone className="w-5 h-5" />;
      case "ECG":
        return <Heart className="w-5 h-5" />;
      case "MRI":
        return <Brain className="w-5 h-5" />;
      case "Ultrasound":
        return <Activity className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "reviewed":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "urgent":
        return "bg-red-100 text-red-700 border-red-200";
      case "normal":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filteredReports = reports.filter((report) => {
    const matchesSearch =
      report.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.reportName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.patientId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedFilter === "all" || report.status === selectedFilter;
    const matchesReportType =
      reportTypeFilter === "all" || report.reportType === reportTypeFilter;

    let matchesDate = true;
    if (dateFilter === "today") {
      matchesDate = report.uploadDate === "2025-10-28";
    } else if (dateFilter === "week") {
      matchesDate = new Date(report.uploadDate) >= new Date("2025-10-22");
    } else if (dateFilter === "month") {
      matchesDate = new Date(report.uploadDate) >= new Date("2025-10-01");
    }

    return matchesSearch && matchesStatus && matchesReportType && matchesDate;
  });

  const stats = {
    total: reports.length,
    new: reports.filter((r) => r.status === "new").length,
    reviewed: reports.filter((r) => r.status === "reviewed").length,
    urgent: reports.filter((r) => r.urgency === "urgent").length,
  };

  const handleViewReport = (report) => {
    setSelectedReport(report);
  };

  const handleDownloadReport = (report) => {
    alert(`Downloading ${report.reportName} for ${report.patientName}`);
  };

  const markAsReviewed = (reportId) => {
    alert(`Marking report ${reportId} as reviewed`);
    setSelectedReport(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Patient Reports
          </h1>
          <p className="text-gray-600">
            View and manage medical reports uploaded by patients
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Reports
                </p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {stats.total}
                </p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">New Reports</p>
                <p className="text-3xl font-bold text-blue-600 mt-2">
                  {stats.new}
                </p>
              </div>
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                <FilePlus className="w-7 h-7 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Reviewed</p>
                <p className="text-3xl font-bold text-green-600 mt-2">
                  {stats.reviewed}
                </p>
              </div>
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-7 h-7 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Urgent</p>
                <p className="text-3xl font-bold text-red-600 mt-2">
                  {stats.urgent}
                </p>
              </div>
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by patient name, report type, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Status Filter */}
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
            </select>

            {/* More Filters Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2 font-medium"
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date Range
                </label>
                <select
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Time</option>
                  <option value="today">Today</option>
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Type
                </label>
                <select
                  value={reportTypeFilter}
                  onChange={(e) => setReportTypeFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="Blood Test">Blood Test</option>
                  <option value="X-Ray">X-Ray</option>
                  <option value="ECG">ECG</option>
                  <option value="MRI">MRI</option>
                  <option value="Ultrasound">Ultrasound</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Reports List */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Report Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold">
                          {report.patientName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {report.patientName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {report.patientId} • {report.patientAge}Y •{" "}
                            {report.patientGender}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                            report.reportType === "Blood Test"
                              ? "bg-red-100 text-red-600"
                              : report.reportType === "X-Ray"
                              ? "bg-purple-100 text-purple-600"
                              : report.reportType === "ECG"
                              ? "bg-pink-100 text-pink-600"
                              : report.reportType === "MRI"
                              ? "bg-indigo-100 text-indigo-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {getReportIcon(report.reportType)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">
                            {report.reportName}
                          </p>
                          <p className="text-sm text-gray-500">
                            {report.reportType} • {report.fileSize}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            {report.labName}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {new Date(report.uploadDate).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric", year: "numeric" }
                          )}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Report Date:{" "}
                        {new Date(report.reportDate).toLocaleDateString(
                          "en-US",
                          { month: "short", day: "numeric" }
                        )}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                            report.status
                          )}`}
                        >
                          {report.status === "new" ? "New" : "Reviewed"}
                        </span>
                        {report.urgency === "urgent" && (
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${getUrgencyColor(
                              report.urgency
                            )} ml-2`}
                          >
                            Urgent
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleViewReport(report)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="View Report"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDownloadReport(report)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Download Report"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No reports found</p>
              <p className="text-gray-400 text-sm mt-2">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Report Detail Modal */}
      {selectedReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
              <h2 className="text-2xl font-bold text-white">Report Details</h2>
              <button
                onClick={() => setSelectedReport(null)}
                className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Patient Info */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  Patient Information
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Name</p>
                    <p className="font-semibold text-gray-900">
                      {selectedReport.patientName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Patient ID</p>
                    <p className="font-semibold text-gray-900">
                      {selectedReport.patientId}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Age</p>
                    <p className="font-semibold text-gray-900">
                      {selectedReport.patientAge} Years
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Gender</p>
                    <p className="font-semibold text-gray-900">
                      {selectedReport.patientGender}
                    </p>
                  </div>
                </div>
              </div>

              {/* Report Info */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Report Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Report Name</p>
                    <p className="font-semibold text-gray-900">
                      {selectedReport.reportName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Report Type</p>
                    <p className="font-semibold text-gray-900">
                      {selectedReport.reportType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Lab/Center</p>
                    <p className="font-semibold text-gray-900">
                      {selectedReport.labName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Report Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedReport.reportDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Upload Date</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedReport.uploadDate).toLocaleDateString(
                        "en-US",
                        {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        }
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">File Size</p>
                    <p className="font-semibold text-gray-900">
                      {selectedReport.fileSize}
                    </p>
                  </div>
                </div>
              </div>

              {/* Findings */}
              <div className="bg-blue-50 rounded-xl p-6 mb-6 border border-blue-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  Findings
                </h3>
                <p className="text-gray-700">{selectedReport.findings}</p>
              </div>

              {/* Notes */}
              <div className="bg-yellow-50 rounded-xl p-6 mb-6 border border-yellow-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  Patient Notes
                </h3>
                <p className="text-gray-700">{selectedReport.notes}</p>
              </div>

              {/* File Preview */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  File Preview
                </h3>
                <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  {selectedReport.fileType === "PDF" ? (
                    <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  ) : (
                    <FileImage className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  )}
                  <p className="text-gray-600 font-medium">
                    {selectedReport.reportName}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {selectedReport.fileType} • {selectedReport.fileSize}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleDownloadReport(selectedReport)}
                  className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Report
                </button>
                {selectedReport.status === "new" && (
                  <button
                    onClick={() => markAsReviewed(selectedReport.id)}
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Mark as Reviewed
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
