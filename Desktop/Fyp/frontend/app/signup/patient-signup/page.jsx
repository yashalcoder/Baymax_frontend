"use client";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Droplet,
  AlertTriangle,
  Lock,
  CreditCard,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Image from "next/image";
import SignupImg from "@/public/signup.avif";
import { Eye, EyeOff } from "lucide-react";

// Disease taxonomy with types
const diseaseOptions = {
  Cancer: [
    "Lung Cancer",
    "Breast Cancer",
    "Prostate Cancer",
    "Colon Cancer",
    "Skin Cancer",
    "Leukemia",
    "Lymphoma",
    "Brain Cancer",
  ],
  Diabetes: [
    "Type 1 Diabetes",
    "Type 2 Diabetes",
    "Gestational Diabetes",
    "Prediabetes",
  ],
  "Heart Disease": [
    "Coronary Artery Disease",
    "Heart Failure",
    "Arrhythmia",
    "Valvular Heart Disease",
    "Cardiomyopathy",
  ],
  Asthma: [
    "Allergic Asthma",
    "Non-allergic Asthma",
    "Exercise-induced Asthma",
    "Occupational Asthma",
  ],
  Hypertension: [
    "Primary Hypertension",
    "Secondary Hypertension",
    "Pulmonary Hypertension",
  ],
  "Kidney Disease": [
    "Chronic Kidney Disease",
    "Acute Kidney Injury",
    "Polycystic Kidney Disease",
    "Kidney Stones",
  ],
  "Liver Disease": [
    "Fatty Liver Disease",
    "Hepatitis",
    "Cirrhosis",
    "Liver Cancer",
  ],
  "Thyroid Disorders": [
    "Hypothyroidism",
    "Hyperthyroidism",
    "Thyroid Nodules",
    "Thyroid Cancer",
  ],
  Arthritis: [
    "Osteoarthritis",
    "Rheumatoid Arthritis",
    "Psoriatic Arthritis",
    "Gout",
  ],
  COPD: ["Chronic Bronchitis", "Emphysema"],
  Stroke: ["Ischemic Stroke", "Hemorrhagic Stroke", "TIA (Mini-stroke)"],
  Epilepsy: ["Focal Epilepsy", "Generalized Epilepsy", "Absence Seizures"],
  "Mental Health": [
    "Depression",
    "Anxiety Disorder",
    "Bipolar Disorder",
    "Schizophrenia",
    "PTSD",
    "OCD",
  ],
  "Autoimmune Diseases": [
    "Lupus",
    "Multiple Sclerosis",
    "Crohn's Disease",
    "Ulcerative Colitis",
    "Celiac Disease",
  ],
  Tuberculosis: ["Pulmonary TB", "Extrapulmonary TB", "Latent TB"],
  Hepatitis: [
    "Hepatitis A",
    "Hepatitis B",
    "Hepatitis C",
    "Hepatitis D",
    "Hepatitis E",
  ],
};

// Common allergies
const allergyOptions = [
  "Pollen",
  "Dust Mites",
  "Pet Dander",
  "Mold",
  "Penicillin",
  "Aspirin",
  "Sulfa Drugs",
  "Peanuts",
  "Tree Nuts",
  "Milk",
  "Eggs",
  "Wheat",
  "Soy",
  "Fish",
  "Shellfish",
  "Latex",
  "Insect Stings",
  "Nickel",
];

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

export default function PatientSignup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    cnic: "",
    gender: "",
    address: "",
    password: "",
    confirmPassword: "",
    allergies: "",
    bloodGroup: "",
    majorDisease: "",
  });

  const [diseaseSearch, setDiseaseSearch] = useState("");
  const [showDiseaseDropdown, setShowDiseaseDropdown] = useState(false);
  const [diseaseSubTypes, setDiseaseSubTypes] = useState([]);

  const [allergySearch, setAllergySearch] = useState("");
  const [showAllergyDropdown, setShowAllergyDropdown] = useState(false);

  // Add state for password visibility (add this tocomponent state)
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // CNIC validation (Pakistani format: XXXXX-XXXXXXX-X)
  const validateCNIC = (cnic) => {
    const cnicRegex = /^[0-9]{5}-[0-9]{7}-[0-9]$/;
    return cnicRegex.test(cnic);
  };

  // Pakistani phone number validation (03XX-XXXXXXX)
  const validatePhone = (phone) => {
    const phoneRegex = /^03[0-9]{2}-[0-9]{7}$/;
    return phoneRegex.test(phone);
  };

  const handleCNICChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 13) value = value.slice(0, 13);

    if (value.length > 5) {
      value = value.slice(0, 5) + "-" + value.slice(5);
    }
    if (value.length > 13) {
      value = value.slice(0, 13) + "-" + value.slice(13);
    }

    setFormData({ ...formData, cnic: value });
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);

    if (value.length > 4) {
      value = value.slice(0, 4) + "-" + value.slice(4);
    }

    setFormData({ ...formData, contact: value });
  };

  const handleDiseaseSearch = (e) => {
    const value = e.target.value;
    setDiseaseSearch(value);
    setShowDiseaseDropdown(value.length > 0);

    // Check if value matches a main disease category
    const matchedCategory = Object.keys(diseaseOptions).find(
      (key) => key.toLowerCase() === value.toLowerCase()
    );

    if (matchedCategory) {
      setDiseaseSubTypes(diseaseOptions[matchedCategory]);
    } else {
      setDiseaseSubTypes([]);
    }
  };

  const selectDisease = (disease) => {
    setDiseaseSearch(disease);
    setFormData({ ...formData, majorDisease: disease });

    // Check if this disease has subtypes
    if (diseaseOptions[disease]) {
      setDiseaseSubTypes(diseaseOptions[disease]);
      setShowDiseaseDropdown(true);
    } else {
      setShowDiseaseDropdown(false);
      setDiseaseSubTypes([]);
    }
  };

  const selectDiseaseSubType = (subType) => {
    setDiseaseSearch(subType);
    setFormData({ ...formData, majorDisease: subType });
    setShowDiseaseDropdown(false);
    setDiseaseSubTypes([]);
  };

  const handleAllergySearch = (e) => {
    const value = e.target.value;
    setAllergySearch(value);
    setShowAllergyDropdown(value.length > 0);
  };

  const selectAllergy = (allergy) => {
    setAllergySearch(allergy);
    setFormData({ ...formData, allergies: allergy });
    setShowAllergyDropdown(false);
  };

  const getFilteredDiseases = () => {
    if (diseaseSubTypes.length > 0) {
      return diseaseSubTypes.filter((disease) =>
        disease.toLowerCase().includes(diseaseSearch.toLowerCase())
      );
    }

    return Object.keys(diseaseOptions).filter((disease) =>
      disease.toLowerCase().includes(diseaseSearch.toLowerCase())
    );
  };

  const getFilteredAllergies = () => {
    return allergyOptions.filter((allergy) =>
      allergy.toLowerCase().includes(allergySearch.toLowerCase())
    );
  };

  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.contact ||
      !formData.cnic ||
      !formData.gender ||
      !formData.address ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      Swal.fire({
        icon: "error",
        title: "Missing Fields",
        text: "Please fill all required fields.",
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

    if (!validateCNIC(formData.cnic)) {
      Swal.fire({
        icon: "error",
        title: "Invalid CNIC",
        text: "Please enter a valid CNIC (XXXXX-XXXXXXX-X)",
      });
      return;
    }

    if (!validatePhone(formData.contact)) {
      Swal.fire({
        icon: "error",
        title: "Invalid Phone",
        text: "Please enter a valid phone number (03XX-XXXXXXX)",
      });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: "error",
        title: "Password Mismatch",
        text: "Passwords do not match.",
      });
      return;
    }
    if ((formData.password || "").length < 6) {
      Swal.fire({
        icon: "error",
        title: "Weak Password",
        text: "Password must be at least 6 characters.",
      });
      return;
    }

    Swal.fire({
      title: "Registering...",
      text: "Please wait while we create your account",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          role: "patient",
        }),
      });

      const data = await res.json();

      if (!res.ok || data.status === "error") {
        Swal.fire({
          icon: "error",
          title: "Signup Failed",
          text: data.message || "Please try again.",
        });
        return;
      }

      if (data.token) {
        document.cookie = `token=${data.token}; path=/;`;
      }

      Swal.fire({
        icon: "success",
        title: "Signup Successful",
        text: "Welcome! Redirecting to your dashboard...",
        timer: 1800,
        showConfirmButton: false,
      }).then(() => {
        const redirectPath =
          roleRedirectMap[data.role] ||
          roleRedirectMap[data.user?.role] ||
          "/patient";
        router.push(redirectPath);
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Unable to connect. Please try again later.",
      });
    }
  };

  //const bgStyle = { backgroundImage: `url(${SignupImg.src})` };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden relative">
          {/* <div className="absolute inset-0 bg-cover bg-center opacity-10" style={bgStyle}></div> */}
          <div className="relative z-10">
            <div className="bg-gradient-to-r bg-hero-gradient px-8 py-6">
              <h1 className="text-3xl font-bold text-white">
                Patient Registration
              </h1>
              <p className="text-rose-100 mt-2">
                Join our healthcare network and manage your health records
              </p>
            </div>

            <div className="p-8 space-y-8">
              {/* Personal Information */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <User className="mr-3 text-blue-600" size={28} />
                  Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <Input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter full name"
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
                      <CreditCard className="mr-2 text-gray-500" size={16} />
                      CNIC *
                    </label>
                    <Input
                      name="cnic"
                      value={formData.cnic}
                      onChange={handleCNICChange}
                      placeholder="XXXXX-XXXXXXX-X"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Users className="mr-2 text-gray-500" size={16} />
                      Gender *
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
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
                      placeholder="Enter address"
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

              {/* Medical Information */}
              <section>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
                  <AlertTriangle className="mr-3 text-blue-600" size={28} />
                  Medical Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <AlertTriangle className="mr-2 text-gray-500" size={16} />
                      Allergies
                    </label>
                    <Input
                      value={allergySearch}
                      onChange={handleAllergySearch}
                      onFocus={() =>
                        setShowAllergyDropdown(allergySearch.length > 0)
                      }
                      placeholder="Search allergies"
                    />
                    {showAllergyDropdown &&
                      getFilteredAllergies().length > 0 && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {getFilteredAllergies().map((allergy, idx) => (
                            <div
                              key={idx}
                              onClick={() => selectAllergy(allergy)}
                              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                            >
                              {allergy}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <Droplet className="mr-2 text-gray-500" size={16} />
                      Blood Group
                    </label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Blood Group</option>
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="relative">
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                      <AlertTriangle className="mr-2 text-gray-500" size={16} />
                      Major Disease
                    </label>
                    <Input
                      value={diseaseSearch}
                      onChange={handleDiseaseSearch}
                      onFocus={() =>
                        setShowDiseaseDropdown(diseaseSearch.length > 0)
                      }
                      placeholder="Search disease"
                    />
                    {showDiseaseDropdown &&
                      getFilteredDiseases().length > 0 && (
                        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {getFilteredDiseases().map((disease, idx) => (
                            <div
                              key={idx}
                              onClick={() =>
                                diseaseSubTypes.length > 0
                                  ? selectDiseaseSubType(disease)
                                  : selectDisease(disease)
                              }
                              className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                            >
                              {disease}
                              {diseaseOptions[disease] && (
                                <span className="text-gray-400 ml-2">→</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </div>
              </section>

              {/* Submit Button */}
              <div className="flex justify-end gap-4 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => router.push("/login/patient-login")}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-8 py-3 rounded-lg bg-hero-gradient text-white font-semibold hover:bg-blue-700 transition"
                >
                  Complete Registration
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
