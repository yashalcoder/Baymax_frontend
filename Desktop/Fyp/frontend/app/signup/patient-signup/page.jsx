"use client";
import { useState } from "react";
import { User, Mail, Phone, MapPin, Droplet, AlertTriangle, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

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


  return (
    <div className="min-h-screen flex items-center justify-center bg-soft p-6">
      <form onSubmit={handleSubmit} className="card w-full max-w-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Patient Signup</h1>

        <FormField label="Full Name" icon={User}>
          <Input name="name" value={formData.name} onChange={handleChange} placeholder="Enter full name" />
        </FormField>

        <FormField label="Email" icon={Mail}>
          <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Enter email" />
        </FormField>

        <FormField label="Contact Number" icon={Phone}>
          <Input name="contact" value={formData.contact} onChange={handleChange} placeholder="Enter contact number" />
        </FormField>

        <FormField label="Address" icon={MapPin}>
          <Input name="address" value={formData.address} onChange={handleChange} placeholder="Enter address" />
        </FormField>

        <FormField label="Password" icon={Lock}>
          <Input type="password" name="password" value={formData.password} onChange={handleChange} />
        </FormField>

        <FormField label="Confirm Password" icon={Lock}>
          <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
        </FormField>

        <FormField label="Allergies" icon={AlertTriangle}>
          <Input name="allergies" value={formData.allergies} onChange={handleChange} />
        </FormField>

        <FormField label="Blood Group" icon={Droplet}>
          <Input name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} />
        </FormField>

        <FormField label="Any Major Disease" icon={AlertTriangle}>
          <Input name="majorDisease" value={formData.majorDisease} onChange={handleChange} />
        </FormField>

        <button className="w-full bg-brand text-white py-3 rounded-lg">Register</button>
      </form>
    </div>
  );
}