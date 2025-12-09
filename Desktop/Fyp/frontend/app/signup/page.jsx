"use client";

import { useRouter } from "next/navigation";
import { User, Stethoscope, UserPlus, Building2, FlaskConical } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();


  const signupOptions = [
    {
      title: "Patient",
      description: "Create an account to access healthcare services",
      icon: User,
      route: "/signup/patient-signup",
      color: "bg-blue-500",
    },
    {
      title: "Doctor",
      description: "Register as a healthcare provider",
      icon: Stethoscope,
      route: "/signup/doctor-signup",
      color: "bg-green-500",
    },
    {
      title: "Assistant",
      description: "Register as a medical assistant",
      icon: UserPlus,
      route: "/signup/assistant-signup",
      color: "bg-purple-500",
    },
    {
      title: "Pharmacy",
      description: "Register your pharmacy",
      icon: Building2,
      route: "/signup/pharmacy-signup",
      color: "bg-orange-500",
    },
    {
      title: "Laboratory",
      description: "Register your laboratory",
      icon: FlaskConical,
      route: "/signup/laboratory-signup",
      color: "bg-red-500",
    },
  ];

  return (
    <main className="min-h-[88vh] bg-soft flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">Create Your Account</h1>
          <p className="text-muted-foreground">Choose your account type to get started</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {signupOptions.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.route}
                onClick={() => router.push(option.route)}
                className="card p-6 text-left hover:shadow-lg transition-all hover:scale-105 cursor-pointer group"
              >
                <div
                  className={`w-12 h-12 ${option.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{option.title}</h3>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </button>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            Already have an account?{" "}
            <a href="/login" className="text-brand hover:underline font-medium">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
