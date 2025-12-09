"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginMain() {
  const [role, setRole] = useState("doctor");
  const router = useRouter();

  const handleContinue = () => {
    router.push(`/login/${role}-login`);
  };

  return (
    <main className="min-h-screen bg-soft flex items-center justify-center px-4">
      <div className="card p-6 max-w-xl w-full">

        <h1 className="text-3xl font-semibold text-center">Select Role</h1>

        <div className="mt-6 grid grid-cols-2 gap-2 border rounded-lg p-2">
          {["doctor", "patient", "assistant", "laboratory", "pharmacy"].map(
            (r) => (
              <button
                key={r}
                type="button"
                className={`px-4 py-2 rounded-md ${
                  role === r ? "bg-secondary" : ""
                }`}
                onClick={() => setRole(r)}
              >
                {r.charAt(0).toUpperCase() + r.slice(1)}
              </button>
            )
          )}
        </div>

        <button
          onClick={handleContinue}
          className="w-full mt-5 bg-brand text-white py-3 rounded-md"
        >
          Continue
        </button>
      </div>
    </main>
  );
}
