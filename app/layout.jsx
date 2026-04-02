// layout.jsx (stays server component)
import { SidebarProvider } from "@/components/sidebar-provider";
import LayoutContent from "@/components/layout-content";
import "./globals.css";
import { Poppins, Inter } from "next/font/google";
import { PatientProvider } from "@/components/Context/PatientContext";
const poppins = Poppins({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-poppins",
});

const inter = Inter({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Baymax +",
  description: "Healthcare Reimagined with AI-Powered Solutions",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} ${inter.variable}`}>
        <SidebarProvider>
          <PatientProvider>
            <LayoutContent>{children}</LayoutContent>
          </PatientProvider>
        </SidebarProvider>
      </body>
    </html>
  );
}
