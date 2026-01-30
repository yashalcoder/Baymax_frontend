"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, getUserRole } from "@/utils/auth";

export default function ProtectedRoute({ children, requiredRole }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    // Check role if required
    if (requiredRole) {
      const userRole = getUserRole();
      if (userRole !== requiredRole) {
        router.push("/unauthorized");
        return;
      }
    }

    setIsAuthorized(true);
  }, [router, requiredRole]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <>{children}</>;
}
