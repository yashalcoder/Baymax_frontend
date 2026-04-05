"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Activity,
  Calendar,
  FileText,
  Settings,
  Stethoscope,
  Users,
  Plus,
  ChevronRight,
} from "lucide-react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { use } from "react";
import Patients from "@/components/patients";
import PatientsCards from "@/components/AssignedPatientsCard";

const DoctorDashboard = () => {
const [count,setCount]=useState(0);
const [consulationCount,setConsulationCount]=useState(0);
  const router = useRouter();
  const [user, setUser] = useState(null);
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
      console.log("user from localstorage " + JSON.parse(stored));
    }
  }, []);
 
useEffect(() => {
  async function fetchPatients() {
    try {
      const token = localStorage.getItem("token");

      // 🧑‍⚕️ Patients
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctors/my-patients`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      const patients = await response.json();
      console.log("Patients:", patients);

      // ✅ Handle both cases (array OR object)
      setCount(Array.isArray(patients) ? patients.length : patients.count || 0);
    
      // 📋 Consultations
      const response2 = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctors/getConsultations`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        }
      );

      const consultations = await response2.json();
      console.log("Consultations:", consultations);

      // ✅ Same safe handling
      setConsulationCount(
        Array.isArray(consultations)
          ? consultations.length
          : consultations.count || 0
      );

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  fetchPatients();
}, []);

  const stats = [
    {
      label: "Total Patients",
      value: count,
      icon: Users,
      color: "text-primary",
    },
    {
      label: "Today's Consultations",
      value: consulationCount,
      icon: Activity,
      color: "text-medical-info",
    },
    {
      label: "Pending Reports",
      value: "8",
      icon: FileText,
      color: "text-medical-warning",
    },
    {
      label: "Upcoming Appointments",
      value: "15",
      icon: Calendar,
      color: "text-medical-success",
    },
  ];

const handleDischarge = async (patientId) => {
  const confirm = await Swal.fire({
    title: "Patient Discharge?",
    text: "Kya aap sure hain? Patient remove ho jayega.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Haan, Discharge karo",
    cancelButtonText: "Nahi"
  });


const token = localStorage.getItem("token");
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/doctors/discharge/${patientId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${token}` }
    });
    
    const data = await res.json();
    console.log("Discharge response:", data);
    if (data.status === "success") {
      Swal.fire({ title: "Done!", text: "Patient discharge ho gaya", icon: "success" });
      // List refresh karo
      fetchPatients(); 
    }
  } catch (err) {
    Swal.fire({ title: "Error", text: "Discharge nahi hua!", icon: "error" });
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-6">
      {/* Main Content */}
      <main className=" p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex justify-between items-center">
            <div>
              {user ? (
                <h1 className="text-4xl font-bold font-poppins text-foreground mb-2">
                  Welcome back, Dr. {user.name}!
                </h1>
              ) : (
                <h1 className="text-4xl font-bold font-poppins text-foreground mb-2">
                  Loading...
                </h1>
              )}

              <p className="text-muted-foreground">
                Here's what's happening with your{" "}
                <span className="font-poppins"> patients today</span>
              </p>
            </div>
            <Button
              className="bg-hero-gradient text-white shadow-medical-lg hover:opacity-90 transition-opacity"
             onClick={() => {
  const patientId = localStorage.getItem("patientId");
  console.log("Patient ID:", patientId);
  if (!patientId || patientId === "undefined") {
    Swal.fire({ title: "Error", text: "Koi patient selected nahi!", icon: "warning" });
    return;
  }
  handleDischarge(patientId);
  router.push("/doctor");
}}
            >
              <Plus className="w-4 h-4 mr-2" />
              Discharge Patient
            </Button>
            <Button
              className="bg-hero-gradient text-white shadow-medical-lg hover:opacity-90 transition-opacity"
              onClick={() => router.push("/doctor/transcription")}
            >
              <Plus className="w-4 h-4 mr-2" />
              Start Consultation
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <Card
                key={idx}
                className="bg-gradient-card border-border shadow-medical-md hover:shadow-medical-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className=" my-2 ">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">
                        {stat.label}
                      </p>
                      
                    </div>
                    <div
                      className=" flex justify-between"
                    >
                       <p className="text-3xl font-bold text-foreground mt-2">
                        {stat.value}
                      </p>
                    <div className={`w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center ${stat.color}`}>
                    <stat.icon className="w-6 h-6" />
                    </div>
                      
                     
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <PatientsCards />
        </div>
      </main>
    </div>
  );
};

export default DoctorDashboard;
