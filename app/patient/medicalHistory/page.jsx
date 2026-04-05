"use client";
import { useState, useEffect, useRef } from "react";
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
  Upload,
  X,
  CheckCircle2,
  Microscope,
  Brain,
  ClipboardList,
  StickyNote,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FileUp,
} from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// ─────────────────────────────────────────────────────────────────────────────
// OCR Result Modal
// ─────────────────────────────────────────────────────────────────────────────
function OcrResultModal({ result, onClose }) {
  const sections = [
    {
      key: "diagnoses",
      label: "Diagnoses",
      icon: <Stethoscope className="w-4 h-4" />,
      color: "blue",
      bg: "bg-blue-50",
      border: "border-blue-200",
      text: "text-blue-700",
      badge: "bg-blue-100 text-blue-800",
    },
    {
      key: "medicines",
      label: "Medicines",
      icon: <Pill className="w-4 h-4" />,
      color: "green",
      bg: "bg-green-50",
      border: "border-green-200",
      text: "text-green-700",
      badge: "bg-green-100 text-green-800",
    },
    {
      key: "medical_terms",
      label: "Medical Terms",
      icon: <Microscope className="w-4 h-4" />,
      color: "purple",
      bg: "bg-purple-50",
      border: "border-purple-200",
      text: "text-purple-700",
      badge: "bg-purple-100 text-purple-800",
    },
    {
      key: "doctor_notes",
      label: "Doctor Notes",
      icon: <StickyNote className="w-4 h-4" />,
      color: "amber",
      bg: "bg-amber-50",
      border: "border-amber-200",
      text: "text-amber-700",
      badge: "bg-amber-100 text-amber-800",
    },
  ];

  const [showRaw, setShowRaw] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">OCR Extraction Complete</h2>
              <p className="text-blue-100 text-xs">
                AI-extracted medical data from your report
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success banner */}
        <div className="bg-green-50 border-b border-green-100 px-5 py-3 flex items-center gap-2 flex-shrink-0">
          <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700 font-medium">
            Report saved successfully. Data extracted and stored in your profile.
          </p>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">
          {sections.map((s) => {
            const items = result?.[s.key] || [];
            if (items.length === 0) return null;
            return (
              <div
                key={s.key}
                className={`${s.bg} ${s.border} border rounded-xl p-4`}
              >
                <p
                  className={`text-xs font-bold uppercase tracking-wider ${s.text} mb-3 flex items-center gap-1.5`}
                >
                  {s.icon}
                  {s.label}
                  <span
                    className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${s.badge}`}
                  >
                    {items.length}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2">
                  {items.map((item, i) => (
                    <span
                      key={i}
                      className={`text-sm px-3 py-1 rounded-full font-medium border ${s.badge} ${s.border}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Raw extracted text (collapsible) */}
          {result?.extracted_text && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <button
                onClick={() => setShowRaw((v) => !v)}
                className="w-full px-4 py-3 flex items-center justify-between text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <span className="flex items-center gap-2">
                  <ClipboardList className="w-4 h-4" />
                  Raw Extracted Text
                </span>
                {showRaw ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>
              {showRaw && (
                <div className="px-4 pb-4">
                  <pre className="text-xs text-gray-500 whitespace-pre-wrap bg-gray-50 rounded-lg p-3 max-h-40 overflow-y-auto border border-gray-100 font-mono">
                    {result.extracted_text}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// OCR Upload Modal
// ─────────────────────────────────────────────────────────────────────────────
function OcrUploadModal({ patientId, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [step, setStep] = useState("idle"); // idle | uploading | extracting | done
  const fileInputRef = useRef(null);

  const ACCEPTED = ["application/pdf", "image/jpeg", "image/png", "image/webp"];

  const handleFile = (f) => {
    if (!ACCEPTED.includes(f.type)) {
      alert("Only PDF, JPG, PNG, or WEBP files are supported.");
      return;
    }
    setFile(f);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file) return;
    if (!patientId) {
      alert(
        "Patient ID not found. Please refresh the page or log out and back in."
      );
      return;
    }

    setUploading(true);
    setStep("uploading");

    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", file); // backend expects field name "image"
      formData.append("patientId", patientId);

      setStep("extracting");

      const res = await fetch(`${API}/api/ocr/ocr`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "OCR extraction failed.");
      }

      setStep("done");
      onSuccess(data.data);
    } catch (err) {
      console.error("OCR error:", err);
      alert(err.message || "Something went wrong. Please try again.");
      setStep("idle");
    } finally {
      setUploading(false);
    }
  };

  const stepLabels = {
    uploading: "Uploading file…",
    extracting: "AI extracting medical data…",
    done: "Done!",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={!uploading ? onClose : undefined}
      />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Import Medical Report</h2>
              <p className="text-blue-100 text-xs">
                OCR + AI extraction — PDF or image
              </p>
            </div>
          </div>
          {!uploading && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-6 space-y-4">
          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => !uploading && fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all
              ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"}
              ${file ? "border-green-400 bg-green-50" : ""}
              ${uploading ? "pointer-events-none opacity-60" : ""}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,.webp"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />

            {file ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle2 className="w-10 h-10 text-green-500" />
                <p className="font-semibold text-gray-800 text-sm">{file.name}</p>
                <p className="text-xs text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB · {file.type}
                </p>
                {!uploading && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="text-xs text-red-500 hover:underline mt-1"
                  >
                    Remove
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3">
                <div className="p-4 bg-blue-100 rounded-full">
                  <FileUp className="w-8 h-8 text-blue-600" />
                </div>
                <div>
                  <p className="font-semibold text-gray-700">
                    Drop file here or click to browse
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports: PDF, JPG, PNG, WEBP
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Progress indicator */}
          {uploading && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-700">
                  {stepLabels[step]}
                </p>
                <div className="mt-2 h-1.5 bg-blue-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full transition-all duration-700"
                    style={{ width: step === "uploading" ? "40%" : step === "extracting" ? "80%" : "100%" }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Info note */}
          {!uploading && (
            <p className="text-xs text-gray-400 text-center">
              Your report will be scanned with OCR and analyzed by AI to extract
              diagnoses, medicines, medical terms, and doctor notes.
            </p>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 pt-1">
            {!uploading && (
              <button
                onClick={onClose}
                className="flex-1 py-2.5 border border-gray-300 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSubmit}
              disabled={!file || uploading}
              className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl text-sm hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing…
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Extract & Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function MedicalHistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [exporting, setExporting] = useState(false);

  // OCR state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [ocrResult, setOcrResult] = useState(null);
  const [patientId, setPatientId] = useState(null);

  // Fetch medical history + resolve patientId
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Not authenticated.");
          setLoading(false);
          return;
        }

        // ── Resolve patientId from dashboard ──────────────────────────────
        // We fetch the dashboard once to get the patient._id for OCR uploads
        const dashRes = await fetch(`${API}/api/patient/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (dashRes.ok) {
          const dashData = await dashRes.json();
          if (dashData?.patient?._id) {
            setPatientId(dashData.patient._id);
          }
        }

        // ── Fetch medical history ─────────────────────────────────────────
        const res = await fetch(`${API}/api/patient/my-medical-history`, {
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

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/patient/medical-history/export`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        alert(data.message || "Failed to export medical history.");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
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

  const handleOcrSuccess = (data) => {
    setShowUploadModal(false);
    setOcrResult(data);
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-blue-600">
          <Loader2 className="w-10 h-10 animate-spin" />
          <p className="text-lg font-medium">Loading medical history…</p>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-red-500">
          <AlertCircle className="w-10 h-10" />
          <p className="text-lg font-medium">{error}</p>
        </div>
      </div>
    );

  return (
    <>
      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      {showUploadModal && (
        <OcrUploadModal
          patientId={patientId}
          onClose={() => setShowUploadModal(false)}
          onSuccess={handleOcrSuccess}
        />
      )}

      {ocrResult && (
        <OcrResultModal
          result={ocrResult}
          onClose={() => setOcrResult(null)}
        />
      )}

      {/* ── Page ───────────────────────────────────────────────────────────── */}
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">

          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 rounded-lg">
                  <FileText className="w-8 h-8" />
                </div>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold">
                    Medical History
                  </h1>
                  <p className="text-blue-100 text-sm">
                    Your complete visit and diagnosis records
                  </p>
                </div>
              </div>

              <div className="flex flex-row flex-wrap gap-2 sm:gap-3 items-center">
                {/* ── Import Report (OCR) button ─────────────────────────── */}
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white/20 hover:bg-white/30 border border-white/40 text-white font-semibold rounded-xl shadow transition-all text-sm whitespace-nowrap"
                >
                  <Upload className="w-4 h-4 flex-shrink-0" />
                  Import Report
                </button>

                {/* ── Export Full PDF button ─────────────────────────────── */}
                <button
                  onClick={handleExportPDF}
                  disabled={exporting}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-700 font-semibold rounded-xl shadow hover:bg-blue-50 transition-colors disabled:opacity-60 text-sm whitespace-nowrap"
                >
                  {exporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" /> Exporting…
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4 flex-shrink-0" /> Export PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Empty state */}
          {history.length === 0 && (
            <div className="bg-white rounded-xl shadow border p-16 text-center">
              <Stethoscope className="w-20 h-20 text-gray-200 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Records Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Your doctor hasn&apos;t added any visit records yet.
              </p>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-colors text-sm"
              >
                <Upload className="w-4 h-4" />
                Import a Report
              </button>
            </div>
          )}

          {/* History cards */}
          <div className="space-y-4">
            {history.map((record) => (
              <div
                key={record._id}
                className="bg-white rounded-xl shadow border hover:shadow-md transition-all p-6"
              >
                {/* Visit header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4 pb-4 border-b">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Stethoscope className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-lg">
                        {record.diagnosis}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center gap-1 mt-0.5">
                        <User className="w-3.5 h-3.5" /> Dr. {record.doctorName}
                      </p>
                    </div>
                  </div>
                  <span className="flex items-center gap-1.5 text-sm font-medium text-gray-500 bg-gray-50 border rounded-full px-3 py-1 self-start md:self-auto">
                    <Calendar className="w-4 h-4" />
                    {new Date(record.visitDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
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
                        <span
                          key={i}
                          className="text-sm px-3 py-1 bg-blue-50 border border-blue-100 text-blue-700 rounded-full font-medium"
                        >
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
                        <span
                          key={i}
                          className="text-sm px-3 py-1 bg-yellow-50 border border-yellow-100 text-yellow-700 rounded-full font-medium"
                        >
                          {t.testName}: {t.result || "Pending"} (Normal:{" "}
                          {t.normalRange || "N/A"})
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {record.notes && (
                  <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-4 py-2 border-l-4 border-blue-300">
                    <span className="font-semibold text-gray-700">Notes: </span>
                    {record.notes}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}