"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { Stethoscope, User, Building2, FlaskConical, UserCog } from "lucide-react";
import HeroImg from "@/public/login.png";

const roleMeta = {
  doctor: { label: "Doctor", icon: Stethoscope, gradient: "from-indigo-500 to-blue-500" },
  patient: { label: "Patient", icon: User, gradient: "from-rose-500 to-emerald-500" },
  assistant: { label: "Assistant", icon: UserCog, gradient: "from-indigo-500 to-sky-500" },
  laboratory: { label: "Laboratory", icon: FlaskConical, gradient: "from-purple-600 to-blue-500" },
  pharmacy: { label: "Pharmacy", icon: Building2, gradient: "from-emerald-500 to-amber-500" },
};

export default function LoginMain() {
  const roles = useMemo(() => Object.keys(roleMeta), []);
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("");

  const handleContinue = () => {
    if (!selectedRole) {
      Swal.fire({ icon: "warning", title: "Select a role", text: "Please choose a role to continue." });
      return;
    }
    router.push(`/login/${selectedRole}-login`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        {/* Visual side */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/40 min-h-[520px]">
          <Image src={HeroImg} alt="Login" className="h-full w-full object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/65 via-blue-900/35 to-transparent" />
          <div className="absolute top-6 right-6 bg-white/20 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/30">
            Secure Access
          </div>
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-3">
            <h1 className="text-3xl font-bold drop-shadow-sm">Welcome Back</h1>
            <p className="text-sm text-white/90 leading-relaxed">
              Choose your role to continue to the respective dashboard.
            </p>
            <div className="flex flex-wrap gap-2">
              {roles.map((r) => (
                <span
                  key={r}
                  className="px-3 py-1.5 bg-white/25 rounded-full text-xs font-semibold backdrop-blur border border-white/30 capitalize"
                >
                  {roleMeta[r].label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Selection card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 p-8 lg:p-10">
          <div className="text-center mb-6">
            <div className="mx-auto h-14 w-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg">
              Login
            </div>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">Sign in to continue</h2>
            <p className="text-slate-500">Select your role to proceed</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {roles.map((role) => {
              const Icon = roleMeta[role].icon;
              const active = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`flex items-center gap-3 p-4 rounded-2xl border transition-all shadow-sm hover:shadow-md ${
                    active ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
                  }`}
                >
                  <span
                    className={`h-11 w-11 rounded-xl flex items-center justify-center text-white text-lg font-semibold bg-gradient-to-r ${roleMeta[role].gradient}`}
                  >
                    <Icon size={22} />
                  </span>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 capitalize">{roleMeta[role].label}</p>
                    <p className="text-xs text-slate-500">Continue as {roleMeta[role].label.toLowerCase()}</p>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleContinue}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            Continue
          </button>

          <p className="text-center mt-4 text-sm text-slate-500">
            Don’t have an account?{" "}
            <button
              type="button"
              className="text-blue-600 font-semibold hover:underline"
              onClick={() => router.push("/signup")}
            >
              Register
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
