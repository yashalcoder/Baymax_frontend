"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Microscope, FlaskConical } from "lucide-react";

export default function LabDashboard() {
  const router = useRouter();

  // Dummy data for now
  const tests = [
    { id: 1, name: "Complete Blood Count (CBC)", category: "Blood Test", code: "CBC-01" },
    { id: 2, name: "Lipid Profile", category: "Biochemistry", code: "LIP-12" },
    { id: 3, name: "Thyroid Function Test", category: "Hormonal", code: "TFT-07" },
    { id: 4, name: "Fasting Blood Sugar", category: "Glucose", code: "GLU-03" },
  ];

  const totalTests = tests.length;

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Welcome, Lab User
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your lab catalogue and view available tests.
          </p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Total tests card */}
          <Card className="border-none shadow-md bg-hero-gradient text-white">
            <CardContent className="py-6 flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total tests in lab</p>
                <p className="mt-2 text-4xl font-semibold">{totalTests}</p>
                <p className="mt-1 text-xs opacity-80">
                  All active diagnostic tests currently available.
                </p>
              </div>

              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <Microscope className="w-7 h-7" />
              </div>
            </CardContent>
          </Card>

          {/* Info card */}
          <Card className="border border-slate-200 shadow-sm">
            <CardContent className="py-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-hero/10 flex items-center justify-center">
                <FlaskConical className="w-6 h-6 text-hero" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">
                  Keep your catalogue updated
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Ensure test names, codes, categories, and prices remain accurate.
                </p>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* All tests (static list, not clickable) */}
        <Card className="shadow-sm border-slate-200">
          <CardHeader>
            <CardTitle className="text-lg md:text-xl">All Tests</CardTitle>
            <CardDescription>
              List of all diagnostic tests available in your lab.
            </CardDescription>
          </CardHeader>

          <CardContent className="p-0">
            {tests.length === 0 ? (
              <div className="py-10 text-center text-sm text-slate-500">
                No tests added yet.
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {tests.map((test) => (
                  <li
                    key={test.id}
                    className="flex items-center justify-between px-5 py-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-hero/10 flex items-center justify-center">
                        <Microscope className="w-5 h-5 text-hero" />
                      </div>

                      <div>
                        <p className="text-sm font-medium text-slate-900">
                          {test.name}
                        </p>

                        <div className="mt-1 flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-hero/10 px-2.5 py-0.5 text-[11px] font-medium text-hero">
                            {test.category}
                          </span>

                          {test.code && (
                            <span className="text-[11px] text-slate-500">
                              Code: {test.code}
                            </span>
                          )}
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
}
