"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ allowedRoles = [], children }) {
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (!token || !user?.role) {
      // Not logged in
      router.push("/login");
    } else if (allowedRoles.length && !allowedRoles.includes(user.role)) {
      // Logged in but role not allowed
      router.push("/");
    } else {
      setIsAllowed(true);
    }
  }, [router, allowedRoles]);

  if (!isAllowed) return null; // or a loading spinner

  return <>{children}</>;
}
