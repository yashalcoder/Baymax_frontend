"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Swal from "sweetalert2";
import ProtectedRoute from "@/components/protectedRoutes";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Search, User, Phone, Mail, Heart, Stethoscope, X, AlertCircle } from "lucide-react";

// ─── Assign Doctor Modal ──────────────────────────────────────────────────────

function AssignDoctorModal({ patient, doctors, token, onClose, onAssigned }) {
  const [doctorId,   setDoctorId]   = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAssign = async () => {
    if (!doctorId) {
      Swal.fire("Select Doctor", "Please choose a doctor first.", "warning");
      return;
    }
    setSubmitting(true);
    try {
      const res  = await fetch(
        `http://localhost:5000/api/assistants/${patient._id}/assign-doctor`,
        {
          method:  "PUT",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body:    JSON.stringify({ doctorId }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to assign doctor");

      Swal.fire({ icon: "success", title: "Doctor Assigned!", timer: 1400, showConfirmButton: false });
      onAssigned();
      onClose();
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm " +
    "focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white outline-none transition";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Assign Doctor</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Patient: <span className="font-medium">{patient?.userId?.name}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition text-gray-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <Stethoscope className="w-3.5 h-3.5 text-gray-400" /> Select Doctor
          </label>
          <select
            className={inputCls}
            value={doctorId}
            onChange={(e) => setDoctorId(e.target.value)}
          >
            <option value="">— Choose a doctor —</option>
            {doctors.map((d) => (
              <option key={d._id} value={d._id}>
                {d.displayName}{d.specialization ? ` (${d.specialization})` : ""}
              </option>
            ))}
          </select>
          {doctors.length === 0 && (
            <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              No doctors found in the system.
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleAssign}
            disabled={submitting || !doctorId}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition text-sm font-medium disabled:opacity-60"
          >
            {submitting ? "Assigning…" : "Assign Doctor"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

export default function SearchPatientsPage() {
  const [token,   setToken]   = useState(null);
  const [query,   setQuery]   = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [searched,setSearched]= useState(false);
  const [doctors, setDoctors] = useState([]);

  // Modal state
  const [assignTarget, setAssignTarget] = useState(null); // patient object or null
const fetchInitialPatients = async (tkn = token) => {
  if (!tkn) return;

  try {
    setLoading(true);
    const res = await fetch(
      `http://localhost:5000/api/patient/getPatients?limit=10`,
      {
        headers: { Authorization: `Bearer ${tkn}` },
      }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data?.message);

    setResults(Array.isArray(data?.patients) ? data.patients : []);
  } catch (err) {
    console.error("Initial fetch error:", err);
  } finally {
    setLoading(false);
  }
};
useEffect(() => {
  const t = localStorage.getItem("token");
  setToken(t);
  if (!t) return;

  // ✅ ADD THIS LINE
  fetchInitialPatients(t);

  // existing doctor fetch (keep same)
  fetch("http://localhost:5000/api/assistants/doctors", {
    headers: { Authorization: `Bearer ${t}` },
  })
    .then((r) => r.json())
    .then((d) => setDoctors(Array.isArray(d?.data) ? d.data : []))
    .catch(() => setDoctors([]));
}, []);
  useEffect(() => {
    const t = localStorage.getItem("token");
    setToken(t);
    if (!t) return;

    // Pre-load doctors for the assign modal
    fetch("http://localhost:5000/api/assistants/doctors", {
      headers: { Authorization: `Bearer ${t}` },
    })
      .then((r) => r.json())
      .then((d) => setDoctors(Array.isArray(d?.data) ? d.data : []))
      .catch(() => setDoctors([]));
  }, []);

  const doSearch = async (tkn = token) => {
    const q = query.trim();
    if (!q) {
      Swal.fire("Empty Search", "Type a name, email, or phone number.", "warning");
      return;
    }
    if (!tkn) {
      Swal.fire("Auth Error", "Session expired. Please log in again.", "error");
      return;
    }

    try {
      setLoading(true);
      setSearched(true);
      const res  = await fetch(
        `http://localhost:5000/api/assistants/search?query=${encodeURIComponent(q)}`,
        { headers: { Authorization: `Bearer ${tkn}` } }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Search failed");
      setResults(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      Swal.fire("Search Failed", err.message || "Try again.", "error");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  // After a doctor is assigned, refresh results so the badge updates
  const handleAssigned = () => doSearch();

  return (
    <ProtectedRoute allowedRoles={["assistant"]}>

      {/* Assign Doctor Modal */}
      {assignTarget && (
        <AssignDoctorModal
          patient={assignTarget}
          doctors={doctors}
          token={token}
          onClose={() => setAssignTarget(null)}
          onAssigned={handleAssigned}
        />
      )}

      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Header */}
          <div className="bg-hero-gradient text-white rounded-2xl p-6 md:p-8 shadow-lg flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl"><Search className="w-8 h-8" /></div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Search Patients</h1>
              <p className="text-white/80">Find any registered patient by name, email, or contact</p>
            </div>
          </div>

          <Card className="shadow-lg border">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" /> Patient Lookup
              </CardTitle>
              <CardDescription>
                Search by name, email address, or phone number.
                You can also assign a doctor or record vitals from the results.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-5">

              {/* Search bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus-within:ring-2 focus-within:ring-blue-500 transition">
                  <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && doSearch()}
                    placeholder="e.g. Ahmed / ahmed@email.com / 03XX-XXXXXXX"
                    className="flex-1 outline-none text-sm bg-transparent"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => doSearch()}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition disabled:opacity-60 text-sm"
                >
                  {loading ? "Searching…" : "Search"}
                </button>
              </div>

              {/* States */}
              {loading && (
                <div className="py-10 text-center text-sm text-gray-400">Searching…</div>
              )}

              {!loading && searched && results.length === 0 && (
                <div className="py-10 text-center">
                  <Search className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">No patients found for &quot;{query}&quot;</p>
                </div>
              )}

              {!loading && !searched && results.length===0 && (
                <div className="py-10 text-center">
                  <Search className="w-10 h-10 text-gray-200 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Enter a search query above to find patients</p>
                </div>
              )}

              {/* Results */}
              {!loading && results.length > 0 && (
                <div className="space-y-3">
                  <p className="text-xs text-gray-500">
                    {results.length} result{results.length !== 1 ? "s" : ""} found
                  </p>
                  {results.map((p) => {
                    // Resolve current doctor name from populated assignedDoctor
                    const doc = p.assignedDoctor;
                    const docName = doc
                      ? ((doc.firstName || "") + " " + (doc.lastName || "")).trim() ||
                        "Assigned"
                      : null;

                    return (
                      <div
                        key={p._id}
                        className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-white border rounded-2xl shadow-sm hover:shadow-md transition"
                      >
                        {/* Avatar */}
                        <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900">
                            {p?.userId?.name || "Patient"}
                          </p>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Mail className="w-3 h-3" />{p?.userId?.email || "—"}
                            </span>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <Phone className="w-3 h-3" />{p?.userId?.contact || "—"}
                            </span>
                          </div>

                          {/* Doctor badge */}
                          <div className="mt-1.5">
                            {docName ? (
                              <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2 py-0.5">
                                <Stethoscope className="w-3 h-3" /> Dr. {docName}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-700 border border-amber-100 rounded-full px-2 py-0.5">
                                <AlertCircle className="w-3 h-3" /> No doctor assigned
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-wrap gap-2 flex-shrink-0">
                          {/* Assign / Reassign Doctor */}
                          <button
                            type="button"
                            onClick={() => setAssignTarget(p)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition"
                          >
                            <Stethoscope className="w-3.5 h-3.5" />
                            {docName ? "Reassign Doctor" : "Assign Doctor"}
                          </button>

                          {/* Take Vitals */}
                          <Link
                            href={`/assistant/vitals?patientId=${p._id}`}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100 transition"
                          >
                            <Heart className="w-3.5 h-3.5" /> Take Vitals
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}