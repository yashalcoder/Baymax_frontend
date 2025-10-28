// "use client"
// import { useState } from "react"

// export default function SignupPage() {
//   const [role, setRole] = useState("patient")

//   return (
//     <main className="min-h-[88vh] bg-soft flex items-center justify-center px-4 py-16">
//       <div className="w-full max-w-xl card p-6 md:p-8">
//         <div className="flex flex-col items-center text-center gap-3">
//           <img src="/images/auth-hero.png" alt="BayMax+ preview" className="h-16 w-auto object-contain" />
//           <h1 className="text-3xl font-semibold">Create Account</h1>
//           <p className="text-muted-foreground">Join BayMax+ for better healthcare management</p>
//         </div>

//         <div
//           className="mt-5 grid grid-cols-2 gap-2 p-1 rounded-lg border bg-background"
//           role="tablist"
//           aria-label="Select role"
//         >
//           <button
//             type="button"
//             role="tab"
//             aria-selected={role === "patient"}
//             onClick={() => setRole("patient")}
//             className={`px-4 py-2 rounded-md text-sm font-medium ${role === "patient" ? "bg-secondary" : ""}`}
//           >
//             Patient
//           </button>
//           <button
//             type="button"
//             role="tab"
//             aria-selected={role === "doctor"}
//             onClick={() => setRole("doctor")}
//             className={`px-4 py-2 rounded-md text-sm font-medium ${role === "doctor" ? "bg-secondary" : ""}`}
//           >
//             Doctor
//           </button>
//         </div>

//         <form className="mt-6 space-y-4" onSubmit={(e) => e.preventDefault()} aria-label="Create account form">
//           <div>
//             <label htmlFor="name" className="block text-sm font-medium mb-1">
//               Full Name
//             </label>
//             <input
//               id="name"
//               type="text"
//               required
//               className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
//               placeholder="Enter your name"
//             />
//           </div>
//           <div>
//             <label htmlFor="email" className="block text-sm font-medium mb-1">
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               required
//               className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
//               placeholder="your@email.com"
//             />
//           </div>
//           <div>
//             <label htmlFor="password" className="block text-sm font-medium mb-1">
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               required
//               className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
//               placeholder="Create a password"
//             />
//           </div>
//           <div>
//             <label htmlFor="confirm" className="block text-sm font-medium mb-1">
//               Confirm Password
//             </label>
//             <input
//               id="confirm"
//               type="password"
//               required
//               className="w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-brand"
//               placeholder="Confirm your password"
//             />
//           </div>
//           <button
//             type="submit"
//             className="w-full px-4 py-3 rounded-md bg-brand text-white font-medium hover:opacity-90"
//           >
//             Create Account
//           </button>
//         </form>
//       </div>
//     </main>
//   )
// }
"use client";
import { useState } from "react";
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
  Camera,
  Plus,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function DoctorRegistration() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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
    profilePhoto: null,
  });

  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [languageInput, setLanguageInput] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvailabilityChange = (day) => {
    setFormData((prev) => ({
      ...prev,
      availability: prev.availability.includes(day)
        ? prev.availability.filter((d) => d !== day)
        : [...prev.availability, day],
    }));
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalData = { ...formData, languages: selectedLanguages };
    console.log("Registration Data:", finalData);
    alert("Registration submitted successfully! Check console for details.");
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
          <div className="bg-hero-gradient to-indigo-600 px-8 py-6">
            <h1 className="text-3xl font-bold text-white">
              Doctor Registration
            </h1>
            <p className="text-blue-100 mt-2">Join our healthcare network</p>
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
                    required
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Mail className="mr-2 text-gray-500" size={16} />
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="john.doe@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Phone className="mr-2 text-gray-500" size={16} />
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alternate Phone
                  </label>
                  <input
                    type="tel"
                    name="alternatePhone"
                    value={formData.alternatePhone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="+1 (555) 987-6543"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                    <Calendar className="mr-2 text-gray-500" size={16} />
                    Date of Birth *
                  </label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    required
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gender *
                  </label>
                  <select
                    name="gender"
                    required
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
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
                    required
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="123 Main Street"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="NY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ZIP Code *
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    required
                    value={formData.zipCode}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    placeholder="10001"
                  />
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
                          checked={formData.availability.includes(day)}
                          onChange={() => handleAvailabilityChange(day)}
                          className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-700">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>
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
                      placeholder="e.g., English, Spanish"
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
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={() => router.push("/login")}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition font-medium shadow-lg"
              >
                Complete Registration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
