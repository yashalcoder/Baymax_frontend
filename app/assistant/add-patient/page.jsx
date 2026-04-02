"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import ProtectedRoute from "@/components/protectedRoutes";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardHeader, CardTitle, CardDescription,
} from "@/components/ui/card";
import {
  UserPlus, Stethoscope, AlertCircle, User, Mail, Phone,
  MapPin, Droplets, AlertTriangle, Activity,
} from "lucide-react";


const inputCls =
  "w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm " +
  "focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white outline-none transition";

function Field({ label, icon: Icon, children }) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
        {Icon && <Icon className="w-3.5 h-3.5 text-gray-400" />}
        {label}
      </label>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const EMPTY = {
  name: "", email: "", contact: "", address: "",
  bloodGroup: "", allergies: "", majorDisease: "", doctorId: "",
};

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function RegisterPatientPage() {
  const router       = useRouter();
  const [token, setToken] = useState(null);
useEffect(() => {
  setToken(localStorage.getItem("token"));
}, []);
  const [form,       setForm]       = useState(EMPTY);
  const [doctors,    setDoctors]    = useState([]);
  const [submitting, setSubmitting] = useState(false);

  
  useEffect(() => {
    if (!token) return;
    fetch("http://localhost:5000/api/assistants/doctors", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => setDoctors(Array.isArray(d?.data) ? d.data : []))
      .catch(() => setDoctors([]));
  }, [token]);

  const set = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const formatPhone = (e) => {
    let v = e.target.value.replace(/\D/g, "").slice(0, 11);
    if (v.length > 4) v = v.slice(0, 4) + "-" + v.slice(4);
    setForm((prev) => ({ ...prev, contact: v }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const required = ["name", "email", "contact", "address", "doctorId"];
    for (const k of required) {
      if (!String(form[k] || "").trim()) {
        Swal.fire("Missing Fields", `Please fill in: ${k}`, "warning");
        return;
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      Swal.fire("Invalid Email", "Please enter a valid email address.", "error");
      return;
    }
    if (!/^03[0-9]{2}-[0-9]{7}$/.test(form.contact)) {
      Swal.fire("Invalid Phone", "Format must be 03XX-XXXXXXX", "error");
      return;
    }

    Swal.fire({ title: "Creating patient…", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
    setSubmitting(true);

    try {
      const res  = await fetch("http://localhost:5000/api/assistants/add", {
        method:  "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body:    JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to create patient");

      const result = await Swal.fire({
        icon:  "success",
        title: "Patient Registered!",
        html:  `<p>Patient created and assigned to the selected doctor.</p>
                <p class="mt-2 text-sm text-gray-500">Default login password: <strong>default123</strong></p>`,
        confirmButtonText: "Add Another",
        showDenyButton:    true,
        denyButtonText:    "Go to Patients",
        denyButtonColor:   "#3b82f6",
      });

      if (result.isDenied) router.push("/assistant/patients");
      else setForm(EMPTY);
    } catch (err) {
      Swal.fire("Error", err.message || "Something went wrong.", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["assistant"]}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 md:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Header */}
          <div className="bg-hero-gradient text-white rounded-2xl p-6 shadow-lg flex items-center gap-3">
            <div className="p-3 bg-white/20 rounded-xl">
              <UserPlus className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Register New Patient</h1>
              <p className="text-blue-100 text-sm mt-0.5">
                A default password (default123) will be set — patient should change it after first login.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Personal info */}
            <Card className="shadow-sm border">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50 pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <User className="w-4 h-4" /> Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Full Name *" icon={User}>
                  <input className={inputCls} placeholder="Ali Hassan" value={form.name} onChange={set("name")} />
                </Field>
                <Field label="Email Address *" icon={Mail}>
                  <input type="email" className={inputCls} placeholder="ali@example.com" value={form.email} onChange={set("email")} />
                </Field>
                <Field label="Contact (03XX-XXXXXXX) *" icon={Phone}>
                  <input className={inputCls} placeholder="0300-1234567" value={form.contact} onChange={formatPhone} />
                </Field>
                <Field label="Address *" icon={MapPin}>
                  <input className={inputCls} placeholder="Street, City" value={form.address} onChange={set("address")} />
                </Field>
              </CardContent>
            </Card>

            {/* Medical info */}
            <Card className="shadow-sm border">
              <CardHeader className="border-b bg-gradient-to-r from-rose-50 to-pink-50 pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Activity className="w-4 h-4 text-rose-600" /> Medical Information
                  <span className="text-xs font-normal text-gray-400">(optional)</span>
                </CardTitle>
                
              </CardHeader>
              <CardContent className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Blood Group" icon={Droplets}>
                  <select className={inputCls} value={form.bloodGroup} onChange={set("bloodGroup")}>
                    <option value="">Select…</option>
                    {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </Field>
                <Field label="Known Allergies" icon={AlertTriangle}>
                  <input className={inputCls} placeholder="e.g. Penicillin" value={form.allergies} onChange={set("allergies")} />
                </Field>
                <Field label="Major Disease / Condition" icon={Activity}>
                  <input className={inputCls} placeholder="e.g. Diabetes" value={form.majorDisease} onChange={set("majorDisease")} />
                </Field>
              </CardContent>
            </Card>

            {/* Doctor assignment */}
            <Card className="shadow-sm border">
              <CardHeader className="border-b bg-gradient-to-r from-emerald-50 to-teal-50 pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Stethoscope className="w-4 h-4 text-emerald-600" /> Assign Doctor *
                </CardTitle>
                
              </CardHeader>
              <CardContent className="p-5">
                <select className={inputCls} value={form.doctorId} onChange={set("doctorId")}>
                  <option value="">— Select a doctor —</option>
                  {doctors.map((d) => (
                    <option key={d._id} value={d._id}>
                      {d.displayName}{d.specialization ? ` (${d.specialization})` : ""}
                    </option>
                  ))}
                </select>
                {doctors.length === 0 && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-xl">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    No doctors found in the system. At least one doctor must be registered first.
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <div className="flex justify-end gap-3 pb-4">
              <button
                type="button"
                onClick={() => router.push("/assistant/patients")}
                className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition text-sm font-medium"
              >
                Cancel
              </button>
              <Button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-hero-gradient text-white rounded-xl text-sm font-semibold shadow-lg hover:opacity-90 transition"
              >
                {submitting ? "Registering…" : "Register Patient"}
              </Button>
            </div>

          </form>
        </div>
      </div>
    </ProtectedRoute>
  );
}