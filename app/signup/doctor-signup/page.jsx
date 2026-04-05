"use client";
import { useState, useRef, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  Award,
  FileText,
  Clock,
  DollarSign,
  Shield,
  Plus,
  X,
  Mic,
  Square,
  CheckCircle,
  EyeOff,
  AlertCircle,
  Eye,
} from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

export default function DoctorRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    alternatePhone: "",
    dateOfBirth: "",
    gender: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    medicalDegree: "",
    university: "",
    graduationYear: "",
    medicalLicense: "",
    licenseState: "",
    licenseExpiry: "",
    specialization: "",
    subSpecialization: "",
    experience: "",
    currentHospital: "",
    consultationFee: "",
    availability: {
      days: [],
      from: "",
      to: "",
    },
    languages: [],
    bio: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Voice Recording States
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [voiceBlob, setVoiceBlob] = useState(null);
  const [voiceURL, setVoiceURL] = useState(null);
  const [voiceStatus, setVoiceStatus] = useState("pending");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const streamRef = useRef(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [languageInput, setLanguageInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const endpoint = process.env.NEXT_PUBLIC_BACKEND_URL;

  // ─── VALIDATION ──────────────────────────────────────────────────────────────

  const validateField = (name, value, currentFormData) => {
    let error = "";
    // Always work with a safe string — never call .trim() on array/object/undefined
    const strVal =
      value !== null && value !== undefined && !Array.isArray(value)
        ? String(value)
        : "";

    // Use passed formData or fall back to component state (for real-time blur)
    const pwd = currentFormData ? currentFormData.password : formData.password;

    switch (name) {
      case "firstName":
      case "lastName":
        if (!strVal.trim()) error = "This field is required";
        else if (strVal.trim().length < 2) error = "Must be at least 2 characters";
        else if (!/^[a-zA-Z\s]+$/.test(strVal)) error = "Only letters are allowed";
        break;

      case "email":
        if (!strVal.trim()) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(strVal))
          error = "Invalid email format";
        break;

      case "password":
        if (!strVal) error = "Password is required";
        else if (strVal.length < 8) error = "Password must be at least 8 characters";
        else if (!/(?=.*[a-z])/.test(strVal))
          error = "Must contain at least one lowercase letter";
        else if (!/(?=.*[A-Z])/.test(strVal))
          error = "Must contain at least one uppercase letter";
        else if (!/(?=.*\d)/.test(strVal))
          error = "Must contain at least one number";
        else if (!/(?=.*[@$!%*?&#])/.test(strVal))
          error = "Must contain at least one special character (@$!%*?&#)";
        break;

      case "confirmPassword":
        if (!strVal) error = "Please confirm your password";
        else if (strVal !== pwd) error = "Passwords do not match";
        break;

      case "phone":
        if (!strVal.trim()) error = "Phone number is required";
        else if (
          !/^(?:\+92|0092|92)?0?3[0-9]{9}$/.test(
            strVal.replace(/[\s\-()]/g, "")
          )
        )
          error = "Invalid Pakistani phone number";
        break;

      case "dateOfBirth":
        if (!strVal) {
          error = "Date of birth is required";
        } else {
          const dob = new Date(strVal);
          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear();
          const m = today.getMonth() - dob.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
          if (dob > today) error = "Date of birth cannot be in the future";
          else if (age < 25)
            error = "Must be at least 25 years old to register as a doctor";
          else if (age > 80) error = "Please verify your date of birth";
        }
        break;

      case "gender":
        if (!strVal) error = "Please select your gender";
        break;

      // ✅ Pakistani postal codes are 5 digits — removed US-only format
      case "zipCode":
        if (!strVal.trim()) error = "ZIP code is required";
        else if (!/^\d{5}$/.test(strVal.trim()))
          error = "ZIP code must be exactly 5 digits";
        break;

      case "graduationYear": {
        if (!strVal) error = "Graduation year is required";
        else {
          const yr = parseInt(strVal);
          const cur = new Date().getFullYear();
          if (isNaN(yr) || yr < 1950 || yr > cur)
            error = `Year must be between 1950 and ${cur}`;
        }
        break;
      }

      case "medicalLicense":
        if (!strVal.trim()) error = "Medical license number is required";
        else if (strVal.trim().length < 5)
          error = "License number must be at least 5 characters";
        break;

      case "licenseExpiry":
        if (!strVal) {
          error = "License expiry date is required";
        } else {
          const expiry = new Date(strVal);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (expiry < today) error = "License has expired";
        }
        break;

      case "experience": {
        if (strVal === "") {
          error = "Years of experience is required";
        } else {
          const exp = parseInt(strVal);
          if (isNaN(exp) || exp < 0) error = "Experience cannot be negative";
          else if (exp > 60) error = "Please verify years of experience";
        }
        break;
      }

      case "consultationFee": {
        if (strVal === "") {
          error = "Consultation fee is required";
        } else {
          const fee = parseFloat(strVal);
          if (isNaN(fee) || fee < 0) error = "Fee cannot be negative";
          else if (fee > 1000000) error = "Please verify consultation fee";
        }
        break;
      }

      // ✅ Bio minimum reduced to 20 chars — easier for testing; raise back to 50 in prod
      case "bio":
        if (!strVal.trim()) error = "Professional bio is required";
        else if (strVal.trim().length < 20)
          error = "Bio must be at least 20 characters";
        else if (strVal.trim().length > 1000)
          error = "Bio must not exceed 1000 characters";
        break;

      // ✅ All required text fields handled explicitly — no risky default
      case "address":
      case "city":
      case "state":
      case "country":
      case "medicalDegree":
      case "university":
      case "licenseState":
      case "specialization":
        if (!strVal.trim()) error = "This field is required";
        break;

      default:
        // Skip: alternatePhone, subSpecialization, currentHospital, availability, languages
        break;
    }

    return error;
  };

  const validateAllFields = () => {
    const newErrors = {};
    const skipFields = [
      "alternatePhone",
      "subSpecialization",
      "currentHospital",
      "availability",
      "languages",
    ];

    Object.keys(formData).forEach((key) => {
      if (!skipFields.includes(key)) {
        const error = validateField(key, formData[key], formData);
        if (error) newErrors[key] = error;
      }
    });

    if (formData.availability.days.length === 0) {
      newErrors.availability = "Please select at least one available day";
    }

    return newErrors;
  };

  // ─── HANDLERS ────────────────────────────────────────────────────────────────

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value, { ...formData, [name]: value });
      setErrors((prev) => ({ ...prev, [name]: error }));
    }

    if (name === "password" && touched.confirmPassword) {
      const confirmError = validateField("confirmPassword", formData.confirmPassword, {
        ...formData,
        password: value,
      });
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value, formData);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // ─── VOICE RECORDING ─────────────────────────────────────────────────────────

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const handleAvailabilityChange = (day) => {
    setFormData((prev) => {
      const exists = prev.availability.days.includes(day);
      return {
        ...prev,
        availability: {
          ...prev.availability,
          days: exists
            ? prev.availability.days.filter((d) => d !== day)
            : [...prev.availability.days, day],
        },
      };
    });
  };

  const handleTimeChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      availability: { ...prev.availability, [field]: value },
    }));
  };

  const addLanguage = () => {
    if (languageInput.trim() && !selectedLanguages.includes(languageInput.trim())) {
      setSelectedLanguages((prev) => [...prev, languageInput.trim()]);
      setLanguageInput("");
    }
  };

  const removeLanguage = (lang) => {
    setSelectedLanguages((prev) => prev.filter((l) => l !== lang));
  };

  const handleStartVoiceRecording = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert("Your browser doesn't support audio recording or needs HTTPS.");
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, sampleRate: 44100 },
      });
      streamRef.current = stream;

      let mimeType = "audio/webm";
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus"))
        mimeType = "audio/webm;codecs=opus";
      else if (MediaRecorder.isTypeSupported("audio/ogg;codecs=opus"))
        mimeType = "audio/ogg;codecs=opus";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) audioChunksRef.current.push(e.data);
      };
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setVoiceBlob(blob);
        setVoiceURL(URL.createObjectURL(blob));
        setVoiceStatus("recorded");
        streamRef.current?.getTracks().forEach((t) => t.stop());
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setVoiceStatus("recording");
      setRecordingTime(0);

      setTimeout(() => {
        if (mediaRecorder.state === "recording") handleStopVoiceRecording();
      }, 30000);
    } catch (err) {
      console.error("Microphone error:", err);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const handleStopVoiceRecording = () => {
    if (mediaRecorderRef.current?.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleRetakeVoice = () => {
    setVoiceBlob(null);
    setVoiceURL(null);
    setVoiceStatus("pending");
    setRecordingTime(0);
  };

  // ─── SUBMIT ───────────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mark all fields touched so errors show
    const allTouched = {};
    Object.keys(formData).forEach((k) => (allTouched[k] = true));
    setTouched(allTouched);

    // Validate all fields
    const validationErrors = validateAllFields();

    // Debug: log exactly which fields are failing
    if (Object.keys(validationErrors).length > 0) {
      console.log("❌ Validation errors:", validationErrors);
      setErrors(validationErrors);
      Swal.fire({
        icon: "warning",
        title: "Incomplete Form",
        text: `Please fix: ${Object.keys(validationErrors).join(", ")}`,
      });
      const firstField = Object.keys(validationErrors)[0];
      document
        .querySelector(`[name="${firstField}"]`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }

    if (!voiceBlob) {
      Swal.fire({
        icon: "warning",
        title: "Voice Sample Required",
        text: "Please record your voice sample!",
      });
      document
        .getElementById("voice-section")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    setIsSubmitting(true);

    try {
      const registrationData = new FormData();

      registrationData.append("file", voiceBlob, "voice_sample.webm");

      const doctorId = `dr_${formData.email
        .split("@")[0]
        .replace(/[^a-zA-Z0-9]/g, "_")}`;

      registrationData.append("doctor_id", doctorId);
      registrationData.append("firstName", formData.firstName);
      registrationData.append("lastName", formData.lastName);
      registrationData.append("email", formData.email);
      registrationData.append("phone", formData.phone);
      registrationData.append("specialization", formData.specialization);
      registrationData.append("hospital", formData.currentHospital || "Not specified");
      registrationData.append("password", formData.password);
      registrationData.append("address", formData.address);
      registrationData.append("city", formData.city);
      registrationData.append("state", formData.state);
      registrationData.append("zipCode", formData.zipCode);
      registrationData.append("country", formData.country);
      registrationData.append("dateOfBirth", formData.dateOfBirth);
      registrationData.append("gender", formData.gender);
      registrationData.append("medicalDegree", formData.medicalDegree);
      registrationData.append("university", formData.university);
      registrationData.append("graduationYear", formData.graduationYear);
      registrationData.append("medicalLicense", formData.medicalLicense);
      registrationData.append("licenseState", formData.licenseState);
      registrationData.append("licenseExpiry", formData.licenseExpiry);
      registrationData.append("subSpecialization", formData.subSpecialization);
      registrationData.append("experience", formData.experience);
      registrationData.append("consultationFee", formData.consultationFee);
      registrationData.append("availability", JSON.stringify(formData.availability));
      registrationData.append("languages", JSON.stringify(selectedLanguages));
      registrationData.append("bio", formData.bio);
      registrationData.append("role", "doctor");
      registrationData.append("status", "pending");

      const response = await fetch(`${endpoint}/api/doctors/register-doctor`, {
        method: "POST",
        body: registrationData,
      });

      const result = await response.json();

      if (result.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          html: `Doctor ID: <strong>${doctorId}</strong><br/>Voice created successfully!`,
        });
        router.push("/login");
      } else {
        throw new Error(result.message || "Registration failed");
      }
    } catch (error) {
      console.error("Registration error:", error);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // ─── HELPERS ─────────────────────────────────────────────────────────────────

  const inputClass = (field) =>
    `w-full px-4 py-3 border ${
      errors[field] && touched[field] ? "border-red-500" : "border-gray-300"
    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`;

  const ErrorMsg = ({ field }) =>
    errors[field] && touched[field] ? (
      <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
        <AlertCircle size={14} />
        {errors[field]}
      </p>
    ) : null;

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  // ─── RENDER ───────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r bg-hero-gradient px-8 py-6">
            <h1 className="text-3xl font-bold text-white">Doctor Registration</h1>
            <p className="text-blue-100 mt-2">
              Join our healthcare network with voice authentication
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">

            {/* ── Personal Information ── */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <User className="mr-3 text-blue-600" size={28} />
                Personal Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                  <input
                    type="text" name="firstName" value={formData.firstName}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputClass("firstName")} placeholder="John"
                  />
                  <ErrorMsg field="firstName" />
                </div>

                {/* Last Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                  <input
                    type="text" name="lastName" value={formData.lastName}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputClass("lastName")} placeholder="Doe"
                  />
                  <ErrorMsg field="lastName" />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Mail className="mr-2 text-gray-500" size={16} /> Email Address *
                  </label>
                  <input
                    type="email" name="email" value={formData.email}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputClass("email")} placeholder="john.doe@example.com"
                  />
                  <ErrorMsg field="email" />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Phone className="mr-2 text-gray-500" size={16} /> Phone Number *
                  </label>
                  <input
                    type="tel" name="phone" value={formData.phone}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputClass("phone")} placeholder="+923001234567"
                  />
                  <ErrorMsg field="phone" />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Calendar className="mr-2 text-gray-500" size={16} /> Date of Birth *
                  </label>
                  <input
                    type="date" name="dateOfBirth" value={formData.dateOfBirth}
                    onChange={handleChange} onBlur={handleBlur}
                    max={new Date().toISOString().split("T")[0]}
                    className={inputClass("dateOfBirth")}
                  />
                  <ErrorMsg field="dateOfBirth" />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                  <select
                    name="gender" value={formData.gender}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputClass("gender")}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <ErrorMsg field="gender" />
                </div>
              </div>

              {/* Password */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Password *</label>
                <div className={`flex items-center w-full px-4 py-3 border ${errors.password && touched.password ? "border-red-500" : "border-gray-300"} rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition`}>
                  <input
                    type={showPassword ? "text" : "password"} name="password"
                    value={formData.password} onChange={handleChange} onBlur={handleBlur}
                    placeholder="Enter strong password" className="flex-1 bg-transparent outline-none"
                  />
                  {showPassword
                    ? <EyeOff size={20} className="cursor-pointer text-gray-600" onClick={() => setShowPassword(false)} />
                    : <Eye size={20} className="cursor-pointer text-gray-600" onClick={() => setShowPassword(true)} />}
                </div>
                <ErrorMsg field="password" />
                <p className="mt-2 text-xs text-gray-500">
                  8+ characters with uppercase, lowercase, number, and special character
                </p>
              </div>

              {/* Confirm Password */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password *</label>
                <div className={`flex items-center w-full px-4 py-3 border ${errors.confirmPassword && touched.confirmPassword ? "border-red-500" : "border-gray-300"} rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition`}>
                  <input
                    type={showConfirmPassword ? "text" : "password"} name="confirmPassword"
                    value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur}
                    placeholder="Re-enter password" className="flex-1 bg-transparent outline-none"
                  />
                  {showConfirmPassword
                    ? <EyeOff size={20} className="cursor-pointer text-gray-600" onClick={() => setShowConfirmPassword(false)} />
                    : <Eye size={20} className="cursor-pointer text-gray-600" onClick={() => setShowConfirmPassword(true)} />}
                </div>
                <ErrorMsg field="confirmPassword" />
              </div>
            </section>

            {/* ── Address Information ── */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <MapPin className="mr-3 text-blue-600" size={28} /> Address Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Street Address *</label>
                  <input
                    type="text" name="address" value={formData.address}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputClass("address")} placeholder="123 Main Street"
                  />
                  <ErrorMsg field="address" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text" name="city" value={formData.city}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputClass("city")} placeholder="Lahore"
                  />
                  <ErrorMsg field="city" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">State / Province *</label>
                  <input
                    type="text" name="state" value={formData.state}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputClass("state")} placeholder="Punjab"
                  />
                  <ErrorMsg field="state" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ZIP / Postal Code *</label>
                  <input
                    type="text" name="zipCode" value={formData.zipCode}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputClass("zipCode")} placeholder="38000"
                  />
                  <ErrorMsg field="zipCode" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Country *</label>
                  {/* ✅ Added onBlur here — was missing before */}
                  <input
                    type="text" name="country" value={formData.country}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputClass("country")} placeholder="Pakistan"
                  />
                  <ErrorMsg field="country" />
                </div>
              </div>
            </section>

            {/* ── Medical Qualifications ── */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <GraduationCap className="mr-3 text-blue-600" size={28} /> Medical Qualifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Medical Degree *</label>
                  {/* ✅ Added onBlur — was missing before */}
                  <input
                    type="text" name="medicalDegree" value={formData.medicalDegree}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputClass("medicalDegree")} placeholder="MBBS, MD, DO"
                  />
                  <ErrorMsg field="medicalDegree" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">University *</label>
                  {/* ✅ Added onBlur — was missing before */}
                  <input
                    type="text" name="university" value={formData.university}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputClass("university")} placeholder="King Edward Medical University"
                  />
                  <ErrorMsg field="university" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Graduation Year *</label>
                  {/* ✅ Added onBlur — was missing before */}
                  <input
                    type="number" name="graduationYear" value={formData.graduationYear}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputClass("graduationYear")}
                    placeholder="2005" min="1950" max={new Date().getFullYear()}
                  />
                  <ErrorMsg field="graduationYear" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Shield className="mr-2 text-gray-500" size={16} /> Medical License Number *
                  </label>
                  {/* ✅ Added onBlur — was missing before */}
                  <input
                    type="text" name="medicalLicense" value={formData.medicalLicense}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputClass("medicalLicense")} placeholder="ML123456"
                  />
                  <ErrorMsg field="medicalLicense" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License State / Region *</label>
                  {/* ✅ Added onBlur — was missing before */}
                  <input
                    type="text" name="licenseState" value={formData.licenseState}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputClass("licenseState")} placeholder="Punjab"
                  />
                  <ErrorMsg field="licenseState" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">License Expiry Date *</label>
                  {/* ✅ Added onBlur — was missing before */}
                  <input
                    type="date" name="licenseExpiry" value={formData.licenseExpiry}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputClass("licenseExpiry")}
                  />
                  <ErrorMsg field="licenseExpiry" />
                </div>
              </div>
            </section>

            {/* ── Professional Details ── */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Briefcase className="mr-3 text-blue-600" size={28} /> Professional Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Award className="mr-2 text-gray-500" size={16} /> Specialization *
                  </label>
                  {/* ✅ Added onBlur — was missing before */}
                  <select
                    name="specialization" value={formData.specialization}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputClass("specialization")}
                  >
                    <option value="">Select Specialization</option>
                    <option value="cardiology">Cardiology</option>
                    <option value="dermatology">Dermatology</option>
                    <option value="neurology">Neurology</option>
                    <option value="pediatrics">Pediatrics</option>
                    <option value="orthopedics">Orthopedics</option>
                    <option value="psychiatry">Psychiatry</option>
                    <option value="radiology">Radiology</option>
                    <option value="surgery">Surgery</option>
                    <option value="general">General Practice</option>
                    <option value="other">Other</option>
                  </select>
                  <ErrorMsg field="specialization" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Specialization</label>
                  <input
                    type="text" name="subSpecialization" value={formData.subSpecialization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Interventional Cardiology"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Years of Experience *</label>
                  {/* ✅ Added onBlur — was missing before */}
                  <input
                    type="number" name="experience" value={formData.experience}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputClass("experience")} placeholder="10" min="0"
                  />
                  <ErrorMsg field="experience" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Hospital/Clinic</label>
                  <input
                    type="text" name="currentHospital" value={formData.currentHospital}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="City General Hospital"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <DollarSign className="mr-2 text-gray-500" size={16} /> Consultation Fee (PKR) *
                  </label>
                  {/* ✅ Added onBlur — was missing before */}
                  <input
                    type="number" name="consultationFee" value={formData.consultationFee}
                    onChange={handleChange} onBlur={handleBlur}
                    className={inputClass("consultationFee")} placeholder="1500" min="0"
                  />
                  <ErrorMsg field="consultationFee" />
                </div>
              </div>
            </section>

            {/* ── Voice Authentication ── */}
            <section id="voice-section" className="border-4 border-blue-200 rounded-xl p-6 bg-blue-50">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <Mic className="mr-3 text-blue-600" size={28} /> Voice Authentication *
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Record a 10-30 second voice sample for automatic identification in patient conversations.
              </p>

              <div className="bg-white rounded-lg p-4 mb-6 border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <AlertCircle className="mr-2 text-blue-600" size={20} /> Recording Instructions:
                </h3>
                <div className="bg-blue-50 p-4 rounded border border-blue-200 text-sm text-gray-800 leading-relaxed">
                  "Hello, my name is Dr. {formData.firstName || "[Your Name]"}. I am a{" "}
                  {formData.specialization || "medical"} specialist at{" "}
                  {formData.currentHospital || "[Your Hospital]"}. I am registering my voice for
                  patient consultation transcription services."
                </div>
              </div>

              <div className="space-y-4">
                {voiceStatus === "pending" && (
                  <div className="flex flex-col items-center gap-4">
                    <button type="button" onClick={handleStartVoiceRecording}
                      className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition font-semibold shadow-lg flex items-center gap-3 text-lg">
                      <Mic size={24} /> Start Voice Recording
                    </button>
                    <p className="text-xs text-gray-500">10-30 seconds recommended</p>
                  </div>
                )}

                {voiceStatus === "recording" && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-4 bg-red-50 border-2 border-red-300 rounded-xl px-8 py-4">
                      <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-2xl font-mono font-bold text-red-700">
                        {formatTime(recordingTime)}
                      </span>
                      <span className="text-sm text-red-600">(Max: 30 seconds)</span>
                    </div>
                    <button type="button" onClick={handleStopVoiceRecording}
                      className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold flex items-center gap-2">
                      <Square size={20} /> Stop Recording
                    </button>
                  </div>
                )}

                {voiceStatus === "recorded" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3 bg-green-50 border-2 border-green-300 rounded-xl px-6 py-4">
                      <CheckCircle className="text-green-600" size={24} />
                      <span className="font-semibold text-green-700">Voice Sample Recorded Successfully!</span>
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-gray-300">
                      <p className="text-sm font-medium text-gray-700 mb-2">Preview Your Recording:</p>
                      <audio controls src={voiceURL} className="w-full">
                        Your browser does not support audio playback.
                      </audio>
                      <p className="text-xs text-gray-500 mt-2">
                        Duration: {formatTime(recordingTime)} | Size:{" "}
                        {voiceBlob ? (voiceBlob.size / 1024).toFixed(2) : 0} KB
                      </p>
                    </div>
                    <div className="flex gap-3 justify-center">
                      <button type="button" onClick={handleRetakeVoice}
                        className="px-6 py-2 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium flex items-center gap-2">
                        <Mic size={18} /> Re-record Voice
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-white rounded-lg border border-gray-300">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Voice Status:</span>
                  {voiceStatus === "pending" && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">⚠️ Required</span>
                  )}
                  {voiceStatus === "recording" && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium animate-pulse">🎙️ Recording...</span>
                  )}
                  {voiceStatus === "recorded" && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">✅ Completed</span>
                  )}
                </div>
              </div>
            </section>

            {/* ── Availability & Languages ── */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Clock className="mr-3 text-blue-600" size={28} /> Availability & Languages
              </h2>
              <div className="space-y-6">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Available Days *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {days.map((day) => (
                      <label key={day} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.availability.days.includes(day)}
                          onChange={() => handleAvailabilityChange(day)}
                          className="w-4 h-4"
                        />
                        <span className="text-sm text-gray-700">{day}</span>
                      </label>
                    ))}
                  </div>
                  {errors.availability && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} /> {errors.availability}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">From</label>
                    <input type="time" value={formData.availability.from}
                      onChange={(e) => handleTimeChange("from", e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                  <span className="text-gray-500 mt-4">to</span>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">To</label>
                    <input type="time" value={formData.availability.to}
                      onChange={(e) => handleTimeChange("to", e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken</label>
                  <div className="flex gap-2 mb-3">
                    <input type="text" value={languageInput}
                      onChange={(e) => setLanguageInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addLanguage())}
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="e.g., Urdu, English, Punjabi" />
                    <button type="button" onClick={addLanguage}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center">
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedLanguages.map((lang) => (
                      <span key={lang} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2">
                        {lang}
                        <button type="button" onClick={() => removeLanguage(lang)} className="hover:text-blue-900">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* ── Professional Bio ── */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <FileText className="mr-3 text-blue-600" size={28} /> Professional Bio
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">About You *</label>
                <textarea
                  name="bio" value={formData.bio}
                  onChange={handleChange} onBlur={handleBlur}
                  rows="6"
                  className={`w-full px-4 py-3 border ${errors.bio && touched.bio ? "border-red-500" : "border-gray-300"} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none`}
                  placeholder="Tell us about your medical experience, expertise, and what drives your passion for healthcare... (minimum 20 characters)"
                />
                <div className="flex justify-between mt-1">
                  <ErrorMsg field="bio" />
                  <span className="text-xs text-gray-400 ml-auto">{formData.bio.length}/1000</span>
                </div>
              </div>
            </section>

            {/* ── Submit ── */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button type="button" onClick={() => router.push("/login")}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || voiceStatus !== "recorded"}
                className={`px-8 py-3 rounded-lg transition font-medium shadow-lg flex items-center gap-2 ${
                  isSubmitting || voiceStatus !== "recorded"
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Registering...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} /> Complete Registration
                  </>
                )}
              </button>
            </div>

            {voiceStatus !== "recorded" && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="text-yellow-600 flex-shrink-0 mt-1" size={20} />
                <div>
                  <p className="font-semibold text-yellow-800">Voice Authentication Required</p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Please record your voice sample to complete registration.
                  </p>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}