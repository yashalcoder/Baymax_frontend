"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import { User, Stethoscope, UserPlus, Building2, FlaskConical } from "lucide-react";
import SignupImg from "@/public/signup.avif";

const roleMeta = {
  patient: { label: "Patient", icon: User, gradient: "from-rose-500 to-emerald-500" },
  doctor: { label: "Doctor", icon: Stethoscope, gradient: "from-blue-600 to-indigo-600" },
  assistant: { label: "Assistant", icon: UserPlus, gradient: "from-indigo-500 to-sky-500" },
  pharmacy: { label: "Pharmacy", icon: Building2, gradient: "from-emerald-500 to-amber-500" },
  laboratory: { label: "Laboratory", icon: FlaskConical, gradient: "from-purple-600 to-blue-500" },
};

export default function SignupPage() {
  const roles = useMemo(() => Object.keys(roleMeta), []);
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState("");

  const handleContinue = () => {
    if (!selectedRole) {
      Swal.fire({
        icon: "warning",
        title: "Select a role",
        text: "Please choose an account type to continue.",
      });
      return;
    }

    router.push(`/signup/${selectedRole}-signup`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        
        {/* Left Visual Card */}
        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/40 min-h-[440px]">
          <Image
            src={SignupImg}
            alt="Signup"
            className="h-full w-full object-cover scale-95"
            priority
          />

          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-blue-900/25 to-transparent" />

          <div className="absolute top-4 right-4 bg-white/20 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-semibold text-white border border-white/20">
            Create Account
          </div>

          <div className="absolute bottom-4 left-4 right-4 text-white space-y-2">
            <h1 className="text-2xl font-bold drop-shadow-sm">Join Healthcare Network</h1>
            <p className="text-xs text-white/90 leading-relaxed">
              Choose your account type to start your registration.
            </p>

          </div>
        </div>

        {/* Right Selection Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 p-6 lg:p-8">
          <div className="text-center mb-5">
            <div className="mx-auto h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
              <img src="/logo-removebg-preview.png" alt="Logo" className="h-10 w-10" />
            </div>

            <h2 className="mt-3 text-xl font-bold text-slate-900">Create Your Account</h2>
            <p className="text-slate-500 text-sm">Select your account type to proceed</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            {roles.map((role) => {
              const Icon = roleMeta[role].icon;
              const active = selectedRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`flex items-center gap-2.5 p-3.5 rounded-2xl border transition-all shadow-sm hover:shadow-md ${
                    active ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white"
                  }`}
                >
                  <span
                    className={`h-10 w-10 rounded-xl flex items-center justify-center text-white bg-gradient-to-r ${roleMeta[role].gradient}`}
                  >
                    <Icon size={20} />
                  </span>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900 capitalize text-sm">{roleMeta[role].label}</p>
                    <p className="text-[11px] text-slate-500">
                      Register as {roleMeta[role].label.toLowerCase()}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleContinue}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-sm shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all"
          >
            Continue
          </button>

          <p className="text-center mt-3 text-xs text-slate-500">
            Already have an account?{" "}
            <button
              type="button"
              className="text-blue-600 font-semibold hover:underline"
              onClick={() => router.push("/login")}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
