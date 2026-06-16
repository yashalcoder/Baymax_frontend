"use client";

import { useRef } from "react";
import Swal from "sweetalert2";

export default function PrescriptionPreview({ data }) {
  const printRef = useRef(null);

  if (!data) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        Fill the form and click "Generate Prescription" to preview here.
      </div>
    );
  }

  const {
    patientName,
    patientId,
    symptoms,
    medicines,
    dosage,
    duration,
    allergies,
    warnings,
    createdAt,
    doctorName = "Dr. Physician",
    doctorDegree = "MBBS, FCPS — General Medicine",
    doctorReg = "PM-XXXX",
  } = data;

  // ✅ FIX: Split ALL fields by newline so each medicine gets its own dosage & duration
  const medicineRows = (() => {
    const names = (medicines || "").split("\n").filter(Boolean);
    const dosages = (dosage || "").split("\n");
    const durations = (duration || "").split("\n"); // ← was missing before
    return names.map((name, i) => ({
      name: name.trim(),
      dosage: (dosages[i] || "").trim(),
      duration: (durations[i] || "").trim(), // ← now per-medicine
    }));
  })();

  // ── Print ──
  function printPdf() {
    const content = printRef.current;
    if (!content) return;
    const win = window.open("", "_blank", "width=900,height=700");
    if (!win) {
      Swal.fire({ icon: "warning", title: "Popup blocked", text: "Allow popups for this site to print." });
      return;
    }
    win.document.write(`<!DOCTYPE html>
<html>
<head>
  <title>Prescription — ${patientName || "Patient"}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Segoe UI',Arial,sans-serif;color:#1a1a2e;background:#fff;padding:2rem}
  </style>
</head>
<body>${content.innerHTML}</body>
</html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 400);
  }

  // ── Download .txt ──
  function downloadTxt() {
    const lines = [
      "BayMax+ Healthcare — Prescription",
      `Date: ${new Date(createdAt).toLocaleString()}`,
      `Patient: ${patientName || "—"}`,
      `Known Allergies: ${allergies || "None"}`,
      "",
      "Diagnosis / Chief Complaint:",
      symptoms || "—",
      "",
      "Rx",
      ...medicineRows.map((m, i) => `${i + 1}. ${m.name} | Dosage: ${m.dosage || "—"} | Duration: ${m.duration || "—"}`),
      "",
      ...(warnings?.length ? ["General Advice:", ...warnings.map(w => `• ${w}`)] : []),
      "",
      "— Generated via BayMax+ (AI-powered demo)",
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Prescription_${patientName || "patient"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Send to Patient ──
  async function sendToPatient() {
    if (!patientId) {
      Swal.fire({ icon: "warning", title: "No Patient Selected", text: "Please select a patient before sending." });
      return;
    }
    const token = localStorage.getItem("token");
    const medicinesList = medicineRows.map((m) => ({
      name: m.name,
      dosage: m.dosage,
      duration: m.duration,
      frequency: "",
    }));
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctors/prescriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ patientId, medicines: medicinesList, notes: symptoms || "", labTests: [] }),
      });
      const json = await res.json();
      if (!res.ok || json.status !== "success") throw new Error(json.message || "Failed");
      Swal.fire({ icon: "success", title: "Prescription Sent!", text: `${patientName} will receive a notification.`, timer: 2500, showConfirmButton: false });
    } catch (err) {
      Swal.fire({ icon: "error", title: "Send Failed", text: err.message || "Could not send. Please try again." });
    }
  }

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
    : "—";

  return (
    <div className="rounded-lg border border-border bg-card p-5">
      {/* ── Action Buttons ── */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground">Prescription Preview</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={printPdf}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow hover:bg-blue-700"
          >
            🖨 Print / Save PDF
          </button>
          <button
            onClick={downloadTxt}
            className="rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium shadow hover:bg-accent/50"
          >
            ⬇ Download .txt
          </button>
          <button
            onClick={sendToPatient}
            className="rounded-md border border-green-500 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700 shadow hover:bg-green-100"
          >
            ✉ Send to Patient
          </button>
        </div>
      </div>

      {/* ── The actual prescription (this gets printed) ── */}
      <div
        ref={printRef}
        style={{
          fontFamily: "'Segoe UI', Arial, sans-serif",
          color: "#1a1a2e",
          background: "#fff",
          width: "100%",
          maxWidth: "800px",
          margin: "0 auto",
          padding: "1.5rem",
          border: "1px solid #e5e7eb",
          borderRadius: "8px",
          boxSizing: "border-box",
          overflowX: "hidden",
        }}
      >
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "0.75rem",
            marginBottom: "1.25rem",
          }}
        >
          {/* Left: Clinic brand */}
          <div>
            <div style={{ fontSize: "22px", fontWeight: "700", color: "#1a1a2e", letterSpacing: "-0.5px" }}>
              BayMax+{" "}
              <span style={{ color: "#3b82f6" }}>Healthcare</span>
            </div>
            <div style={{ fontSize: "10px", letterSpacing: "2px", color: "#6b7280", marginTop: "2px", textTransform: "uppercase" }}>
              AI-Powered Medical Solutions
            </div>
          </div>

          {/* Right: Doctor info */}
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "15px", fontWeight: "700", color: "#1a1a2e" }}>{doctorName}</div>
            <div style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>{doctorDegree}</div>
            <div style={{ fontSize: "11px", color: "#6b7280" }}>Reg No: {doctorReg}</div>
            <div style={{ fontSize: "11px", color: "#6b7280" }}>{formattedDate}</div>
          </div>
        </div>

        {/* ── Blue divider ── */}
        <div style={{ height: "3px", background: "linear-gradient(90deg, #1e3a8a 0%, #3b82f6 100%)", borderRadius: "2px", marginBottom: "1rem" }} />

        {/* ── Patient info bar ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
            gap: "0.75rem",
            background: "#f0f4ff",
            border: "1px solid #c7d2fe",
            borderRadius: "6px",
            padding: "0.75rem 1rem",
            marginBottom: "0.875rem",
          }}
        >
          <div>
            <div style={{ fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#6b7280", marginBottom: "4px" }}>Patient Name</div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#1a1a2e" }}>{patientName || "—"}</div>
          </div>
          <div>
            <div style={{ fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#6b7280", marginBottom: "4px" }}>Known Allergies</div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: allergies ? "#dc2626" : "#374151" }}>{allergies || "None"}</div>
          </div>
          <div>
            <div style={{ fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#6b7280", marginBottom: "4px" }}>Date</div>
            <div style={{ fontSize: "13px", fontWeight: "600", color: "#1a1a2e" }}>{formattedDate}</div>
          </div>
        </div>

        {/* ── Diagnosis ── */}
        <div
          style={{
            border: "1.5px dashed #fbbf24",
            borderRadius: "6px",
            background: "#fffbeb",
            padding: "0.75rem 1rem",
            marginBottom: "1.25rem",
          }}
        >
          <div style={{ fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#b45309", marginBottom: "6px" }}>
            Diagnosis / Chief Complaint
          </div>
          <div style={{ fontSize: "13px", color: "#1a1a2e", whiteSpace: "pre-wrap", minHeight: "20px" }}>
            {symptoms || "—"}
          </div>
        </div>

        {/* ── Rx Symbol ── */}
        <div style={{ fontSize: "28px", fontWeight: "700", color: "#1e3a8a", marginBottom: "0.5rem", fontFamily: "Georgia, serif" }}>
          ℞
        </div>

        {/* ✅ FIX: Responsive table wrapper — prevents horizontal overflow */}
        <div style={{ width: "100%", overflowX: "auto", marginBottom: "1.25rem" }}>
          <table style={{ width: "100%", minWidth: "520px", borderCollapse: "collapse", fontSize: "12px" }}>
            <thead>
              <tr style={{ background: "#1e3a8a", color: "#fff" }}>
                {["#", "Medicine", "Dosage", "Duration", "Type", "Precautions"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "8px 10px",
                      textAlign: "left",
                      fontSize: "10px",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      fontWeight: "600",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {medicineRows.length > 0 ? (
                medicineRows.map((med, i) => (
                  <tr
                    key={i}
                    style={{
                      background: i % 2 === 0 ? "#fff" : "#f8faff",
                      borderBottom: "1px solid #e5e7eb",
                      verticalAlign: "top",
                    }}
                  >
                    {/* # */}
                    <td style={{ padding: "9px 10px", color: "#6b7280", whiteSpace: "nowrap", width: "28px" }}>
                      {i + 1}
                    </td>

                    {/* ✅ Medicine — bold, wraps naturally */}
                    <td style={{ padding: "9px 10px", fontWeight: "600", color: "#1a1a2e", minWidth: "120px" }}>
                      {med.name}
                    </td>

                    {/* ✅ Dosage — per-medicine, wraps in cell */}
                    <td style={{ padding: "9px 10px", color: "#1a1a2e", minWidth: "130px", lineHeight: "1.4" }}>
                      {med.dosage || "—"}
                    </td>

                    {/* ✅ Duration — per-medicine, no longer shared */}
                    <td style={{ padding: "9px 10px", color: "#1a1a2e", minWidth: "100px", lineHeight: "1.4" }}>
                      {med.duration || "—"}
                    </td>

                    {/* Type */}
                    <td style={{ padding: "9px 10px", color: "#6b7280", fontStyle: "italic", whiteSpace: "nowrap" }}>
                      —
                    </td>

                    {/* Precautions */}
                    <td style={{ padding: "9px 10px", color: "#374151" }}>—</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ padding: "16px 10px", color: "#9ca3af", textAlign: "center" }}>
                    No medicines added
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* ── General Advice / Warnings ── */}
        {warnings && warnings.length > 0 && (
          <div
            style={{
              background: "#f9fafb",
              border: "1px solid #e5e7eb",
              borderRadius: "6px",
              padding: "0.875rem 1rem",
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                fontSize: "9px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "#6b7280",
                marginBottom: "10px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              General Advice
              <span style={{ flex: 1, height: "1px", background: "#e5e7eb", display: "inline-block" }} />
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {warnings.map((w, i) => (
                <li key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px", fontSize: "13px", color: "#374151" }}>
                  <span style={{ color: "#3b82f6", fontWeight: "700", flexShrink: 0 }}>✦</span>
                  {w}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* ── Footer ── */}
        <div
          style={{
            marginTop: "1.5rem",
            paddingTop: "0.75rem",
            borderTop: "1px solid #e5e7eb",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: "1rem",
          }}
        >
          <p style={{ fontSize: "10px", color: "#9ca3af", maxWidth: "300px" }}>
            This is a generated preview. Clinician must review for accuracy before finalizing.
          </p>
          <div style={{ textAlign: "right" }}>
            <div style={{ height: "40px", borderBottom: "1.5px solid #1a1a2e", width: "140px", marginBottom: "4px" }} />
            <div style={{ fontSize: "10px", color: "#6b7280" }}>Doctor's Signature</div>
          </div>
        </div>
      </div>
    </div>
  );
}