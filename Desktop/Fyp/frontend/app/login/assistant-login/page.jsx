"use client";
import LoginForm from "@/components/auth/LoginForm";
import Image from "next/image";
import Logo from "@/public/logo-removebg-preview.png";

export default function AssistantLogin() {
  return (
    <main className="min-h-screen bg-soft flex items-center justify-center px-4">
      <div className="w-full max-w-xl card p-8">
        <div className="text-center mb-4">
          <Image src={Logo} alt="Logo" className="w-16 h-16 mx-auto" />
          <h1 className="text-2xl font-bold">Assistant Login</h1>
        </div>
        <LoginForm role="assistant" />
      </div>
    </main>
  );
}
