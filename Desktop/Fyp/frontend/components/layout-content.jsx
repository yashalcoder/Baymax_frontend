// components/layout-content.jsx
"use client";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/sidebar-provider";
import Navbar from "@/components/Navbar";

export default function LayoutContent({ children }) {
  const { collapsed } = useSidebar();
  const pathname = usePathname();

  // Auth pages ki list - include all signup and login pages
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/" ||
    pathname?.startsWith("/signup/") ||
    pathname?.startsWith("/login/");

  // Lab and pharmacy pages should not show doctor navbar/sidebar
  const isLabOrPharmacyPage =
    pathname?.startsWith("/lab") || pathname?.startsWith("/pharmacy") || pathname?.startsWith("/assistant");

  // Lab and pharmacy pages should not show doctor navbar/sidebar
  // const isLabOrPharmacyPage =
  //   pathname?.startsWith("/lab") || pathname?.startsWith("/pharmacy") || pathname?.startsWith("/assistant");

  // Agar auth page ya lab/pharmacy page hai, toh sirf children render karo
  if (isAuthPage ) {
    return <>{children}</>;
  }

  // Baaki pages ke liye navbar aur sidebar dikhao
  return (
    <>
      <Navbar />
      <main
        className={`flex-1 transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-[260px]"
        }`}
      >
        {children}
      </main>
    </>
  );
}
