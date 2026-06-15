"use client";
import { useEffect } from "react";
import { useMemo, useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import ProtectedRoute from "@/components/protectedRoutes";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart, Search, Activity, Thermometer, Droplets, Clock, User, ChevronDown, ChevronUp, Loader2,
} from "lucide-react";

// ─── Vitals form (FR-2.2) ───────────────────────────────────────────────────
function VitalsForm({ patientId, patientName, onRecorded }) {
  const token = useMemo(() => {
    if (typeof window !== "undefined") return localStorage.getItem("token");
    return null;
  }, []);

  const [form, setForm] = useState({ bloodPressure: "", temperature: "", heartRate: "", notes: "" });
  const [saving, setSaving] = useState(false);

  const set = (f) => (e) => setForm((p) => ({ ...p, [f]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bloodPressure && !form.temperature && !form.heartRate) {
      Swal.fire("Missing Vitals", "Enter at least one vital sign.", "warning");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch(`http://localhost:5000/api/assistants/${patientId}/vitals`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to save");

      Swal.fire({ icon: "success", title: "Vitals Recorded!", timer: 1400, showConfirmButton: false });
      setForm({ bloodPressure: "", temperature: "", heartRate: "", notes: "" });
      onRecorded(data.data?.vitals || []);
    } catch (err) {
      Swal.fire("Error", err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  // Synchronized form element styling
  const inputCls = "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:ring-4 focus:ring-rose-50/60 focus:border-rose-500 bg-white outline-none transition-all duration-200";

  return (
    <Card className="shadow-lg border">
      <CardHeader className="border-b bg-gradient-to-r from-rose-50/70 to-pink-50/30">
        <CardTitle className="flex items-center gap-2 text-base text-gray-900">
          <Heart className="w-4 h-4 text-rose-600" /> Record Vitals for{" "}
          <span className="text-rose-700 font-bold">{patientName}</span>
        </CardTitle>
        <CardDescription className="text-gray-500">
          Enter BP, temperature, or pulse. At least one is required.
          Older entries cannot be edited.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <Droplets className="w-3.5 h-3.5 text-blue-500" /> Blood Pressure
              </label>
              <input
                className={inputCls}
                placeholder="e.g. 120/80 mmHg"
                value={form.bloodPressure}
                onChange={set("bloodPressure")}
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <Thermometer className="w-3.5 h-3.5 text-amber-500" /> Temperature
              </label>
              <input
                className={inputCls}
                placeholder="e.g. 98.6°F"
                value={form.temperature}
                onChange={set("temperature")}
              />
            </div>
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
                <Heart className="w-3.5 h-3.5 text-rose-500" /> Pulse / Heart Rate
              </label>
              <input
                className={inputCls}
                placeholder="e.g. 72 bpm"
                value={form.heartRate}
                onChange={set("heartRate")}
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
            <textarea
              className={`${inputCls} focus:ring-rose-50/60 focus:border-rose-500 resize-none h-20`}
              placeholder="Any additional observations…"
              value={form.notes}
              onChange={set("notes")}
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              className="px-6 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm font-medium transition"
            >
              {saving ? "Saving…" : "Save Vitals"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// ─── Vitals history (FR-2.3 — newest first, read-only) ───────────────────────
function VitalsHistory({ vitals }) {
  const [expanded, setExpanded] = useState(null);

  if (!vitals || vitals.length === 0) {
    return (
      <div className="py-10 text-center text-sm text-gray-400">
        No vitals recorded yet for this patient.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {vitals.map((v, idx) => (
        <div key={v._id || idx} className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm transition duration-150 hover:border-gray-200">
          <button
            type="button"
            onClick={() => setExpanded(expanded === idx ? null : idx)}
            className="w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-slate-50/60 transition outline-none"
          >
            {idx === 0 && (
              <span className="flex-shrink-0 text-xs bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-full px-2 py-0.5 font-medium animate-pulse">
                Latest
              </span>
            )}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              {v.bloodPressure ? (
                <span className="flex items-center gap-1.5 font-medium text-gray-800">
                  <Droplets className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" /> {v.bloodPressure}
                </span>
              ) : <span className="text-gray-300">—</span>}

              {v.temperature ? (
                <span className="flex items-center gap-1.5 font-medium text-gray-800">
                  <Thermometer className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" /> {v.temperature}
                </span>
              ) : <span className="text-gray-300">—</span>}

              {v.heartRate ? (
                <span className="flex items-center gap-1.5 font-medium text-gray-800">
                  <Heart className="w-3.5 h-3.5 text-rose-500 flex-shrink-0" /> {v.heartRate}
                </span>
              ) : <span className="text-gray-300">—</span>}

              <span className="flex items-center gap-1 text-gray-400 text-xs sm:justify-end">
                <Clock className="w-3 h-3 text-gray-300" />
                {v.createdAt ? new Date(v.createdAt).toLocaleString([], { dateStyle: "short", timeStyle: "short" }) : "—"}
              </span>
            </div>
            {expanded === idx ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {expanded === idx && v.notes && (
            <div className="px-4 py-3 text-sm text-gray-600 border-t bg-slate-50/50">
              <span className="font-semibold text-gray-700">Observations: </span>{v.notes}
            </div>
          )}
        </div>
      ))}
      <p className="text-center text-xs text-gray-400 pt-3">
        Read-only logs: archival vitals cannot be modified.
      </p>
    </div>
  );
}

// ─── Patient search + selection ───────────────────────────────────────────────
function VitalsPageInner() {
  const searchParams = useSearchParams();
  const preloadId = searchParams.get("patientId") || "";
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
  }, []);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selected, setSelected] = useState(null);
  const [vitals, setVitals] = useState([]);
  const [loadingVitals, setLoadingVitals] = useState(false);

  // Auto-load matching dataset if patientId provided
  const loadPatient = useCallback(async (id) => {
    setLoadingVitals(true);
    try {
      const res = await fetch(`http://localhost:5000/api/assistants/${id}/vitals`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data?.status === "success") {
        setSelected({ _id: id, name: data.data?.patientName || "Patient" });
        setVitals(data.data?.vitals || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingVitals(false);
    }
  }, [token]);

  useEffect(() => {
    if (preloadId && token) {
      loadPatient(preloadId);
    }
  }, [preloadId, token, loadPatient]);

  const doSearch = async () => {
    const q = query.trim();
    if (!q) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/assistants/search?query=${encodeURIComponent(q)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setResults(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const selectPatient = (p) => {
    setResults([]);
    setQuery("");
    loadPatient(p._id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="bg-hero-gradient text-white rounded-2xl p-6 shadow-lg flex items-center gap-3">
          <div className="p-3 bg-white/20 rounded-xl"><Activity className="w-7 h-7" /></div>
          <div>
            <h1 className="text-2xl font-bold">Take Vitals</h1>
            <p className="text-white/80 text-sm">Search a patient, then record BP / temperature / pulse</p>
          </div>
        </div>

        {/* Step 1: Select patient */}
        {!selected && (
          <Card className="shadow-lg border">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50 pb-3">
              <CardTitle className="flex items-center gap-2 text-base text-gray-900">
                <Search className="w-4 h-4 text-gray-700" /> Step 1: Find Patient
              </CardTitle>
              <CardDescription className="text-gray-500">Search by name, email, or phone number</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 bg-white focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-500 transition-all duration-200">
                  <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && doSearch()}
                    placeholder="Type name, email, or phone…"
                    className="flex-1 outline-none text-sm bg-transparent text-gray-800"
                  />
                </div>
                <button
                  type="button"
                  onClick={doSearch}
                  disabled={loading}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition disabled:opacity-50 shadow-sm"
                >
                  {loading ? "Searching…" : "Search"}
                </button>
              </div>

              {results.length > 0 && (
                <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-50 bg-white shadow-inner">
                  {results.map((p) => (
                    <button
                      key={p._id}
                      type="button"
                      onClick={() => selectPatient(p)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-blue-50/50 transition text-left outline-none"
                    >
                      <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-gray-900">{p?.userId?.name}</p>
                        <p className="text-xs text-gray-500">{p?.userId?.email} · {p?.userId?.contact}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
              {loading && (
                <div className="py-8 text-center text-sm text-gray-400">Searching patients…</div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Vitals form + history */}
        {selected && (
          <>
            {/* Context bar */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-700 bg-white border border-gray-100 rounded-xl px-4 py-2 shadow-sm">
                <User className="w-4 h-4 text-blue-600" />
                <span>Recording metrics for <strong>{selected.name}</strong></span>
              </div>
              <button
                type="button"
                onClick={() => { setSelected(null); setVitals([]); }}
                className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline transition"
              >
                Change patient
              </button>
            </div>

            {/* Vitals Form Block */}
            <VitalsForm
              patientId={selected._id}
              patientName={selected.name}
              onRecorded={setVitals}
            />

            {/* Vitals History Log Card */}
            <Card className="shadow-lg border">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50/50 to-purple-50/30 pb-3">
                <CardTitle className="flex items-center gap-2 text-base text-gray-900">
                  <Clock className="w-4 h-4 text-gray-700" /> Vitals History
                  <span className="ml-auto text-xs font-normal text-gray-400">Newest first</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {loadingVitals ? (
                  <div className="py-10 flex flex-col items-center justify-center gap-2 text-sm text-gray-400">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                    <span>Retrieving log history…</span>
                  </div>
                ) : (
                  <VitalsHistory vitals={vitals} />
                )}
              </CardContent>
            </Card>
          </>
        )}

      </div>
    </div>
  );
}

export default function VitalsPage() {
  return (
    <ProtectedRoute allowedRoles={["assistant"]}>
      <Suspense fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      }>
        <VitalsPageInner />
      </Suspense>
    </ProtectedRoute>
  );
}