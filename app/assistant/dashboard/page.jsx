"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AssistantDashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/assistant");
  }, [router]);

  return null;
}
