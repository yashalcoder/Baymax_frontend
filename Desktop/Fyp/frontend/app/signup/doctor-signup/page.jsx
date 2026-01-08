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
  Play,
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
    availability: [],
    languages: [],
    bio: "",
  });

  // Validation errors state
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
  // Validation rules
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstName":
      case "lastName":
        if (!value.trim()) {
          error = "This field is required";
        } else if (value.trim().length < 2) {
          error = "Must be at least 2 characters";
        } else if (!/^[a-zA-Z\s]+$/.test(value)) {
          error = "Only letters are allowed";
        }
        break;

      case "email":
        if (!value.trim()) {
          error = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = "Invalid email format";
        }
        break;

      case "password":
        if (!value) {
          error = "Password is required";
        } else if (value.length < 8) {
          error = "Password must be at least 8 characters";
        } else if (!/(?=.*[a-z])/.test(value)) {
          error = "Must contain at least one lowercase letter";
        } else if (!/(?=.*[A-Z])/.test(value)) {
          error = "Must contain at least one uppercase letter";
        } else if (!/(?=.*\d)/.test(value)) {
          error = "Must contain at least one number";
        } else if (!/(?=.*[@$!%*?&#])/.test(value)) {
          error = "Must contain at least one special character (@$!%*?&#)";
        }
        break;

      case "confirmPassword":
        if (!value) {
          error = "Please confirm your password";
        } else if (value !== formData.password) {
          error = "Passwords do not match";
        }
        break;

      case "phone":
        if (!value.trim()) {
          error = "Phone number is required";

          // Only allow Pakistani formats
        } else if (
          !/^(?:\+92|0092|92)?0?3[0-9]{9}$/.test(value.replace(/[\s\-()]/g, ""))
        ) {
          error = "Invalid Pakistani phone number";
        } else {
          error = "";
        }
        break;

      case "dateOfBirth":
        if (!value) {
          error = "Date of birth is required";
        } else {
          const dob = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - dob.getFullYear();
          const monthDiff = today.getMonth() - dob.getMonth();

          if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < dob.getDate())
          ) {
            age--;
          }

          if (dob > today) {
            error = "Date of birth cannot be in the future";
          } else if (age < 25) {
            error = "Must be at least 25 years old to register as a doctor";
          } else if (age > 80) {
            error = "Please verify your date of birth";
          }
        }
        break;

      case "zipCode":
        if (!value.trim()) {
          error = "ZIP code is required";
        } else if (!/^\d{5}(-\d{4})?$/.test(value)) {
          error = "Invalid ZIP code format (e.g., 12345 or 12345-6789)";
        }
        break;

      case "graduationYear":
        if (!value) {
          error = "Graduation year is required";
        } else {
          const year = parseInt(value);
          const currentYear = new Date().getFullYear();
          if (year < 1950 || year > currentYear) {
            error = `Year must be between 1950 and ${currentYear}`;
          }
        }
        break;

      case "medicalLicense":
        if (!value.trim()) {
          error = "Medical license number is required";
        } else if (value.trim().length < 5) {
          error = "License number must be at least 5 characters";
        }
        break;

      case "licenseExpiry":
        if (!value) {
          error = "License expiry date is required";
        } else {
          const expiry = new Date(value);
          const today = new Date();
          if (expiry < today) {
            error = "License has expired";
          }
        }
        break;

      case "experience":
        if (!value) {
          error = "Years of experience is required";
        } else {
          const exp = parseInt(value);
          if (exp < 0) {
            error = "Experience cannot be negative";
          } else if (exp > 60) {
            error = "Please verify years of experience";
          }
        }
        break;

      case "consultationFee":
        if (!value) {
          error = "Consultation fee is required";
        } else {
          const fee = parseFloat(value);
          if (fee < 0) {
            error = "Fee cannot be negative";
          } else if (fee > 10000) {
            error = "Please verify consultation fee";
          }
        }
        break;

      case "bio":
        if (!value.trim()) {
          error = "Professional bio is required";
        } else if (value.trim().length < 50) {
          error = "Bio must be at least 50 characters";
        } else if (value.trim().length > 1000) {
          error = "Bio must not exceed 1000 characters";
        }
        break;

      default:
        if (
          !value.trim() &&
          [
            "address",
            "city",
            "state",
            "country",
            "medicalDegree",
            "university",
            "licenseState",
            "specialization",
          ].includes(name)
        ) {
          error = "This field is required";
        }
        break;
    }

    return error;
  };

  // Validate all fields
  const validateAllFields = () => {
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      if (
        key !== "alternatePhone" &&
        key !== "subSpecialization" &&
        key !== "currentHospital" &&
        key !== "availability" &&
        key !== "languages"
      ) {
        const error = validateField(key, formData[key]);
        if (error) {
          newErrors[key] = error;
        }
      }
    });

    // Special validation for availability
    if (formData.availability.length === 0) {
      newErrors.availability = "Please select at least one available day";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change if field has been touched
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }

    // Also validate confirmPassword when password changes
    if (name === "password" && touched.confirmPassword) {
      const confirmError = validateField(
        "confirmPassword",
        formData.confirmPassword
      );
      setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Timer for voice recording
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleAvailabilityChange = (day) => {
    const exists = formData.availability.find((a) => a.day === day);
    if (exists) {
      setFormData({
        ...formData,
        availability: formData.availability.filter((a) => a.day !== day),
      });
    } else {
      setFormData({
        ...formData,
        availability: [...formData.availability, { day, from: "", to: "" }],
      });
    }
    // Clear availability error when user selects a day
    if (errors.availability) {
      setErrors((prev) => ({ ...prev, availability: "" }));
    }
  };

  const handleTimeChange = (index, field, value) => {
    const updated = [...formData.availability];
    updated[index][field] = value;
    setFormData({ ...formData, availability: updated });
  };

  const addLanguage = () => {
    if (
      languageInput.trim() &&
      !selectedLanguages.includes(languageInput.trim())
    ) {
      setSelectedLanguages([...selectedLanguages, languageInput.trim()]);
      setLanguageInput("");
    }
  };

  const removeLanguage = (lang) => {
    setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
  };

  const handleStartVoiceRecording = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert(
          "Your browser doesn't support audio recording or this page needs to be served over HTTPS."
        );
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      });

      streamRef.current = stream;

      let mimeType = "audio/webm";
      if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
        mimeType = "audio/webm;codecs=opus";
      } else if (MediaRecorder.isTypeSupported("audio/webm")) {
        mimeType = "audio/webm";
      } else if (MediaRecorder.isTypeSupported("audio/ogg;codecs=opus")) {
        mimeType = "audio/ogg;codecs=opus";
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(blob);

        setVoiceBlob(blob);
        setVoiceURL(url);
        setVoiceStatus("recorded");

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
        }
      };

      mediaRecorder.start(1000);
      setIsRecording(true);
      setVoiceStatus("recording");
      setRecordingTime(0);

      setTimeout(() => {
        if (mediaRecorder.state === "recording") {
          handleStopVoiceRecording();
        }
      }, 30000);
    } catch (error) {
      console.error("Microphone error:", error);
      alert("Could not access microphone. Please check permissions.");
    }
  };

  const handleStopVoiceRecording = () => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation: Check if voice sample is recorded
    if (!voiceBlob) {
      Swal.fire({
        icon: "warning",
        title: "Voice Sample Required",
        text: "Please record your voice sample for fingerprint identification!",
      });

      // Mark all fields as touched
      const allTouched = {};
      Object.keys(formData).forEach((key) => {
        allTouched[key] = true;
      });
      setTouched(allTouched);

      // alert(
      // "⚠️ Please record your voice sample for fingerprint identification!"
      // );
      // Scroll to voice section
      document
        .getElementById("voice-section")
        ?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Validation: Check required fields
    if (formData.availability.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "Availability Required",
        text: "Please select at least one available day!",
      });

      //alert("Please select at least one available day!");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for multipart/form-data
      const registrationData = new FormData();

      // Add voice file
      registrationData.append("file", voiceBlob, "voice_sample.webm");

      // Generate doctor_id from email
      const doctorId = `dr_${formData.email
        .split("@")[0]
        .replace(/[^a-zA-Z0-9]/g, "_")}`;

      // Add all form fields
      registrationData.append("doctor_id", doctorId);
      // registrationData.append(
      //   "name",
      //   `${formData.firstName} ${formData.lastName}`
      // );
      registrationData.append("email", formData.email);
      registrationData.append("phone", formData.phone);
      registrationData.append("specialization", formData.specialization);
      registrationData.append(
        "hospital",
        formData.currentHospital || "Not specified"
      );
      registrationData.append("password", formData.password);
      registrationData.append("address", formData.address);
      registrationData.append("city", formData.city);
      registrationData.append("state", formData.state);
      registrationData.append("zip_code", formData.zipCode);
      registrationData.append("country", formData.country);
      registrationData.append("date_of_birth", formData.dateOfBirth);
      registrationData.append("gender", formData.gender);
      registrationData.append("medical_degree", formData.medicalDegree);
      registrationData.append("university", formData.university);
      registrationData.append("graduation_year", formData.graduationYear);
      registrationData.append("medical_license", formData.medicalLicense);
      registrationData.append("license_state", formData.licenseState);
      registrationData.append("license_expiry", formData.licenseExpiry);
      registrationData.append("sub_specialization", formData.subSpecialization);
      registrationData.append("experience", formData.experience);
      registrationData.append("consultation_fee", formData.consultationFee);
      registrationData.append(
        "availability",
        JSON.stringify(formData.availability)
      );
      registrationData.append("languages", JSON.stringify(selectedLanguages));
      registrationData.append("bio", formData.bio);
      registrationData.append("role", "doctor");
      registrationData.append("status", "pending");
      registrationData.append("firstName", formData.firstName);
      registrationData.append("lastName", formData.lastName);

      // Send to backend
      const response = await fetch(`${endpoint}/api/doctors/register-doctor`, {
        method: "POST",
        body: registrationData,
      });

      const result = await response.json();

      if (result.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Registration Successful",
          html: `Doctor ID: <strong>${doctorId}</strong><br/>Voice fingerprint created successfully!`,
        });
        //  alert(
        //  `✅ Registration Successful!\n\nDoctor ID: ${doctorId}\nVoice fingerprint created successfully!`
        //  );
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
      // alert(`❌ Registration Failed\n\n${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r bg-hero-gradient px-8 py-6">
            <h1 className="text-3xl font-bold text-white">
              Doctor Registration
            </h1>
            <p className="text-blue-100 mt-2">
              Join our healthcare network with voice fingerprint authentication
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            {/* Personal Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <User className="mr-3 text-blue-600" size={28} />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border ${
                      errors.firstName && touched.firstName
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                    placeholder="John"
                  />
                  {errors.firstName && touched.firstName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border ${
                      errors.lastName && touched.lastName
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                    placeholder="Doe"
                  />
                  {errors.lastName && touched.lastName && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Mail className="mr-2 text-gray-500" size={16} />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border ${
                      errors.email && touched.email
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                    placeholder="john.doe@example.com"
                  />
                  {errors.email && touched.email && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Phone className="mr-2 text-gray-500" size={16} />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border ${
                      errors.phone && touched.phone
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                    placeholder="+1 (555) 123-4567"
                  />
                  {errors.phone && touched.phone && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Calendar className="mr-2 text-gray-500" size={16} />
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    max={new Date().toISOString().split("T")[0]}
                    className={`w-full px-4 py-3 border ${
                      errors.dateOfBirth && touched.dateOfBirth
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                  />
                  {errors.dateOfBirth && touched.dateOfBirth && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.dateOfBirth}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border ${
                      errors.gender && touched.gender
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  {errors.gender && touched.gender && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.gender}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div
                  className={`flex items-center w-full px-4 py-3 border ${
                    errors.password && touched.password
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition`}
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter strong password"
                    className="flex-1 bg-transparent outline-none"
                  />
                  {showPassword ? (
                    <EyeOff
                      size={20}
                      className="cursor-pointer text-gray-600"
                      onClick={() => setShowPassword(false)}
                    />
                  ) : (
                    <Eye
                      size={20}
                      className="cursor-pointer text-gray-600"
                      onClick={() => setShowPassword(true)}
                    />
                  )}
                </div>
                {errors.password && touched.password && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.password}
                  </p>
                )}
                <p className="mt-2 text-xs text-gray-500">
                  Password must be 8+ characters with uppercase, lowercase,
                  number, and special character
                </p>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <div
                  className={`flex items-center w-full px-4 py-3 border ${
                    errors.confirmPassword && touched.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-lg focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition`}
                >
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Re-enter password"
                    className="flex-1 bg-transparent outline-none"
                  />
                  {showConfirmPassword ? (
                    <EyeOff
                      size={20}
                      className="cursor-pointer text-gray-600"
                      onClick={() => setShowConfirmPassword(false)}
                    />
                  ) : (
                    <Eye
                      size={20}
                      className="cursor-pointer text-gray-600"
                      onClick={() => setShowConfirmPassword(true)}
                    />
                  )}
                </div>
                {errors.confirmPassword && touched.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </section>

            {/* Address Information */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <MapPin className="mr-3 text-blue-600" size={28} />
                Address Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border ${
                      errors.address && touched.address
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                    placeholder="123 Main Street"
                  />
                  {errors.address && touched.address && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.address}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border ${
                      errors.city && touched.city
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                    placeholder="New York"
                  />
                  {errors.city && touched.city && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border ${
                      errors.state && touched.state
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                    placeholder="NY"
                  />
                  {errors.state && touched.state && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.state}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-4 py-3 border ${
                      errors.zipCode && touched.zipCode
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition`}
                    placeholder="10001"
                  />
                  {errors.zipCode && touched.zipCode && (
                    <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.zipCode}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="United States"
                  />
                </div>
              </div>
            </section>

            {/* Medical Qualifications */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <GraduationCap className="mr-3 text-blue-600" size={28} />
                Medical Qualifications
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medical Degree *
                  </label>
                  <input
                    type="text"
                    name="medicalDegree"
                    required
                    value={formData.medicalDegree}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="MD, MBBS, DO"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    University *
                  </label>
                  <input
                    type="text"
                    name="university"
                    required
                    value={formData.university}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Harvard Medical School"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Graduation Year *
                  </label>
                  <input
                    type="number"
                    name="graduationYear"
                    required
                    value={formData.graduationYear}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="2015"
                    min="1950"
                    max="2025"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Shield className="mr-2 text-gray-500" size={16} />
                    Medical License Number *
                  </label>
                  <input
                    type="text"
                    name="medicalLicense"
                    required
                    value={formData.medicalLicense}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="ML123456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License State *
                  </label>
                  <input
                    type="text"
                    name="licenseState"
                    required
                    value={formData.licenseState}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    License Expiry Date *
                  </label>
                  <input
                    type="date"
                    name="licenseExpiry"
                    required
                    value={formData.licenseExpiry}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
              </div>
            </section>

            {/* Professional Details */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Briefcase className="mr-3 text-blue-600" size={28} />
                Professional Details
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Award className="mr-2 text-gray-500" size={16} />
                    Specialization *
                  </label>
                  <select
                    name="specialization"
                    required
                    value={formData.specialization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
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
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sub-Specialization
                  </label>
                  <input
                    type="text"
                    name="subSpecialization"
                    value={formData.subSpecialization}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Interventional Cardiology"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Years of Experience *
                  </label>
                  <input
                    type="number"
                    name="experience"
                    required
                    value={formData.experience}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="10"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Hospital/Clinic
                  </label>
                  <input
                    type="text"
                    name="currentHospital"
                    value={formData.currentHospital}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="City General Hospital"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <DollarSign className="mr-2 text-gray-500" size={16} />
                    Consultation Fee (USD) *
                  </label>
                  <input
                    type="number"
                    name="consultationFee"
                    required
                    value={formData.consultationFee}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="150"
                    min="0"
                  />
                </div>
              </div>
            </section>

            {/* ============================================ */}
            {/* VOICE FINGERPRINT SECTION - NEW! */}
            {/* ============================================ */}
            <section
              id="voice-section"
              className="border-4 border-blue-200 rounded-xl p-6 bg-blue-50"
            >
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center">
                <Mic className="mr-3 text-blue-600" size={28} />
                Voice Fingerprint Authentication *
              </h2>
              <p className="text-sm text-gray-600 mb-6">
                Record a 10-30 second voice sample for automatic identification
                in patient conversations. This helps our system recognize you as
                the doctor in transcriptions.
              </p>

              {/* Voice Recording Instructions */}
              <div className="bg-white rounded-lg p-4 mb-6 border border-blue-200">
                <h3 className="font-semibold text-gray-800 mb-2 flex items-center">
                  <AlertCircle className="mr-2 text-blue-600" size={20} />
                  Recording Instructions:
                </h3>
                <p className="text-sm text-gray-700 mb-3">
                  Please read the following text clearly, or speak naturally
                  about your medical practice:
                </p>
                <div className="bg-blue-50 p-4 rounded border border-blue-200 text-sm text-gray-800 leading-relaxed">
                  "Hello, my name is Dr. {formData.firstName || "[Your Name]"}.
                  I am a {formData.specialization || "medical"} specialist at{" "}
                  {formData.currentHospital || "[Your Hospital]"}. I am
                  registering my voice for patient consultation transcription
                  services to ensure accurate identification during medical
                  conversations."
                </div>
              </div>

              {/* Recording Controls */}
              <div className="space-y-4">
                {voiceStatus === "pending" && (
                  <div className="flex flex-col items-center gap-4">
                    <button
                      type="button"
                      onClick={handleStartVoiceRecording}
                      className="px-8 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition font-semibold shadow-lg flex items-center gap-3 text-lg"
                    >
                      <Mic size={24} />
                      Start Voice Recording
                    </button>
                    <p className="text-xs text-gray-500">
                      Click to begin recording (10-30 seconds recommended)
                    </p>
                  </div>
                )}

                {voiceStatus === "recording" && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="flex items-center gap-4 bg-red-50 border-2 border-red-300 rounded-xl px-8 py-4">
                      <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
                      <span className="text-2xl font-mono font-bold text-red-700">
                        {formatTime(recordingTime)}
                      </span>
                      <span className="text-sm text-red-600">
                        (Max: 30 seconds)
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleStopVoiceRecording}
                      className="px-8 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition font-semibold flex items-center gap-2"
                    >
                      <Square size={20} />
                      Stop Recording
                    </button>
                    <p className="text-sm text-gray-600 animate-pulse">
                      🎙️ Recording in progress... Speak clearly!
                    </p>
                  </div>
                )}

                {voiceStatus === "recorded" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center gap-3 bg-green-50 border-2 border-green-300 rounded-xl px-6 py-4">
                      <CheckCircle className="text-green-600" size={24} />
                      <span className="font-semibold text-green-700">
                        Voice Sample Recorded Successfully!
                      </span>
                    </div>

                    {/* Audio Player */}
                    <div className="bg-white rounded-lg p-4 border border-gray-300">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Preview Your Recording:
                      </p>
                      <audio controls src={voiceURL} className="w-full">
                        Your browser does not support audio playback.
                      </audio>
                      <p className="text-xs text-gray-500 mt-2">
                        Duration: {formatTime(recordingTime)} | Size:{" "}
                        {voiceBlob ? (voiceBlob.size / 1024).toFixed(2) : 0} KB
                      </p>
                    </div>

                    <div className="flex gap-3 justify-center">
                      <button
                        type="button"
                        onClick={handleRetakeVoice}
                        className="px-6 py-2 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 transition font-medium flex items-center gap-2"
                      >
                        <Mic size={18} />
                        Re-record Voice
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Voice Status Indicator */}
              <div className="mt-6 p-4 bg-white rounded-lg border border-gray-300">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Voice Fingerprint Status:
                  </span>
                  {voiceStatus === "pending" && (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium">
                      ⚠️ Required
                    </span>
                  )}
                  {voiceStatus === "recording" && (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium animate-pulse">
                      🎙️ Recording...
                    </span>
                  )}
                  {voiceStatus === "recorded" && (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      ✅ Completed
                    </span>
                  )}
                </div>
              </div>
            </section>

            {/* Availability & Languages */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <Clock className="mr-3 text-blue-600" size={28} />
                Availability & Languages
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Available Days *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {days.map((day) => (
                      <label
                        key={day}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.availability.some(
                            (a) => a.day === day
                          )}
                          onChange={() => handleAvailabilityChange(day)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
                {formData.availability.map((a, index) => (
                  <div key={a.day} className="flex items-center gap-4">
                    <span className="w-20 font-medium">{a.day}:</span>
                    <input
                      type="time"
                      value={a.from}
                      onChange={(e) =>
                        handleTimeChange(index, "from", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={a.to}
                      onChange={(e) =>
                        handleTimeChange(index, "to", e.target.value)
                      }
                      className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Languages Spoken
                  </label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={languageInput}
                      onChange={(e) => setLanguageInput(e.target.value)}
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addLanguage())
                      }
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder="e.g., English, Spanish, Urdu"
                    />
                    <button
                      type="button"
                      onClick={addLanguage}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedLanguages.map((lang) => (
                      <span
                        key={lang}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm flex items-center gap-2"
                      >
                        {lang}
                        <button
                          type="button"
                          onClick={() => removeLanguage(lang)}
                          className="hover:text-blue-900"
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Bio */}
            <section>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                <FileText className="mr-3 text-blue-600" size={28} />
                Professional Bio
              </h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About You *
                </label>
                <textarea
                  name="bio"
                  required
                  value={formData.bio}
                  onChange={handleChange}
                  rows="6"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  placeholder="Tell us about your medical experience, expertise, and what drives your passion for healthcare..."
                />
              </div>
            </section>

            {/* Submit Button */}
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || voiceStatus !== "recorded"}
                className={`px-8 py-3 rounded-lg transition font-medium shadow-lg flex items-center gap-2 ${
                  isSubmitting || voiceStatus !== "recorded"
                    ? "bg-gray-400 cursor-not-allowed"
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
                    <CheckCircle size={20} />
                    Complete Registration
                  </>
                )}
              </button>
            </div>

            {/* Warning if voice not recorded */}
            {voiceStatus !== "recorded" && (
              <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle
                  className="text-yellow-600 flex-shrink-0 mt-1"
                  size={20}
                />
                <div>
                  <p className="font-semibold text-yellow-800">
                    Voice Fingerprint Required
                  </p>
                  <p className="text-sm text-yellow-700 mt-1">
                    Please record your voice sample to complete registration.
                    This is required for automatic doctor identification in
                    patient consultations.
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