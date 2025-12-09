"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function LoginForm({ role }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const roleRedirect = {
    doctor: "/doctor",
    assistant: "/assistant",
    patient: "/patient",
    laboratory: "/lab",
    pharmacy: "/pharmacy",
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      Swal.fire({
        icon: "warning",
        title: "Missing Fields",
        text: "Please enter both email and password.",
      });
      return;
    }

    // Show loading
    Swal.fire({
      title: "Logging in...",
      text: "Please wait",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok || data.status === "error") {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: data.message || data.data?.message || "Invalid email or password. Please try again.",
        });
        return;
      }

      // Save token and user data
      const token = data.token || data.data?.token;
      const userData = data.user || data.data;

      if (token) {
        localStorage.setItem("token", token);
        if (userData) {
          localStorage.setItem("user", JSON.stringify(userData));
        }
        document.cookie = `token=${token}; path=/;`;
      }

      // Success message
      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: `Welcome back! Redirecting to your dashboard...`,
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        // Redirect by role
        const redirectPath = roleRedirect[role] || "/";
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
    <form onSubmit={handleSubmit} className="space-y-4 mt-6">
      <div>
        <label>Email</label>
        <input
          className="w-full border px-3 py-2 rounded-md"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div>
        <label>Password</label>
        <input
          className="w-full border px-3 py-2 rounded-md"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      <button className="w-full py-3 rounded-md bg-brand text-white">
        Login
      </button>
    </form>
  );
}
