"use client";
import { useState } from "react";
import { User, Mail, Phone, MapPin, Droplet, AlertTriangle, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";
import SignupImg from "@/public/signup.avif";

// Simple FormField component
function FormField({ label, icon: Icon, children }) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        {Icon && <Icon className="w-4 h-4" />}
        {label}
      </label>
      {children}
    </div>
  );
}

export default function PatientSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    address: "",
    password: "",
    confirmPassword: "",
    allergies: "",
    bloodGroup: "",
    majorDisease: "",
  });

  const roleRedirectMap = {
    doctor: "/doctor",
    patient: "/patient",
    assistant: "/assistant",
    pharmacy: "/pharmacy",
    laboratory: "/lab",
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({ icon: "error", title: "Password Mismatch", text: "Passwords do not match." });
      return;
    }
    if ((formData.password || "").length < 6) {
      Swal.fire({ icon: "error", title: "Weak Password", text: "Password must be at least 6 characters." });
      return;
    }

    Swal.fire({
      title: "Registering...",
      text: "Please wait while we create your account",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: "patient",
        }),
      });

      const data = await res.json();

      if (!res.ok || data.status === "error") {
        Swal.fire({ icon: "error", title: "Signup Failed", text: data.message || "Please try again." });
        return;
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
        if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
        document.cookie = `token=${data.token}; path=/;`;
      }

      Swal.fire({
        icon: "success",
        title: "Signup Successful",
        text: "Welcome! Redirecting to your dashboard...",
        timer: 1800,
        showConfirmButton: false,
      }).then(() => {
        const redirectPath =
          roleRedirectMap[data.role] ||
          roleRedirectMap[data.user?.role] ||
          "/patient";
        router.push(redirectPath);
      });
    } catch (error) {
      console.error(error);
      Swal.fire({ icon: "error", title: "Server Error", text: "Unable to connect. Please try again later." });
    }
  };

  const bgStyle = { backgroundImage: `url(${SignupImg.src})` };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-emerald-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
          <div className="absolute inset-0 bg-cover bg-center opacity-10" style={bgStyle}></div>
          <div className="relative z-10">
            <div className="bg-gradient-to-r from-rose-600 to-emerald-600 px-8 py-6">
              <h1 className="text-3xl font-bold text-white">Patient Registration</h1>
              <p className="text-rose-100 mt-2">Join our healthcare network and manage your health records</p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Personal Information */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <User className="mr-3 text-rose-600" size={28} />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <Input name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Mail className="mr-2 text-gray-500" size={16} />
                      Email Address *
                    </label>
                    <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Phone className="mr-2 text-gray-500" size={16} />
                      Contact Number *
                    </label>
                    <Input name="contact" value={formData.contact} onChange={handleChange} placeholder="Enter contact number" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <MapPin className="mr-2 text-gray-500" size={16} />
                      Address *
                    </label>
                    <Input name="address" value={formData.address} onChange={handleChange} placeholder="Enter address" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Lock className="mr-2 text-gray-500" size={16} />
                      Password *
                    </label>
                    <Input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Minimum 6 characters" required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Lock className="mr-2 text-gray-500" size={16} />
                      Confirm Password *
                    </label>
                    <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Re-enter password" required />
                  </div>
                </div>
              </section>

              {/* Medical Information */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <AlertTriangle className="mr-3 text-rose-600" size={28} />
                  Medical Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <AlertTriangle className="mr-2 text-gray-500" size={16} />
                      Allergies
                    </label>
                    <Input name="allergies" value={formData.allergies} onChange={handleChange} placeholder="e.g. pollen" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Droplet className="mr-2 text-gray-500" size={16} />
                      Blood Group
                    </label>
                    <Input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} placeholder="e.g. B+" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <AlertTriangle className="mr-2 text-gray-500" size={16} />
                      Major Disease
                    </label>
                    <Input name="majorDisease" value={formData.majorDisease} onChange={handleChange} placeholder="e.g. Asthma" />
                  </div>
                </div>
              </section>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push("/login/patient-login")}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-lg transition font-medium shadow-lg bg-gradient-to-r from-rose-600 to-emerald-600 text-white hover:from-rose-700 hover:to-emerald-700"
                >
                  Complete Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
