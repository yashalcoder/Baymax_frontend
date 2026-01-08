"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { User, Mail, Phone, MapPin, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import Swal from "sweetalert2";
import SignupImg from "@/public/signup.avif";
import { Eye, EyeOff } from "lucide-react";

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

export default function PharmacySignup() {
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePhone = (phone) => {
    const phoneRegex = /^03[0-9]{2}-[0-9]{7}$/;
    return phoneRegex.test(phone);
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 4) {
      value = value.slice(0, 4) + "-" + value.slice(4);
    }

    setFormData({ ...formData, contact: value });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Required fields check
    if (
      !formData.name ||
      !formData.email ||
      !formData.contact ||
      !formData.address ||
      !formData.password ||
      !formData.confirmPassword ||
      !formData.location
    ) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill in all required fields",
      });
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Email",
        text: "Please enter a valid email address.",
      });
      return;
    }

    // Phone validation
    if (!validatePhone(formData.contact)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone",
        text: "Please enter a valid phone number (03XX-XXXXXXX)",
      });
      return;
    }

    // Password validations
    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match. Please try again.",
      });
      return;
    }

    if (formData.password.length < 6) {
      Swal.fire({
        icon: "error",
        title: "Invalid Password",
        text: "Password must be at least 6 characters long.",
      });
      return;
    }

    Swal.fire({
      title: "Registering...",
      text: "Please wait...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role: "pharmacy" }),
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

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        document.cookie = `token=${data.token}; path=/;`;
      }

      Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "Your pharmacy account has been created successfully.",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        const redirectPath =
          roleRedirectMap[data.role] ||
          roleRedirectMap[data.user?.role] ||
          "/pharmacy";
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

  // const bgStyle = { backgroundImage: `url(${SignupImg.src})` };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
          {/* <div className="absolute inset-0 bg-cover bg-center opacity-10" style={bgStyle}></div> */}
          <div className="relative z-10">
            <div className="bg-gradient-to-r bg-hero-gradient px-8 py-6">
              <h1 className="text-3xl font-bold text-white">
                Pharmacy Registration
              </h1>
              <p className="text-emerald-100 mt-2">
                Join our healthcare network and manage prescriptions with ease
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
              {/* Pharmacy Information */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <User className="mr-3 text-blue-600" size={28} />
                  Pharmacy Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pharmacy Name *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your pharmacy name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Mail className="mr-2 text-gray-500" size={16} />
                      Email Address *
                    </label>
                    <Input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Phone className="mr-2 text-gray-500" size={16} />
                      Contact Number *
                    </label>
                    <Input
                      name="contact"
                      value={formData.contact}
                      onChange={handlePhoneChange}
                      placeholder="03XX-XXXXXXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <MapPin className="mr-2 text-gray-500" size={16} />
                      Address *
                    </label>
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Street, City"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Lock className="mr-2 text-gray-500" size={16} />
                      Password *
                    </label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Minimum 8 characters"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {formData.password && (
                      <div className="mt-1 space-y-1">
                        {formData.password.length < 8 && (
                          <p className="text-red-500 text-xs">
                            • At least 8 characters
                          </p>
                        )}
                        {!/[a-z]/.test(formData.password) && (
                          <p className="text-red-500 text-xs">
                            • At least 1 lowercase letter
                          </p>
                        )}
                        {!/[A-Z]/.test(formData.password) && (
                          <p className="text-red-500 text-xs">
                            • At least 1 uppercase letter
                          </p>
                        )}
                        {!/[0-9]/.test(formData.password) && (
                          <p className="text-red-500 text-xs">
                            • At least 1 number
                          </p>
                        )}
                        {!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(
                          formData.password
                        ) && (
                          <p className="text-red-500 text-xs">
                            • At least 1 special character
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Lock className="mr-2 text-gray-500" size={16} />
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Re-enter password"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                    {formData.confirmPassword &&
                      formData.confirmPassword !== formData.password && (
                        <p className="text-red-500 text-xs mt-1">
                          Passwords do not match
                        </p>
                      )}
                  </div>
                </div>
              </section>

              {/* Location Information */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <MapPin className="mr-3 text-blue-600" size={28} />
                  Location Information
                </h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location (Lat, Lng) *
                  </label>
                  <Input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. 31.5204, 74.3587"
                    required
                  />
                </div>
              </section>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push("/login/pharmacy-login")}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 rounded-lg transition font-medium shadow-lg bg-gradient-to-r bg-hero-gradient text-white hover:from-emerald-700 hover:to-amber-600"
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
