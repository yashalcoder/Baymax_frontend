"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export default function LoginForm({ role }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
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
      Swal.fire("Missing Fields", "Please enter email & password", "warning");
      return;
    }

    Swal.fire({
      title: "Logging in...",
      text: "Please wait",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const data = await res.json();

      if (!res.ok || data.status === "error") {
        Swal.fire("Login Failed", data.message || "Invalid credentials", "error");
        return;
      }

      const token = data.token || data.data?.token;
      const userData = data.user || data.data;

      if (token) {
        localStorage.setItem("token", token);
        if (userData) localStorage.setItem("user", JSON.stringify(userData));
        document.cookie = `token=${token}; path=/;`;
      }

      Swal.fire({
        icon: "success",
        title: "Login Successful!",
        text: `Redirecting to dashboard...`,
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        router.push(roleRedirect[role] || "/");
      });

    } catch (error) {
      console.error(error);
      Swal.fire("Server Error", "Unable to connect. Try later", "error");
    }
  };

  // UPDATED OTP FUNCTION (No backend)
  const handleSendOTP = () => {
    if (!forgotEmail) {
      Swal.fire("Warning", "Please enter your email", "warning");
      return;
    }

    Swal.fire("Success", "OTP sent successfully! (Demo Only)", "success");
    setForgotPassword(false);
    setForgotEmail("");
  };

  return (
    <div className="space-y-4 mt-6">
      {!forgotPassword ? (
        <form onSubmit={handleSubmit} className="space-y-4">
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

          <div className="mt-4 text-center text-gray-500">
            <p>
              Don't have an account?{" "}
              <a href="/signup" className="text-indigo-600 font-medium hover:underline">
                Sign Up
              </a>
            </p>

            <p className="mt-2">
              <button
                type="button"
                className="text-indigo-600 hover:underline font-medium"
                onClick={() => setForgotPassword(true)}
              >
                Forgot Password?
              </button>
            </p>
          </div>
        </form>
      ) : (
        <div className="p-4 border rounded-lg bg-gray-50">
          <p className="mb-2 text-gray-700">Enter your email to receive OTP:</p>

          <input
            type="email"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
            placeholder="Your email"
            className="w-full p-2 border rounded-md mb-2"
          />

          <button
            onClick={handleSendOTP}
            className="w-full bg-indigo-600 text-white py-2 rounded-md"
          >
            Send OTP
          </button>

          <p
            className="mt-2 text-gray-500 text-sm cursor-pointer hover:underline"
            onClick={() => setForgotPassword(false)}
          >
            Cancel
          </p>
        </div>
      )}
    </div>
  );
}
