"use client";

import Swal from "sweetalert2";

export default function PrescriptionPreview({ data }) {
  if (!data) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
        Fill the form and click “Generate Prescription” to preview here.
      </div>
    );
  }

  const {
    patientName,
    symptoms,
    medicines,
    dosage,
    duration,
    allergies,
    warnings,
    createdAt,
  } = data;

  const asText = () => {
    const lines = [
      "BayMax+ Prescription",
      `Date: ${new Date(createdAt).toLocaleString()}`,
      `Patient: ${patientName}`,
      "",
      "Symptoms:",
      symptoms || "-",
      "",
      "Medicines:",
      medicines || "-",
      "",
      "Dosage:",
      dosage || "-",
      "",
      `Duration: ${duration || "-"}`,
      `Known Allergies: ${allergies || "-"}`,
      "",
      ...(warnings && warnings.length ? ["Warnings:", ...warnings] : []),
      "",
      "— Generated via BayMax+ (demo export)",
    ];
    return lines.join("\n");
  };

  function downloadTxt() {
    const blob = new Blob([asText()], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `Prescription_${patientName || "patient"}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

function printPdf() {
  const printWindow = window.open("", "_blank");
  printWindow.document.write(`
    <html>
      <head>
        <title>Prescription - ${patientName || "Patient"}</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=Source+Sans+3:wght@300;400;500;600&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          
          body {
            font-family: 'Source Sans 3', sans-serif;
            background: #fff;
            color: #1a1a2e;
            padding: 0;
          }

          .page {
            width: 210mm;
            min-height: 297mm;
            margin: 0 auto;
            padding: 12mm 14mm;
            position: relative;
          }

          /* ── HEADER ── */
          .header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            padding-bottom: 8px;
            border-bottom: 3px double #1a3a5c;
            margin-bottom: 10px;
          }
          .clinic-name {
            font-family: 'Playfair Display', serif;
            font-size: 22px;
            color: #1a3a5c;
            letter-spacing: 0.5px;
          }
          .clinic-tagline {
            font-size: 10px;
            color: #5a7a9a;
            margin-top: 2px;
            letter-spacing: 1.5px;
            text-transform: uppercase;
          }
          .doctor-info { text-align: right; }
          .doctor-name {
            font-family: 'Playfair Display', serif;
            font-size: 15px;
            color: #1a3a5c;
          }
          .doctor-detail {
            font-size: 10px;
            color: #666;
            margin-top: 2px;
          }

          /* ── PATIENT STRIP ── */
          .patient-strip {
            background: #f0f5fb;
            border-left: 4px solid #1a3a5c;
            padding: 8px 12px;
            display: grid;
            grid-template-columns: 2fr 1fr 1fr;
            gap: 12px;
            margin-bottom: 14px;
            border-radius: 0 4px 4px 0;
          }
          .strip-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #5a7a9a;
            margin-bottom: 2px;
          }
          .strip-value {
            font-size: 13px;
            font-weight: 600;
            color: #1a1a2e;
          }

          /* ── Rx SYMBOL ── */
          .rx-section { margin-bottom: 12px; }
          .rx-symbol {
            font-family: 'Playfair Display', serif;
            font-size: 28px;
            color: #1a3a5c;
            line-height: 1;
            margin-bottom: 4px;
          }
          .diagnosis-box {
            background: #fffbf0;
            border: 1px dashed #c9a84c;
            border-radius: 4px;
            padding: 7px 12px;
            font-size: 12px;
            color: #5a4a00;
            margin-bottom: 12px;
          }
          .diagnosis-label {
            font-size: 9px;
            text-transform: uppercase;
            letter-spacing: 1px;
            color: #c9a84c;
            margin-bottom: 2px;
          }

          /* ── MEDICINES TABLE ── */
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 14px;
            font-size: 12px;
          }
          thead tr {
            background: #1a3a5c;
            color: white;
          }
          thead th {
            padding: 7px 10px;
            text-align: left;
            font-weight: 500;
            font-size: 10px;
            letter-spacing: 0.8px;
            text-transform: uppercase;
          }
          tbody tr { border-bottom: 1px solid #e8edf5; }
          tbody tr:nth-child(even) { background: #f7fafd; }
          tbody td { padding: 8px 10px; vertical-align: top; }
          .med-name { font-weight: 600; color: #1a3a5c; }
          .med-type { font-size: 10px; color: #888; }

          /* ── ADVICE ── */
          .advice-section {
            border: 1px solid #d0e4f5;
            border-radius: 6px;
            padding: 10px 14px;
            margin-bottom: 14px;
            background: #f7fbff;
          }
          .section-title {
            font-size: 10px;
            text-transform: uppercase;
            letter-spacing: 1.2px;
            color: #1a3a5c;
            font-weight: 600;
            margin-bottom: 6px;
            display: flex;
            align-items: center;
            gap: 6px;
          }
          .section-title::after {
            content: '';
            flex: 1;
            height: 1px;
            background: #d0e4f5;
          }
          .advice-list { list-style: none; }
          .advice-list li {
            font-size: 11px;
            color: #444;
            padding: 3px 0;
            padding-left: 14px;
            position: relative;
          }
          .advice-list li::before {
            content: '✦';
            position: absolute;
            left: 0;
            color: #1a3a5c;
            font-size: 8px;
            top: 4px;
          }

          /* ── ALLERGIES WARNING ── */
          .allergy-box {
            background: #fff5f5;
            border: 1px solid #fca5a5;
            border-radius: 4px;
            padding: 6px 12px;
            font-size: 11px;
            color: #991b1b;
            margin-bottom: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          /* ── FOOTER ── */
          .footer {
            position: absolute;
            bottom: 12mm;
            left: 14mm;
            right: 14mm;
            border-top: 1px solid #d0d9e8;
            padding-top: 8px;
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
          }
          .signature-line {
            width: 140px;
            border-bottom: 1px solid #1a3a5c;
            margin-bottom: 4px;
          }
          .signature-label { font-size: 9px; color: #888; text-align: center; }
          .disclaimer { font-size: 9px; color: #aaa; max-width: 300px; line-height: 1.4; }
          .stamp {
            width: 70px; height: 70px;
            border: 2px solid #1a3a5c;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 9px;
            color: #1a3a5c;
            text-align: center;
            padding: 8px;
            font-family: 'Playfair Display', serif;
          }

          @media print {
            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
            .page { padding: 10mm 12mm; }
          }
        </style>
      </head>
      <body>
        <div class="page">

          <!-- HEADER -->
          <div class="header">
            <div>
              <div class="clinic-name">BayMax+ Healthcare</div>
              <div class="clinic-tagline">AI-Powered Medical Solutions</div>
            </div>
            <div class="doctor-info">
              <div class="doctor-name">Dr. Physician</div>
              <div class="doctor-detail">MBBS, FCPS — General Medicine</div>
              <div class="doctor-detail">Reg No: PM-XXXX</div>
              <div class="doctor-detail">${new Date(createdAt).toLocaleDateString('en-PK', { day:'2-digit', month:'long', year:'numeric' })}</div>
            </div>
          </div>

          <!-- PATIENT STRIP -->
          <div class="patient-strip">
            <div>
              <div class="strip-label">Patient Name</div>
              <div class="strip-value">${patientName || "—"}</div>
            </div>
            <div>
              <div class="strip-label">Known Allergies</div>
              <div class="strip-value" style="color:#991b1b">${allergies || "None"}</div>
            </div>
            <div>
              <div class="strip-label">Date</div>
              <div class="strip-value">${new Date(createdAt).toLocaleDateString()}</div>
            </div>
          </div>

          <!-- DIAGNOSIS -->
          <div class="diagnosis-box">
            <div class="diagnosis-label">Diagnosis / Chief Complaint</div>
            ${symptoms || "—"}
          </div>

          <!-- Rx -->
          <div class="rx-section">
            <div class="rx-symbol">℞</div>
          </div>

          <!-- MEDICINES TABLE -->
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Medicine</th>
                <th>Type</th>
                <th>Dosage</th>
                <th>Duration</th>
                <th>Precautions</th>
              </tr>
            </thead>
            <tbody>
              ${Array.isArray(data?.prescription)
                ? data.prescription.map((m, i) => `
                    <tr>
                      <td>${i + 1}</td>
                      <td><span class="med-name">${m.medicine || "—"}</span></td>
                      <td><span class="med-type">${m.type || "—"}</span></td>
                      <td>${m.dosage || "—"}</td>
                      <td>${m.duration || "—"}</td>
                      <td style="font-size:10px;color:#666">${m.precautions || "—"}</td>
                    </tr>`).join("")
                : `<tr><td colspan="6" style="text-align:center;color:#888;padding:12px">
                    ${medicines || "No medicines listed"}
                  </td></tr>`
              }
            </tbody>
          </table>

          <!-- ADVICE -->
          ${Array.isArray(data?.advice) && data.advice.length ? `
            <div class="advice-section">
              <div class="section-title">General Advice</div>
              <ul class="advice-list">
                ${data.advice.map(a => `<li>${a}</li>`).join("")}
              </ul>
            </div>` : ""}

          <!-- FOOTER -->
          <div class="footer">
            <div>
              <div class="signature-line"></div>
              <div class="signature-label">Doctor's Signature</div>
            </div>
            <div class="disclaimer">
              ${data?.disclaimer || "This prescription is generated for informational purposes. Please consult your physician before use."}
            </div>
            <div class="stamp">BayMax+<br/>Verified</div>
          </div>

        </div>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 800);
}
  function sendToPatient() {
    Swal.fire({
      icon: "info",
      title: "Send to Patient",
      text: "This is a demo. Integrate your messaging/email system to send the prescription to the patient.",
    });
    //
    // alert(
    //   "This is a demo. Integrate your messaging/email system to send the prescription to the patient."
    // );
  }

  return (
    <div id="prescription-preview" className="rounded-lg border border-border bg-card p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            Prescription Preview
          </h3>
          <p className="text-xs text-muted-foreground">
            Generated on {new Date(createdAt).toLocaleString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={printPdf}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-semibold  shadow-lg text-primary-foreground hover:bg-primary/90 focus-visible:ring-2 focus-visible:ring-primary"
          >
            Print / Save PDF
          </button>
          <button
            onClick={downloadTxt}
            className="rounded-md border border-border bg-background px-3 shadow-lg py-1.5 text-xs font-medium hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-primary"
          >
            Download .txt
          </button>
          <button
            onClick={sendToPatient}
            className="rounded-md border border-border bg-background shadow-lg  px-3 py-1.5 text-xs font-medium hover:bg-accent/50 focus-visible:ring-2 focus-visible:ring-primary"
          >
            Send to Patient
          </button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-md border border-border bg-background p-4">
          <p className="text-sm text-muted-foreground">Patient</p>
          <p className="text-lg font-semibold">{patientName || "—"}</p>
          <div className="mt-3 grid gap-2 text-sm">
            <div>
              <p className="font-medium">Symptoms</p>
              <p className="text-muted-foreground whitespace-pre-wrap">
                {symptoms || "—"}
              </p>
            </div>
            <div>
              <p className="font-medium">Duration</p>
              <p className="text-muted-foreground">{duration || "—"}</p>
            </div>
            <div>
              <p className="font-medium">Known Allergies</p>
              <p className="text-muted-foreground">{allergies || "—"}</p>
            </div>
          </div>
        </div>

        <div className="rounded-md border border-border bg-background p-4">
          <p className="text-sm text-muted-foreground">Medication Plan</p>
          <div className="mt-2 grid gap-2">
            <div>
              <p className="font-medium">Medicines</p>
              <pre className="text-sm whitespace-pre-wrap">
                {medicines || "—"}
              </pre>
            </div>
            <div>
              <p className="font-medium">Dosage</p>
              <pre className="text-sm whitespace-pre-wrap">{dosage || "—"}</pre>
            </div>
          </div>
        </div>
      </div>

      {warnings && warnings.length > 0 && (
        <div className="mt-4 rounded-md border border-border bg-background p-4">
          <p className="text-sm font-medium text-foreground">Warnings</p>
          <ul className="mt-1 list-disc pl-5 text-sm">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <p className="mt-4 text-xs text-muted-foreground">
        Note: This is a generated preview. Clinician must review for accuracy
        before finalizing.
      </p>
    </div>
  );
}
