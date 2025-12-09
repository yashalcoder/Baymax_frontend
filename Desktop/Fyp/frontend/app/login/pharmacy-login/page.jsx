"use client";

import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";
import Logo from "@/public/logo-removebg-preview.png";
import HeroImg from "@/public/login.png";

export default function PharmacyLogin() {
  const bgStyle = { backgroundImage: `url(${HeroImg.src})` };

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div
          className="relative overflow-hidden rounded-3xl shadow-2xl border border-emerald-200/50 min-h-[520px] bg-cover bg-center"
          style={bgStyle}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/65 via-emerald-800/35 to-white/15" />
          <div className="relative z-10 p-8 lg:p-10 space-y-6 backdrop-blur-[2px]">
            <div className="text-center">
              <div className="mx-auto h-14 w-14 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 flex items-center justify-center border border-emerald-200/60 shadow-sm">
                <Image src={Logo} alt="Logo" className="w-10 h-10" />
              </div>
              <h1 className="mt-3 text-2xl font-bold text-white drop-shadow">Pharmacy Login</h1>
              <p className="text-emerald-50/90">Sign in to manage your pharmacy dashboard</p>
            </div>

            <div className="text-white">
              <div className="inline-flex items-center gap-2 text-xs bg-white/25 px-3 py-1.5 rounded-full backdrop-blur border border-white/30">
                Trusted Access
              </div>
              <h2 className="mt-4 text-3xl font-semibold drop-shadow-sm">Pharmacy Portal</h2>
              <p className="text-sm text-white/90 leading-relaxed">Manage prescriptions and inventory securely.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100/60">
              <LoginForm role="pharmacy" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
