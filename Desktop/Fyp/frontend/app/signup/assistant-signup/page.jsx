"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { User, Mail, Phone, MapPin, AlertTriangle, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";

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

export default function AssistantSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    address: "",
    contact: "",
    degree: "",
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

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match. Please try again.",
      });
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Invalid Password",
        text: "Password must be at least 6 characters long.",
      });
      return;
    }

    // Show loading
    Swal.fire({
      title: "Registering...",
      text: "Please wait while we create your account",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "assistant" }),
      });

      const data = await res.json();

      if (!res.ok || data.status === "error" || !data.user) {
        Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text: data.message || "Something went wrong. Please try again.",
        });
        return;
      }

      // Store token & user safely
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        document.cookie = `token=${data.token}; path=/;`;
      }

      // Success message
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Your assistant account has been created successfully.",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        // Role-based redirect
        const redirectPath = roleRedirectMap[data.user.role] || roleRedirectMap[data.role] || "/assistant";
        router.push(redirectPath);
      });

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to connect to server. Please try again later.",
      });
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-soft p-6">
      <form onSubmit={handleSubmit} className="card w-full max-w-xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-center">Assistant Signup</h1>

        <FormField label="Full Name" icon={User}>
          <Input name="name" value={formData.name} onChange={handleChange} required />
        </FormField>

        <FormField label="Email" icon={Mail}>
          <Input name="email" type="email" value={formData.email} onChange={handleChange} required />
        </FormField>

        <FormField label="Password" icon={Lock}>
          <Input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </FormField>

        <FormField label="Confirm Password" icon={Lock}>
          <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
        </FormField>

        <FormField label="Address" icon={MapPin}>
          <Input name="address" value={formData.address} onChange={handleChange} required />
        </FormField>

        <FormField label="Contact" icon={Phone}>
          <Input name="contact" value={formData.contact} onChange={handleChange} required />
        </FormField>

        <FormField label="Highest Degree" icon={AlertTriangle}>
          <Input name="degree" value={formData.degree} onChange={handleChange} required />
        </FormField>

        <button type="submit" className="w-full bg-brand text-white py-3 rounded-lg">
          Register
        </button>
      </form>
    </div>
  );
}
