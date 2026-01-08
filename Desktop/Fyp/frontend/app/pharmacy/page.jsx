"use client";

import React from "react";
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

  // Dummy data (prescriptions / medicines)
  const prescriptions = [
    {
      id: 1,
      medicine: "Amoxicillin 500mg",
    },
    {
      id: 2,
      medicine: "Metformin 1000mg",
    },
    {
      id: 3,
      medicine: "Aspirin 100mg",
    },
    {
      id: 4,
      medicine: "Vitamin D3 1000IU",
    },
  ];

  const totalPrescriptions = prescriptions.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Welcome, Pharmacy User
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            View your prescription summary and recently added medicines.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Total prescriptions */}
          <Card className="border-none shadow-md bg-hero-gradient text-white">
            <CardContent className="py-6 flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total prescriptions</p>
                <p className="mt-2 text-4xl font-semibold">{totalPrescriptions}</p>
                <p className="mt-1 text-xs opacity-80">
                  All prescriptions recorded in your pharmacy.
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <FileText className="w-7 h-7" />
              </div>
            </CardContent>
          </Card>

          {/* Info card */}
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
            {prescriptions.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-500">
                No medicines added yet.
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {prescriptions.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-hero/10 flex items-center justify-center">
                        <Pill className="w-5 h-5 text-hero" />
                      </div>

                      <p className="text-sm font-medium text-slate-900">
                        {item.medicine}
                      </p>
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
