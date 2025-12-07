"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "@/public/logo-removebg-preview.png";

export default function LoginPage() {
  const [role, setRole] = useState("doctor");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const endpoint =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch(`${endpoint}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: role, // "doctor" or "patient"
        }),
      });

      const data = await response.json();

      if (data.status === "success") {
        // Store JWT token in localStorage
        localStorage.setItem("token", data.data.token);
        localStorage.setItem("user", JSON.stringify(data.data));
        localStorage.setItem("role", data.data.role);

        // Success message
        alert(`✅ Welcome back, ${data.data.name}!`);

        // Redirect based on role
        if (role === "doctor") {
          router.push("/doctor");
        } else {
          router.push("/patient");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[88vh] bg-soft flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl card p-6 md:p-8">
        <div className="flex flex-col items-center text-center gap-3">
          <a href="/" className="flex items-center font-semibold">
            <Image src={Logo} alt="Logo" className="w-16 h-16" />
          </a>
          <h1 className="text-3xl font-semibold">Welcome Back</h1>
          <p className="text-muted-foreground">
            Sign in to access your healthcare dashboard
          </p>
        </div>

        {/* Role Selection */}
        <div
          className="mt-5 grid grid-cols-2 gap-2 p-1 rounded-lg border bg-background"
          role="tablist"
          aria-label="Select role"
        >
          <button
            type="button"
            role="tab"
            aria-selected={role === "patient"}
            onClick={() => setRole("patient")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              role === "patient" ? "bg-secondary" : "hover:bg-gray-100"
            }`}
          >
            Patient
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={role === "doctor"}
            onClick={() => setRole("doctor")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition ${
              role === "doctor" ? "bg-secondary" : "hover:bg-gray-100"
            }`}
          >
            Doctor
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600 text-center">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4"
          aria-label="Sign in form"
        >
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-brand disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-brand disabled:opacity-50 disabled:cursor-not-allowed"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full px-4 py-3 rounded-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium transition ${
              isLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:from-blue-700 hover:to-indigo-700"
            }`}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Signing In...
              </span>
            ) : (
              `Sign In as ${role === "doctor" ? "Doctor" : "Patient"}`
            )}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-4">
          Don't have an account?{" "}
          <a className="text-brand hover:underline" href="/signup">
            Sign up
          </a>
        </p>

        {/* Forgot Password */}
        <p className="text-center text-sm text-muted-foreground mt-2">
          <a className="text-brand hover:underline" href="/forgot-password">
            Forgot password?
          </a>
        </p>
      </div>
    </main>
  );
}
