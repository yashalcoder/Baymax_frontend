import { Stethoscope } from "lucide-react";
import Image from "next/image";
import Logo from "@/public/logo-removebg-preview.png";
export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-background/80 backdrop-blur border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 font-semibold">
          <Image src={Logo} alt="no imae" className="w-16 h-16" />
          {/* <div>
            <span>BayMax+</span>
            <p className="text-xs text-gray-900 b">Healthcare Reimagined</p>
          </div> */}
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <a
            href="#features"
            className="hover:text-brand font-semibold  text-gray-600    p-2 rounded-md "
          >
            Features
          </a>
          <a
            href="#how-it-works"
            className="hover:text-brand font-semibold text-gray-600 p-2 rounded-md "
          >
            How It Works
          </a>
          <a
            href="#providers"
            className="hover:text-brand font-semibold   text-gray-600  p-2 rounded-md "
          >
            For Doctors
          </a>
          <a
            href="#patients"
            className="hover:text-brand font-semibold   text-gray-600  p-2 rounded-md "
          >
            For Patients
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="px-4 py-2 rounded-md border hover:bg-secondary"
          >
            Sign In
          </a>
          <a
            href="/signup"
            className="px-4 py-2 rounded-md bg-hero-gradient text-white hover:opacity-90"
          >
            Get Started
          </a>
        </div>
      </div>
    </header>
  );
}
