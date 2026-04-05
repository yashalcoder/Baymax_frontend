"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { FileText, Pill } from "lucide-react";

const PharmacyDashboard = () => {
  const router = useRouter();
  const [medicines, setMedicines] = useState([]);
  const [pharmacyName, setPharmacyName] = useState("Pharmacy User");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const token = localStorage.getItem("token");
      console.log("Pharmacy ",token)
      try {
        const medicinesRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pharmacy/medicines`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const medicinesData = await medicinesRes.json();
        if (Array.isArray(medicinesData)) {
          setMedicines(medicinesData);
        }

        const profileRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pharmacy/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const profileData = await profileRes.json();
        if (profileData?.pharmacyName) {
          setPharmacyName(profileData.pharmacyName);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Welcome, {pharmacyName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View your prescription summary and recently added medicines.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-md bg-hero-gradient text-white">
            <CardContent className="py-6 flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total medicines</p>
                <p className="mt-2 text-4xl font-semibold">{medicines.length}</p>
                <p className="mt-1 text-xs opacity-80">
                  All medicines in your pharmacy catalogue.
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <FileText className="w-7 h-7" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="py-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-hero/10 flex items-center justify-center">
                <Pill className="w-6 h-6 text-hero" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Manage your medicines easily
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Keep your catalogue updated with correct medicine details.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recently added medicines */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">
              Recently Added Medicines
            </CardTitle>
            <CardDescription>
              Latest medicines added to your pharmacy system.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            {medicines.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-500">
                No medicines added yet.
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {medicines.map((medicine) => (
                  <li
                    key={medicine._id}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-hero/10 flex items-center justify-center">
                        <Pill className="w-5 h-5 text-hero" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {medicine.name}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-hero/10 px-2.5 py-0.5 text-[11px] font-medium text-hero">
                            {medicine.dosageForm}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Rs. {medicine.price}
                          </span>
                          {medicine.strengthValue && (
                            <span className="text-[11px] text-slate-500">
                              • {medicine.strengthValue} {medicine.strengthUnit}
                            </span>
                          )}
                          <span className={`text-[11px] font-medium ${
                            medicine.status === "Available"
                              ? "text-green-500"
                              : medicine.status === "Low Stock"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}>
                            • {medicine.status || "Available"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default PharmacyDashboard;