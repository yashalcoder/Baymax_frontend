"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/logo-removebg-preview.png";
import HeroImg from "@/public/login.png";
import Swal from "sweetalert2";
import LoginForm from "@/components/auth/LoginForm"; 

export default function DoctorLoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const endpoint = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${endpoint}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: "doctor"      // 🔥 fixed role
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        localStorage.setItem("role", "doctor");

        Swal.fire({
          icon: "success",
          title: `Welcome Doctor ${data.data.name}!`,
          showConfirmButton: true,
          timer: 3000,
        });

        router.push("/doctor");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("Network error, try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const bgStyle = { backgroundImage: `url(${HeroImg.src})` };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div
          className="relative overflow-hidden rounded-3xl shadow-2xl border border-blue-200/50 min-h-[520px] bg-cover bg-center"
          style={bgStyle}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/65 via-blue-800/35 to-white/15" />
          <div className="relative z-10 p-8 lg:p-10 space-y-6 backdrop-blur-[2px]">
            <div className="flex flex-col items-center text-center gap-3">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center border border-blue-200/60 shadow-sm">
                <Image src={Logo} alt="Logo" className="w-12 h-12" />
              </div>
              <h1 className="text-3xl font-semibold text-white drop-shadow">Doctor Login</h1>
              <p className="text-blue-50/90">Sign in to access your dashboard</p>
            </div>

            <div className="text-white">
              <div className="inline-flex items-center gap-2 text-xs bg-white/25 px-3 py-1.5 rounded-full backdrop-blur border border-white/30">
                Secure Doctor Access
              </div>
              <h2 className="mt-4 text-3xl font-semibold drop-shadow-sm">Doctor Portal</h2>
              <p className="text-sm text-white/90 leading-relaxed">Manage patients, consultations, and reports seamlessly.</p>
            </div>

            {error && (
              <div className="mb-2 p-3 bg-red-50/90 border border-red-200 rounded-lg text-sm text-red-700 text-center">
                {error}
              </div>
            )}

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-blue-100/60">
              <LoginForm role="doctor" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
