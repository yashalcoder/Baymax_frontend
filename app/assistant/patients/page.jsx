"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/protectedRoutes";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import { Users, User, Mail, Phone, Heart, Search } from "lucide-react";

export default function AssistantPatientsPage() {
  const token   = useMemo(() => localStorage.getItem("token"), []);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error,   setError]     = useState("");
  const [filter,  setFilter]    = useState("");

  useEffect(() => {
    if (!token) { setLoading(false); return; }

    
    fetch("http://localhost:5000/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then(async (data) => {
        if (data?.status !== "success") {
          setError("Could not load profile");
          return;
        }
        const ids = data.data?.profile?.patientsManaged || [];
        if (ids.length === 0) { setPatients([]); return; }

        // Fetch all patients that match the assistant's managed list
        const res  = await fetch("http://localhost:5000/api/assistants/my-patients", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const body = await res.json();
        setPatients(Array.isArray(body?.data) ? body.data : []);
      })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [token]);

  const filtered = patients.filter((p) => {
    const name    = p?.userId?.name    || "";
    const email   = p?.userId?.email   || "";
    const contact = p?.userId?.contact || "";
    const q = filter.toLowerCase();
    return name.toLowerCase().includes(q) || email.toLowerCase().includes(q) || contact.includes(q);
  });

  return (
    <ProtectedRoute allowedRoles={["assistant"]}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Header */}
          <div className="bg-hero-gradient text-white rounded-2xl p-6 md:p-8 shadow-lg flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl"><Users className="w-8 h-8" /></div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">My Patients</h1>
              <p className="text-white/80">Patients you have registered or manage</p>
            </div>
          </div>

          <Card className="shadow-lg border">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" /> Patient List
              </CardTitle>
              <CardDescription>
                {patients.length} patient{patients.length !== 1 ? "s" : ""} managed by you
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">

              {/* Filter */}
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2 bg-white">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  placeholder="Filter by name, email, or phone…"
                  className="flex-1 outline-none text-sm"
                />
              </div>

              {loading && (
                <div className="py-12 text-center text-sm text-gray-400">Loading patients…</div>
              )}
              {!loading && error && (
                <div className="py-6 text-center text-sm text-red-500">{error}</div>
              )}
              {!loading && !error && filtered.length === 0 && (
                <div className="py-12 text-center text-sm text-gray-400">
                  {patients.length === 0
                    ? "No patients yet. Add your first patient."
                    : "No patients match your filter."}
                </div>
              )}

              {/* Patient cards */}
              <div className="grid gap-3">
                {filtered.map((p) => (
                  <div
                    key={p._id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-white border rounded-2xl shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 truncate">
                          {p?.userId?.name || "Patient"}
                        </p>
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-0.5">
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Mail className="w-3 h-3" /> {p?.userId?.email || "—"}
                          </span>
                          <span className="flex items-center gap-1 text-xs text-gray-500">
                            <Phone className="w-3 h-3" /> {p?.userId?.contact || "—"}
                          </span>
                        </div>
                        {p.bloodGroup && (
                          <span className="inline-block mt-1 text-xs bg-red-50 text-red-700 border border-red-100 rounded-full px-2 py-0.5">
                            {p.bloodGroup}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <Link
                        href={`/assistant/vitals?patientId=${p._id}`}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-rose-50 text-rose-700 border border-rose-100 hover:bg-rose-100 transition"
                      >
                        <Heart className="w-3.5 h-3.5" /> Vitals
                      </Link>
                    </div>
                  </div>
                ))}
              </div>

            </CardContent>
          </Card>

        </div>
      </div>
    </ProtectedRoute>
  );
}