"use client";

import { useEffect, useState } from "react";
import PrescriptionForm from "@/components/prescription-form";
import PrescriptionPreview from "@/components/prescription-preview";
import { usePatient } from "@/components/Context/PatientContext";
export default function PrescriptionsPage() {
  const [data, setData] = useState(null);
const [editMode,setEditMode]=useState(false);
  const {patientData} = usePatient();
useEffect(()=>{
async function fetchData() {
  try {
    const response = await fetch((`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/prescription/${localStorage.getItem("consultationId")}`),{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const result = await response.json();
    setData(result);
    console.log("Fetched prescription data:", result);
  } catch (error) {
    console.error("Error fetching prescription data:", error);
  }
}
fetchData();
},[])
  return (
    <main className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 mx-auto max-w-6xl p-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Create Prescription
        </h1>
        <p className="text-sm text-muted-foreground">
          Enter or auto-fill details, review warnings, generate a preview, and
          export or send to the patient.
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        <section className="rounded-lg border border-border bg-card p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">
              Prescription Details
            </h2>
            <button onClick={()=>setEditMode(true)} className="hover:cursor-pointer rounded-md bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg  px-2 py-1 text-xs font-medium text-white">
              Edit Prescription
            </button>
          </div>
          <PrescriptionForm onGenerate={setData} initialData={data} patientInfo={patientData} editMode={editMode}/>
        </section>

        <section className="rounded-lg border border-border bg-card p-6">
          <PrescriptionPreview data={data} />
        </section>
      </div>
    </main>
  );
}
