"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { User, Mail, Phone, MapPin, Lock } from "lucide-react";
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

export default function LaboratorySignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    location: "",
    password: "",
    confirmPassword: "",
    contact: "",
    email: "",
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
        body: JSON.stringify({
          ...formData,
          role: "laboratory", 
        }),
      });

      const data = await res.json();

      if (!res.ok || data.status === "error") {
        Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text: data.message || "Something went wrong. Please try again.",
        });
        return;
      }

      // Store token and user data
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        document.cookie = `token=${data.token}; path=/;`;
      }

      // Success message
      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Your laboratory account has been created successfully.",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        // ROLE-BASED REDIRECT
        const redirectPath = roleRedirectMap[data.role] || roleRedirectMap[data.user?.role] || "/lab";
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
        <h1 className="text-2xl font-bold text-center">Laboratory Signup</h1>

        <FormField label="Laboratory Name" icon={User}>
          <Input name="name" value={formData.name} onChange={handleChange} />
        </FormField>

        <FormField label="Address" icon={MapPin}>
          <Input name="address" value={formData.address} onChange={handleChange} />
        </FormField>

        <FormField label="Location (Lat, Lng)" icon={MapPin}>
          <Input name="location" value={formData.location} onChange={handleChange} />
        </FormField>

        <FormField label="Email" icon={Mail}>
          <Input name="email" type="email" value={formData.email} onChange={handleChange} />
        </FormField>

        <FormField label="Contact" icon={Phone}>
          <Input name="contact" value={formData.contact} onChange={handleChange} />
        </FormField>

        <FormField label="Password" icon={Lock}>
          <Input type="password" name="password" value={formData.password} onChange={handleChange} />
        </FormField>

        <FormField label="Confirm Password" icon={Lock}>
          <Input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
        </FormField>

        <button className="w-full bg-brand text-white py-3 rounded-lg">Register</button>
      </form>
    </div>
  );
}