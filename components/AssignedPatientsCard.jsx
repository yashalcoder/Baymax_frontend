"use client";
import { Card } from "@/components/ui/card";
import {
  CardContent,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Activity,
  ArrowLeft,
  Calendar,
  FileText,
  Settings,
  Stethoscope,
  Users,
  Plus,
  ChevronRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
export default function PatientsPage() {
  const [patients,setPatients] = useState([]);
  useEffect(() => {
    const fetchPatients = async () => {
      try{
          const token = localStorage.getItem("token");
          if (!token) {
            console.error("No token found");
            return;
          }
          const res = await fetch("http://localhost:5000/api/doctors/my-patients", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,

            }});
          if (!res.ok) {
            console.error("Failed to fetch patients:", res.statusText);
            return;
          }
          console.log("Response from server:", res);
          const data = await res.json();
          console.log("Data from server:", data);
          setPatients(data.data||null);
      }catch(error){
        console.error("Error fetching patients:", error);
      }
    }
    fetchPatients();
  }, []);
    
  // const patients = [
  //   {
  //     id: 1,
  //     name: "Ahmad Khan",
  //     age: 45,
  //     lastVisit: "2025-01-10",
  //     condition: "Diabetes Follow-up",
  //   },
  //   {
  //     id: 2,
  //     name: "Fatima Ali",
  //     age: 32,
  //     lastVisit: "2025-01-10",
  //     condition: "Hypertension",
  //   },
  //   {
  //     id: 3,
  //     name: "Hassan Raza",
  //     age: 28,
  //     lastVisit: "2025-01-09",
  //     condition: "Annual Checkup",
  //   },
  //   {
  //     id: 4,
  //     name: "Ayesha Malik",
  //     age: 51,
  //     lastVisit: "2025-01-08",
  //     condition: "Arthritis",
  //   },
  // ];

  const stats = [
    {
      label: "Total Patients",
      value: "247",
      icon: Users,
      color: "text-primary",
    },
    {
      label: "Today's Consultations",
      value: "12",
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
  return (
    <div className="bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
      <div className="flex justify-end m-5">
        <Button
          variant="outline"
          onClick={() => (window.location.href = "/doctor")}
          className="border-gray-300 hover:bg-gray-50 "
        >
          <ArrowLeft className="w-4 h-4 mr-2 " />
          Back to Dashboard
        </Button>
      </div>

      <Card className="shadow-medical-lg m-5 border-border">
        <CardHeader className="border-b border-border">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl">Recent Patients</CardTitle>
              <CardDescription className="mt-1">
                View and manage your patient consultations
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
  {!patients || patients.length === 0 ? (
    <div className="p-6 text-center text-muted-foreground">
      There are no patients
    </div>
  ) : (
    <div className="divide-y divide-border">
      {patients.map((patient) => (
        <div
key={patient._id || patient.id}
          className="p-6 hover:bg-secondary/50 transition-colors cursor-pointer flex items-center justify-between group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-hero-gradient flex items-center justify-center text-white font-semibold shadow-medical-md">
              {patient.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {patient.fullName}
              </h3>
              <p className="text-sm text-muted-foreground">
                Age: {patient.age} • Last visit: {patient.lastVisit}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 rounded-full bg-accent text-accent-foreground text-sm font-medium">
              {patient.condition}
            </span>
            <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      ))}
    </div>
  )}

        </CardContent>
      </Card>
    </div>
  );
}
