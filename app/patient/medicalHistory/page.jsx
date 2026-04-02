"use client";
import { useState, useEffect } from "react";
import {
  FileText,
  Download,
  Calendar,
  User,
  Stethoscope,
  Loader2,
  AlertCircle,
  Pill,
  FlaskConical,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function MedicalHistoryPage() {
  const [history, setHistory]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [exporting, setExporting]   = useState(false);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { setError("Not authenticated."); setLoading(false); return; }

        const res  = await fetch(`${API}/api/patient/my-medical-history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        if (!res.ok || !data.success) {
          setError(data.message || "Failed to load medical history.");
          setLoading(false);
          return;
        }
        setHistory(data.data || []);
      } catch {
        setError("Could not connect to server.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  // ── Export full medical history as PDF ────────────────────────────────────
  // Calls: GET /api/patient/medical-history/export  (patientRoutes.js)
  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem("token");
      const res   = await fetch(`${API}/api/patient/medical-history/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Failed to export medical history.");
        return;
      }

      const blob = await res.blob();
      const url  = window.URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = "medical-history.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export error:", err);
      alert("Could not export medical history.");
    } finally {
      setExporting(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-blue-600">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-lg font-medium">Loading medical history…</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-red-500">
        <AlertCircle className="w-10 h-10" />
        <p className="text-lg font-medium">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl p-6 shadow-lg flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-lg">
              <FileText className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Medical History</h1>
              <p className="text-blue-100 text-sm">Your complete visit and diagnosis records</p>
            </div>
          </div>

          {/* ── Export PDF button ─────────────────────────────────────────── */}
          <button
            onClick={handleExportPDF}
            disabled={exporting}
            className="flex items-center gap-2 px-5 py-2.5 bg-white text-blue-700 font-semibold rounded-xl shadow hover:bg-blue-50 transition-colors disabled:opacity-60"
          >
            {exporting
              ? <><Loader2 className="w-4 h-4 animate-spin" /> Exporting…</>
              : <><Download className="w-4 h-4" /> Export Full PDF</>
            }
          </button>
        </div>

        {/* Empty state */}
        {history.length === 0 && (
          <div className="bg-white rounded-xl shadow border p-16 text-center">
            <Stethoscope className="w-20 h-20 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Records Yet</h3>
            <p className="text-gray-400">Your doctor hasn&apos;t added any visit records yet.</p>
          </div>
        )}

        {/* History cards */}
        <div className="space-y-4">
          {history.map((record) => (
            <div key={record._id} className="bg-white rounded-xl shadow border hover:shadow-md transition-all p-6">

              {/* Visit header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Stethoscope className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-lg">{record.diagnosis}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                      <User className="w-3.5 h-3.5" /> Dr. {record.doctorName}
                    </p>
                  </div>
                </div>
                <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500 bg-gray-50 border rounded-full px-3 py-1 self-start md:self-auto">
                  <Calendar className="w-4 h-4" />
                  {new Date(record.visitDate).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric",
                  })}
                </span>
              </div>

              {/* Prescriptions */}
              {record.prescriptions?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <Pill className="w-3.5 h-3.5" /> Prescribed Medicines
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {record.prescriptions.map((p, i) => (
                      <span key={i} className="text-sm px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-full font-medium">
                        {p.medicineName} — {p.dosage}, {p.duration}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Lab Tests */}
              {record.labTests?.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2 flex items-center gap-1">
                    <FlaskConical className="w-3.5 h-3.5" /> Lab Tests
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {record.labTests.map((t, i) => (
                      <span key={i} className="text-sm px-3 py-1 bg-yellow-50 border border-yellow-100 text-yellow-700 rounded-full font-medium">
                        {t.testName}: {t.result || "Pending"} (Normal: {t.normalRange || "N/A"})
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {record.notes && (
                <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-2 border-l-4 border-blue-300">
                  <span className="font-semibold text-gray-700">Notes: </span>{record.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}