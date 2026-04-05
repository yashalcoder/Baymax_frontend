"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Image from "next/image";
import Swal from "sweetalert2";
import {
  User,
  Stethoscope,
  UserCog,
  Building2,
  FlaskConical,
  Check,
} from "lucide-react";
import signImg from "@/public/bay.png"; // ← your BayMax+ logo/mascot

const roleMeta = {
  doctor: {
    label: "Doctor",
    icon: Stethoscope,
    gradient: "from-indigo-500 to-blue-500",
  },
  patient: {
    label: "Patient",
    icon: User,
    gradient: "from-rose-400 to-pink-500",
  },
  assistant: {
    label: "Assistant",
    icon: UserCog,
    gradient: "from-cyan-400 to-sky-500",
  },
  laboratory: {
    label: "Laboratory",
    icon: FlaskConical,
    gradient: "from-purple-500 to-indigo-500",
  },
  pharmacy: {
    label: "Pharmacy",
    icon: Building2,
    gradient: "from-emerald-400 to-teal-500",
  },
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
    <main className="min-h-screen flex items-stretch bg-[#f0f7ff] overflow-hidden">

      {/* ── LEFT: Signup Card ── */}
      <div className="flex flex-col justify-center w-full lg:w-[480px] flex-shrink-0 bg-white px-10 py-14 shadow-[4px_0_40px_rgba(26,45,94,0.08)] relative z-10">

        {/* Logo */}
        <div className="flex items-center gap-3 mb-10">
          <div className="relative w-14 h-14 rounded-full overflow-hidden shadow-[0_4px_16px_rgba(26,115,232,0.3)]">
            <Image src={signImg} alt="BayMax+" fill className="object-contain" />
          </div>
          <span
            className="font-black text-2xl tracking-tight text-[#1b2d5e]"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            BayMax<span className="text-[#e8394a]">+</span>
          </span>
        </div>

        {/* Heading */}
        <h2
          className="text-3xl font-black text-[#1a2340] tracking-tight mb-1"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          Create Your Account
        </h2>
        <p className="text-sm text-slate-400 italic mb-8">
          Select your account type to proceed
        </p>

        {/* Role label */}
        <p className="text-[11px] font-bold tracking-widest text-[#1b2d5e] uppercase mb-3">
          Choose your role
        </p>

        {/* Role grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-7">
          {roles.map((role) => {
            const Icon = roleMeta[role].icon;
            const active = selectedRole === role;
            return (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`
                  flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all duration-200 text-left
                  shadow-sm hover:shadow-md hover:-translate-y-0.5 cursor-pointer
                  ${active
                    ? "border-blue-500 bg-blue-50 shadow-[0_4px_16px_rgba(26,115,232,0.15)]"
                    : "border-slate-100 bg-slate-50 hover:border-blue-300 hover:bg-white"
                  }
                  ${role === "pharmacy" ? "col-span-2" : ""}
                `}
              >
                {/* Icon */}
                <span
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0 bg-gradient-to-br ${roleMeta[role].gradient}`}
                >
                  <Icon size={20} />
                </span>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <p
                    className="font-extrabold text-[13.5px] text-slate-800"
                    style={{ fontFamily: "'Nunito', sans-serif" }}
                  >
                    {roleMeta[role].label}
                  </p>
                </div>

                {/* Check circle */}
                <span
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200
                    ${active ? "bg-blue-500 border-blue-500" : "border-slate-200"}`}
                >
                  {active && <Check size={11} strokeWidth={3} className="text-white" />}
                </span>
              </button>
            );
          })}
        </div>

        {/* Continue button */}
        <button
          onClick={handleContinue}
          className="w-full py-4 rounded-2xl font-black text-base text-white tracking-wide cursor-pointer
            bg-gradient-to-r from-[#1b2d5e] to-[#1a73e8]
            shadow-[0_8px_24px_rgba(26,115,232,0.4)]
            hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(26,115,232,0.5)]
            active:translate-y-0 transition-all duration-200"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          Continue →
        </button>

        {/* Sign in link */}
        <p className="text-center mt-5 text-sm text-slate-400">
          Already have an account?{" "}
          <button
            type="button"
            className="text-blue-600 font-bold hover:underline cursor-pointer"
            onClick={() => router.push("/login")}
          >
            Sign In
          </button>
        </p>
      </div>

      {/* ── RIGHT: Hero Panel ── */}
      <div className="hidden lg:flex flex-1 relative items-center justify-center overflow-hidden bg-gradient-to-br from-[#1b2d5e] via-[#1e3a8a] to-[#1a73e8]">

        {/* Background radial blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(58,142,255,0.35),transparent_60%)] animate-pulse" />
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-full bg-[radial-gradient(ellipse,rgba(26,45,94,0.6),transparent_60%)]" />
        </div>

        {/* Floating bubbles */}
        {[
          "w-28 h-28 top-[10%] left-[8%]",
          "w-14 h-14 top-[60%] left-[12%]",
          "w-20 h-20 top-[20%] right-[8%]",
          "w-10 h-10 bottom-[18%] right-[18%]",
        ].map((cls, i) => (
          <div
            key={i}
            className={`absolute rounded-full border border-white/10 bg-white/5 animate-pulse ${cls}`}
          />
        ))}

        {/* Floating plus icons */}
        {[
          "top-[8%] left-[18%] text-4xl",
          "top-[68%] left-[5%] text-2xl",
          "top-[14%] right-[5%] text-3xl",
          "bottom-[12%] right-[10%] text-xl",
        ].map((cls, i) => (
          <span
            key={i}
            className={`absolute text-white/10 font-light pointer-events-none animate-pulse ${cls}`}
          >
            ✚
          </span>
        ))}

        {/* ECG top */}
        <svg
          className="absolute top-[14%] w-full opacity-10 pointer-events-none"
          viewBox="0 0 800 40"
          preserveAspectRatio="none"
        >
          <polyline
            points="0,20 80,20 100,5 115,35 130,10 150,20 230,20 250,5 265,35 280,10 300,20 400,20 420,5 435,35 450,10 470,20 570,20 590,5 605,35 620,10 640,20 800,20"
            fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>

        {/* ECG bottom */}
        <svg
          className="absolute bottom-[14%] w-full opacity-10 pointer-events-none"
          viewBox="0 0 800 40"
          preserveAspectRatio="none"
        >
          <polyline
            points="0,20 100,20 120,5 135,35 150,10 170,20 300,20 320,5 335,35 350,10 370,20 500,20 520,5 535,35 550,10 570,20 700,20 720,5 735,35 750,10 770,20 800,20"
            fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>

        {/* Center content */}
        <div className="relative z-10 flex flex-col items-center text-center px-10">

          {/* Floating mascot */}
          <div className="relative mb-8 animate-bounce" style={{ animationDuration: "4s" }}>

            {/* Orbit ring */}
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border border-dashed border-white/20 animate-spin"
              style={{ animationDuration: "20s" }}
            >
              <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-white/60" />
              <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 rounded-full bg-sky-300/60" />
            </div>

            <div className="relative w-[280px] h-[280px]">
              <Image
                src={signImg}
                alt="BayMax+"
                fill
                className="object-contain drop-shadow-[0_0_60px_rgba(74,154,245,0.6)]"
                priority
              />
            </div>
          </div>

          {/* Tagline */}
          <h1
            className="text-4xl font-black text-white leading-tight mb-3 drop-shadow-lg"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            Join the<br />
            <span className="text-sky-300">BayMax+ Network</span>
          </h1>
          <p className="text-white/65 text-[15px] leading-relaxed max-w-sm mb-8">
            Create your account and connect with doctors, patients, and healthcare professionals all in one place.
          </p>
        </div>
      </div>

    </main>
  );
}