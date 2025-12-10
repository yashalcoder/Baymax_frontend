"use client";
import React, { useEffect, useState } from "react";

/*
PatientDashboard.jsx
- A self-contained React component (default export) that renders a patient dashboard
  showing patient's name, assigned doctor, current medications / prescriptions,
  and daily insights (summary metrics).

Integration notes:
- This file intentionally uses semantic classNames that mirror a "doctor" folder
  style (e.g. "doctor-header", "card", "doctor-list"). If your doctor folder
  CSS lives elsewhere, import it by adjusting the path below (example provided).

- The component attempts to fetch data from an endpoint:
    GET /api/patients/:patientId/dashboard
  expected response shape (example):
  {
    id: "p123",
    name: "Aisha Khan",
    age: 29,
    gender: "F",
    doctor: { id: "d456", name: "Dr. Ali" },
    medications: [
      { id: "m1", name: "Amoxicillin", dose: "500 mg", schedule: "2x/day", notes: "After food" },
    ],
    prescriptions: [ ... ],
    dailyInsights: { steps: 4321, sleepHours: 7.2, adherenceRate: 0.92 }
  }

- If the API is not available during development, the component falls back to
  a mocked dataset so you can preview the UI immediately.

- Styling: Adjust the import below to reuse your existing doctor CSS. If your
  project uses Tailwind, remove the CSS import and rely on Tailwind utility classes.
*/

// Example: import CSS from the doctor folder so visual style matches exactly.
// Update path if needed. If you don't want this, remove the line below.
// import "../doctor/doctor.css";

// Small reusable subcomponents are declared in the same file for convenience.

function Loading() {
  return (
    <div className="card loading" role="status">
      <div>Loading patient dashboard...</div>
    </div>
  );
}

function ErrorBox({ message }) {
  return (
    <div className="card error" role="alert">
      <strong>Error:</strong> {message}
    </div>
  );
}

function PatientHeader({ patient }) {
  return (
    <header className="doctor-header patient-header">
      <div className="patient-name">
        <h1>{patient.name}</h1>
        <div className="meta">ID: {patient.id} • {patient.gender} • {patient.age} yrs</div>
      </div>

      <div className="doctor-info">
        <div className="label">Assigned Doctor</div>
        <div className="doctor-card">
          <div className="doctor-name">{patient.doctor?.name ?? "-"}</div>
          <div className="doctor-meta">ID: {patient.doctor?.id ?? "-"}</div>
        </div>
      </div>
    </header>
  );
}

function MedicationList({ medications }) {
  if (!medications || medications.length === 0) return <div className="card">No current medications</div>;

  return (
    <div className="card meds-card">
      <h3>Current Medications</h3>
      <ul className="doctor-list meds-list">
        {medications.map((m) => (
          <li key={m.id} className="med-item">
            <div className="med-main">
              <div className="med-name">{m.name}</div>
              <div className="med-dose">{m.dose} · {m.schedule}</div>
            </div>
            {m.notes && <div className="med-notes">Notes: {m.notes}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}

function DailyInsights({ insights }) {
  const adherencePercent = Math.round((insights?.adherenceRate ?? 0) * 100);

  return (
    <div className="card insights-card">
      <h3>Daily Insights</h3>
      <div className="insights-grid">
        <div className="insight">
          <div className="insight-label">Steps</div>
          <div className="insight-value">{insights?.steps ?? "-"}</div>
        </div>
        <div className="insight">
          <div className="insight-label">Sleep (hrs)</div>
          <div className="insight-value">{insights?.sleepHours ?? "-"}</div>
        </div>
        <div className="insight">
          <div className="insight-label">Adherence</div>
          <div className="insight-value">{adherencePercent}%</div>
        </div>
      </div>
    </div>
  );
}

// The main dashboard component
export default function PatientDashboard({ patientId }) {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Derive patientId from logged-in user if not provided
  useEffect(() => {
    if (!patientId) {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.id) {
            setPatient((prev) => prev || { id: parsed.id, name: parsed.name || "Patient" });
          }
        }
      } catch {
        /* ignore */
      }
    }
  }, [patientId]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        // Attempt to fetch from real backend endpoint
        const res = await fetch(`/api/patients/${patientId}/dashboard`);
        if (!res.ok) {
          // If API returns 404/500/etc, fallback to mock data to keep UI working
          throw new Error(`Server returned ${res.status}`);
        }

        const data = await res.json();
        if (!cancelled) setPatient(data);
      } catch (err) {
        // Fallback mock data - remove this in production
        console.warn("Warning: using mock patient data because fetch failed:", err.message);

        const mock = {
          id: patientId ?? "p-0001",
          name: "Aisha Khan",
          age: 29,
          gender: "F",
          doctor: { id: "d-100", name: "Dr. Ali Raza" },
          medications: [
            { id: "m-1", name: "Metformin", dose: "500 mg", schedule: "2x/day", notes: "With meals" },
            { id: "m-2", name: "Atorvastatin", dose: "10 mg", schedule: "1x/night", notes: "Take before bed" },
          ],
          prescriptions: [
            { id: "p-1", title: "Blood test - CBC", date: "2025-11-20" },
          ],
          dailyInsights: { steps: 4321, sleepHours: 7.2, adherenceRate: 0.92 },
        };

        if (!cancelled) setPatient(mock);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();

    return () => {
      cancelled = true;
    };
  }, [patientId]);

  if (loading) return <Loading />;
  if (error) return <ErrorBox message={error} />;
  if (!patient) return <ErrorBox message={"Patient not found"} />;

  return (
    <main className="patient-dashboard container">
      <PatientHeader patient={patient} />

      <section className="dashboard-grid">
        <div className="column column-left">
          <MedicationList medications={patient.medications} />

          <div className="card prescriptions-card">
            <h3>Prescriptions / Orders</h3>
            {patient.prescriptions && patient.prescriptions.length > 0 ? (
              <ul className="doctor-list prescriptions-list">
                {patient.prescriptions.map((p) => (
                  <li key={p.id} className="prescription-item">
                    <div className="pres-title">{p.title}</div>
                    <div className="pres-date">{p.date}</div>
                  </li>
                ))}
              </ul>
            ) : (
              <div>No recent prescriptions</div>
            )}
          </div>
        </div>

        <div className="column column-right">
          <DailyInsights insights={patient.dailyInsights} />

          <div className="card quick-actions">
            <h3>Quick Actions</h3>
            <div className="actions">
              <button className="btn" onClick={() => alert("Message doctor (stub)")}>Message Doctor</button>
              <button className="btn" onClick={() => alert("View full record (stub)")}>View Full Record</button>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        /* Basic layout only; override these styles with your existing doctor styles
           by importing the doctor's CSS file as shown earlier. These are minimal
           helpers to make the component readable if your project doesn't provide
           doctor styles yet. */
        .container { padding: 20px; max-width: 1100px; margin: 0 auto; }
        .doctor-header { display:flex; justify-content:space-between; align-items:center; gap:20px; margin-bottom:16px; }
        .patient-name h1 { margin:0; font-size:1.5rem; }
        .meta { color: #666; font-size:0.9rem; }
        .doctor-card { background:#f7f7f9; padding:8px 12px; border-radius:8px; }
        .card { background: #fff; border: 1px solid #e6e6e9; padding: 12px; border-radius: 8px; margin-bottom: 12px; }
        .dashboard-grid { display: grid; grid-template-columns: 1fr 360px; gap: 16px; }
        .meds-list { list-style:none; padding:0; margin:0; }
        .med-item { padding:8px 0; border-bottom:1px dashed #eee; }
        .med-main { display:flex; justify-content:space-between; }
        .insights-grid { display:flex; gap:12px; }
        .insight { flex:1; text-align:center; padding:8px; }
        .insight-label { color:#666; font-size:0.9rem; }
        .insight-value { font-size:1.25rem; font-weight:700; }
        .btn { padding:8px 12px; border-radius:6px; border:1px solid #ccc; background:#fff; cursor:pointer; margin-right:8px; }

        @media (max-width: 900px) {
          .dashboard-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}
