"use client";
import { useEffect, useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Clock,
  DollarSign,
  Save,
  Edit2,
  Camera,
  Lock,
  Bell,
  Shield,
  Eye,
  EyeOff,
  X,
  Plus,
  Building,
  FileText,
  Languages,
} from "lucide-react";
import Swal from "sweetalert2";
import { get } from "http";

export default function DoctorProfileSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [languageInput, setLanguageInput] = useState("");

  const tabs = [
    { id: "profile", name: "Personal Information", icon: User },
    { id: "contact", name: "Contact Information", icon: Phone },
    { id: "professional", name: "Professional Details", icon: Briefcase },
    { id: "account", name: "Account & Security", icon: Shield },
    { id: "privacy", name: "Privacy & Data Sharing", icon: Eye },
    { id: "notifications", name: "Notifications", icon: Bell },
  ];

  const [doctorData, setDoctorData] = useState({
    // Personal Information
    firstName: "",
    lastName: "",
    title: "",
    gender: "",
    dateOfBirth: "",
    bloodGroup: "",
    languages: [""],
    bio: "",

    // Contact Information
    email: "",
    phone: "",
    alternatePhone: "",
    address: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",

    // Professional Details
    specialization: "",
    subSpecialization: "",
    licenseNumber: "",
    licenseState: "",
    licenseExpiry: "",
    medicalDegree: "",
    additionalDegrees: "",
    university: "",
    graduationYear: "2005",
    experience: "15",
    currentHospital: "City Medical Center",
    consultationFee: "2000",
    availableFrom: "09:00",
    availableTo: "17:00",
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],

    // Account & Security
    username: "dr_ahmed_hassan",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    twoFactorAuth: true,

    // Privacy Settings
    profileVisibility: "public",
    shareDataWithResearch: false,
    allowPatientReviews: true,
    showContactInfo: true,

    // Notification Settings
    emailNotifications: true,
    smsNotifications: true,
    appointmentReminders: true,
    labReportAlerts: true,
    newPatientAlerts: true,
  });
  const endpoint = process.env.NEXT_PUBLIC_BACKEND_URL;

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${endpoint}/api/auth/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await response.json();
        console.log("Doctor Profile:", result);

        if (result.status === "success") {
          const doc = result.data;
          console.log("Doctor Data:", doc);
          setDoctorData((prevData) => ({
            ...prevData, // keep existing dummy/default values
            ...result.data, // overwrite with backend values where available
          }));
        }
      } catch (error) {
        console.log("Error fetching doctor:", error);
      }
    };

    fetchDoctorProfile();
  }, []);

  const handleInputChange = (field, value) => {
    setDoctorData((prev) => ({ ...prev, [field]: value }));
  };

  const addLanguage = () => {
    if (
      languageInput.trim() &&
      !doctorData.languages.includes(languageInput.trim())
    ) {
      setDoctorData((prev) => ({
        ...prev,
        languages: [...prev.languages, languageInput.trim()],
      }));
      setLanguageInput("");
    }
  };

  const removeLanguage = (lang) => {
    setDoctorData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== lang),
    }));
  };

  const handleSave = async () => {
    console.log("Saving data:", doctorData);
    const response = await fetch(`${endpoint}/api/doctors/update/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(doctorData),
    });
    setIsEditing(false);
    const data = await response.json();
    if (data.status === "success") {
      Swal.fire({
        icon: "success",
        title: "Success",
        text: "Your changes have been saved successfully!",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "There was an error saving your changes. Please try again.",
      });
    }
    //alert("Changes saved successfully!");
  };

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="flex items-start gap-6 mb-8 pb-6 border-b border-gray-200">
        <div className="relative">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-4xl font-bold shadow-lg">
            {doctorData.firstName.charAt(0)}
            {doctorData.lastName.charAt(0)}
          </div>
          {isEditing && (
            <button className="absolute bottom-0 right-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors shadow-lg">
              <Camera className="w-5 h-5" />
            </button>
          )}
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900">
            {doctorData.title} {doctorData.firstName} {doctorData.lastName}
          </h3>
          <p className="text-lg text-gray-600 mt-1">
            {doctorData.specialization}
          </p>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
            <Award className="w-4 h-4" />
            {doctorData.licenseNumber}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
              {doctorData.experience} Years Experience
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Title
          </label>
          <select
            value={doctorData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          >
            <option value="Dr.">Dr.</option>
            <option value="Prof.">Prof.</option>
            <option value="Assoc. Prof.">Assoc. Prof.</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            First Name *
          </label>
          <input
            type="text"
            value={doctorData.firstName}
            onChange={(e) => handleInputChange("firstName", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            value={doctorData.lastName}
            onChange={(e) => handleInputChange("lastName", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Gender *
          </label>
          <select
            value={doctorData.gender}
            onChange={(e) => handleInputChange("gender", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          >
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            Date of Birth *
          </label>
          <input
            type="date"
            value={doctorData.dateOfBirth}
            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Blood Group
          </label>
          <select
            value={doctorData.bloodGroup}
            onChange={(e) => handleInputChange("bloodGroup", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          >
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>O+</option>
            <option>O-</option>
            <option>AB+</option>
            <option>AB-</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Languages className="w-4 h-4 text-gray-500" />
            Languages Spoken
          </label>
          {isEditing ? (
            <>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addLanguage())
                  }
                  placeholder="Add a language"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addLanguage}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : null}
          <div className="flex flex-wrap gap-2">
            {doctorData.languages.map((lang, idx) => (
              <span
                key={idx}
                className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2"
              >
                {lang}
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => removeLanguage(lang)}
                    className="hover:text-blue-900"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-gray-500" />
            Professional Bio
          </label>
          <textarea
            value={doctorData.bio}
            onChange={(e) => handleInputChange("bio", e.target.value)}
            disabled={!isEditing}
            rows="4"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600 resize-none"
            placeholder="Tell patients about your experience and expertise..."
          />
        </div>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            Email Address *
          </label>
          <input
            type="email"
            value={doctorData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" />
            Primary Phone *
          </label>
          <input
            type="tel"
            value={doctorData.phone}
            onChange={(e) => handleInputChange("phone", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Alternate Phone
          </label>
          <input
            type="tel"
            value={doctorData.alternatePhone}
            onChange={(e) =>
              handleInputChange("alternatePhone", e.target.value)
            }
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            Street Address *
          </label>
          <input
            type="text"
            value={doctorData.address}
            onChange={(e) => handleInputChange("address", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            City *
          </label>
          <input
            type="text"
            value={doctorData.city}
            onChange={(e) => handleInputChange("city", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            State/Province *
          </label>
          <input
            type="text"
            value={doctorData.state}
            onChange={(e) => handleInputChange("state", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Country *
          </label>
          <input
            type="text"
            value={doctorData.country}
            onChange={(e) => handleInputChange("country", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Postal Code *
          </label>
          <input
            type="text"
            value={doctorData.postalCode}
            onChange={(e) => handleInputChange("postalCode", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>
      </div>
    </div>
  );

  const renderProfessionalDetails = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-gray-500" />
            Specialization *
          </label>
          <select
            value={doctorData.specialization}
            onChange={(e) =>
              handleInputChange("specialization", e.target.value)
            }
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          >
            <option value="Cardiologist">Cardiologist</option>
            <option value="Dermatologist">Dermatologist</option>
            <option value="Neurologist">Neurologist</option>
            <option value="Pediatrician">Pediatrician</option>
            <option value="Orthopedic">Orthopedic Surgeon</option>
            <option value="Psychiatrist">Psychiatrist</option>
            <option value="General">General Physician</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Sub-Specialization
          </label>
          <input
            type="text"
            value={doctorData.subSpecialization}
            onChange={(e) =>
              handleInputChange("subSpecialization", e.target.value)
            }
            disabled={!isEditing}
            placeholder="e.g., Interventional Cardiology"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Award className="w-4 h-4 text-gray-500" />
            Medical License Number *
          </label>
          <input
            type="text"
            value={doctorData.licenseNumber}
            onChange={(e) => handleInputChange("licenseNumber", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            License State/Province *
          </label>
          <input
            type="text"
            value={doctorData.licenseState}
            onChange={(e) => handleInputChange("licenseState", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            License Expiry Date *
          </label>
          <input
            type="date"
            value={doctorData.licenseExpiry}
            onChange={(e) => handleInputChange("licenseExpiry", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-gray-500" />
            Medical Degree *
          </label>
          <input
            type="text"
            value={doctorData.medicalDegree}
            onChange={(e) => handleInputChange("medicalDegree", e.target.value)}
            disabled={!isEditing}
            placeholder="MBBS, MD, DO"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Additional Qualifications
          </label>
          <input
            type="text"
            value={doctorData.additionalDegrees}
            onChange={(e) =>
              handleInputChange("additionalDegrees", e.target.value)
            }
            disabled={!isEditing}
            placeholder="FCPS, MRCP, etc."
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            University *
          </label>
          <input
            type="text"
            value={doctorData.university}
            onChange={(e) => handleInputChange("university", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Graduation Year *
          </label>
          <input
            type="number"
            value={doctorData.graduationYear}
            onChange={(e) =>
              handleInputChange("graduationYear", e.target.value)
            }
            disabled={!isEditing}
            min="1950"
            max="2025"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Years of Experience *
          </label>
          <input
            type="number"
            value={doctorData.experience}
            onChange={(e) => handleInputChange("experience", e.target.value)}
            disabled={!isEditing}
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Building className="w-4 h-4 text-gray-500" />
            Current Hospital/Clinic
          </label>
          <input
            type="text"
            value={doctorData.currentHospital}
            onChange={(e) =>
              handleInputChange("currentHospital", e.target.value)
            }
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            Consultation Fee (Rs.) *
          </label>
          <input
            type="number"
            value={doctorData.consultationFee}
            onChange={(e) =>
              handleInputChange("consultationFee", e.target.value)
            }
            disabled={!isEditing}
            min="0"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            Available From
          </label>
          <input
            type="time"
            value={doctorData.availableFrom}
            onChange={(e) => handleInputChange("availableFrom", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-500" />
            Available To
          </label>
          <input
            type="time"
            value={doctorData.availableTo}
            onChange={(e) => handleInputChange("availableTo", e.target.value)}
            disabled={!isEditing}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50 disabled:text-gray-600"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 mb-3">
            Working Days *
          </label>
          <div className="flex flex-wrap gap-3">
            {[
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday",
            ].map((day) => (
              <button
                key={day}
                onClick={() => {
                  if (!isEditing) return;
                  const days = [...doctorData.workingDays];
                  const index = days.indexOf(day);
                  if (index > -1) {
                    days.splice(index, 1);
                  } else {
                    days.push(day);
                  }
                  handleInputChange("workingDays", days);
                }}
                disabled={!isEditing}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  doctorData.workingDays.includes(day)
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700"
                } ${
                  !isEditing
                    ? "cursor-not-allowed opacity-60"
                    : "cursor-pointer hover:opacity-90"
                }`}
              >
                {day.substring(0, 3)}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderAccountSecurity = () => (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="font-semibold mb-1">Keep Your Account Secure</p>
            <p>
              Use a strong password and enable two-factor authentication for
              added security.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Username
          </label>
          <input
            type="text"
            value={doctorData.username}
            disabled
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
          />
          <p className="text-xs text-gray-500 mt-1">
            Username cannot be changed
          </p>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Current Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={doctorData.currentPassword}
              onChange={(e) =>
                handleInputChange("currentPassword", e.target.value)
              }
              placeholder="Enter current password"
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={doctorData.newPassword}
              onChange={(e) => handleInputChange("newPassword", e.target.value)}
              placeholder="Enter new password"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Confirm New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={doctorData.confirmPassword}
              onChange={(e) =>
                handleInputChange("confirmPassword", e.target.value)
              }
              placeholder="Confirm new password"
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">
                Two-Factor Authentication
              </h4>
              <p className="text-sm text-gray-600">
                Add an extra layer of security to your account
              </p>
            </div>
            <button
              onClick={() =>
                handleInputChange("twoFactorAuth", !doctorData.twoFactorAuth)
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                doctorData.twoFactorAuth ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  doctorData.twoFactorAuth ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          Update Password
        </button>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="font-semibold text-gray-900">
                Profile Visibility
              </h4>
              <p className="text-sm text-gray-600">
                Control who can see your profile
              </p>
            </div>
          </div>
          <select
            value={doctorData.profileVisibility}
            onChange={(e) =>
              handleInputChange("profileVisibility", e.target.value)
            }
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="public">Public - Everyone can see</option>
            <option value="patients">Patients Only</option>
            <option value="private">Private - Only me</option>
          </select>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">
                Show Contact Information
              </h4>
              <p className="text-sm text-gray-600">
                Allow patients to see your phone and email
              </p>
            </div>
            <button
              onClick={() =>
                handleInputChange(
                  "showContactInfo",
                  !doctorData.showContactInfo
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                doctorData.showContactInfo ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  doctorData.showContactInfo ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">
                Allow Patient Reviews
              </h4>
              <p className="text-sm text-gray-600">
                Let patients leave reviews on your profile
              </p>
            </div>
            <button
              onClick={() =>
                handleInputChange(
                  "allowPatientReviews",
                  !doctorData.allowPatientReviews
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                doctorData.allowPatientReviews ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  doctorData.allowPatientReviews
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-900">
                Share Data for Research
              </h4>
              <p className="text-sm text-gray-600">
                Help improve healthcare by sharing anonymous data
              </p>
            </div>
            <button
              onClick={() =>
                handleInputChange(
                  "shareDataWithResearch",
                  !doctorData.shareDataWithResearch
                )
              }
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                doctorData.shareDataWithResearch ? "bg-blue-600" : "bg-gray-300"
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  doctorData.shareDataWithResearch
                    ? "translate-x-6"
                    : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" />
        Save Privacy Settings
      </button>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-4">
      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-600">Receive updates via email</p>
          </div>
          <button
            onClick={() =>
              handleInputChange(
                "emailNotifications",
                !doctorData.emailNotifications
              )
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              doctorData.emailNotifications ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                doctorData.emailNotifications
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">SMS Notifications</h4>
            <p className="text-sm text-gray-600">Receive text message alerts</p>
          </div>
          <button
            onClick={() =>
              handleInputChange(
                "smsNotifications",
                !doctorData.smsNotifications
              )
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              doctorData.smsNotifications ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                doctorData.smsNotifications ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">
              Appointment Reminders
            </h4>
            <p className="text-sm text-gray-600">
              Get notified about upcoming appointments
            </p>
          </div>
          <button
            onClick={() =>
              handleInputChange(
                "appointmentReminders",
                !doctorData.appointmentReminders
              )
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              doctorData.appointmentReminders ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                doctorData.appointmentReminders
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">Lab Report Alerts</h4>
            <p className="text-sm text-gray-600">
              Notification when lab reports are ready
            </p>
          </div>
          <button
            onClick={() =>
              handleInputChange("labReportAlerts", !doctorData.labReportAlerts)
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              doctorData.labReportAlerts ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                doctorData.labReportAlerts ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="border border-gray-200 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold text-gray-900">New Patient Alerts</h4>
            <p className="text-sm text-gray-600">
              Get notified when new patients register
            </p>
          </div>
          <button
            onClick={() =>
              handleInputChange(
                "newPatientAlerts",
                !doctorData.newPatientAlerts
              )
            }
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              doctorData.newPatientAlerts ? "bg-blue-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                doctorData.newPatientAlerts ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      <button
        onClick={handleSave}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" />
        Save Notification Settings
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Profile & Settings
          </h1>
          <p className="text-gray-600">
            Manage your profile information and preferences
          </p>
        </div>
        <div className="lg:col-span-3 mb-5">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-4 sticky top-6">
            <nav className="flex gap-2 overflow-x-auto  p-5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === tab.id
                        ? "bg-blue-600 text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
        <div className="">
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {tabs.find((t) => t.id === activeTab)?.name}
                </h2>
                {activeTab !== "account" &&
                  activeTab !== "privacy" &&
                  activeTab !== "notifications" && (
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                        isEditing
                          ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      <Edit2 className="w-4 h-4" />
                      {isEditing ? "Cancel" : "Edit"}
                    </button>
                  )}
              </div>

              <div>
                {activeTab === "profile" && renderPersonalInfo()}
                {activeTab === "contact" && renderContactInfo()}
                {activeTab === "professional" && renderProfessionalDetails()}
                {activeTab === "account" && renderAccountSecurity()}
                {activeTab === "privacy" && renderPrivacySettings()}
                {activeTab === "notifications" && renderNotifications()}
              </div>

              {isEditing && (
                <div className="mt-6 pt-6 border-t border-gray-200 flex gap-3 justify-end">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
