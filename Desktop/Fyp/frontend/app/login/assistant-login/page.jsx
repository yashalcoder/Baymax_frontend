"use client";

import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";
import Logo from "@/public/logo-removebg-preview.png";
import HeroImg from "@/public/login.png";

export default function AssistantLogin() {
  const bgStyle = { backgroundImage: `url(${HeroImg.src})` };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-sky-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div
          className="relative overflow-hidden rounded-3xl shadow-2xl border border-sky-100 min-h-[520px] bg-cover bg-center"
          style={bgStyle}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-slate-900/65 via-sky-900/35 to-white/15" />
          <div className="relative z-10 p-8 lg:p-10 space-y-6 backdrop-blur-[2px]">
            <div className="text-center">
              <div className="mx-auto h-14 w-14 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center border border-sky-200 shadow-sm">
                <Image src={Logo} alt="Logo" className="w-10 h-10" />
              </div>
              <h2 className="mt-3 text-2xl font-bold text-white drop-shadow">Assistant Login</h2>
              <p className="text-slate-50/90">Sign in to continue to your assistant workspace</p>
            </div>

            <div className="text-white">
              <div className="inline-flex items-center gap-2 text-xs bg-white/25 px-3 py-1.5 rounded-full backdrop-blur border border-white/30">
                Secure Access
              </div>
              <h3 className="mt-4 text-3xl font-semibold drop-shadow-md">Welcome back, Assistant</h3>
              <p className="text-sm text-white/90 leading-relaxed">
                Coordinate patients, tasks, and communications seamlessly.
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-sky-100/60">
              <LoginForm role="assistant" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
