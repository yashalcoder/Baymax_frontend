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
import { Microscope, FlaskConical } from "lucide-react";

export default function LabDashboard() {
  const router = useRouter();
  const [tests, setTests] = useState([]);
  const [labName, setLabName] = useState("Lab User");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const testsRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/laboratory/tests`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const testsData = await testsRes.json();
        if (Array.isArray(testsData)) {
          setTests(testsData);
        }

        const profileRes = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/laboratory/profile`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const profileData = await profileRes.json();
        if (profileData?.labName) {
          setLabName(profileData.labName);
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

        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-slate-900">
            Welcome, {labName}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your lab catalogue and view available tests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="border-none shadow-md bg-hero-gradient text-white">
            <CardContent className="py-6 flex items-center justify-between">
              <div>
                <p className="text-sm opacity-80">Total tests in lab</p>
                <p className="mt-2 text-4xl font-semibold">{tests.length}</p>
                <p className="mt-1 text-xs opacity-80">
                  All active diagnostic tests currently available.
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                <Microscope className="w-7 h-7" />
              </div>
            </CardContent>
          </Card>

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
                  Ensure test names, categories, and prices remain accurate.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

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
                  <li key={test._id} className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-hero/10 flex items-center justify-center">
                        <Microscope className="w-5 h-5 text-hero" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{test.name}</p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-hero/10 px-2.5 py-0.5 text-[11px] font-medium text-hero">
                            {test.category}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            Rs. {test.price}
                          </span>
                          {test.sampleType && (
                            <span className="text-[11px] text-slate-500">
                              • {test.sampleType}
                            </span>
                          )}
                          {test.turnaroundValue && (
                            <span className="text-[11px] text-slate-500">
                              • {test.turnaroundValue} {test.turnaroundUnit}
                            </span>
                          )}
                          <span className={`text-[11px] font-medium ${test.available !== false ? "text-green-500" : "text-red-400"}`}>
                            • {test.available !== false ? "Available" : "Unavailable"}
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
}