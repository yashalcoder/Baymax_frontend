"use client";
import Image from "next/image";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Logo from "@/public/bay.png";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-[0_2px_12px_rgba(26,115,232,0.25)]">
            <Image src={Logo} alt="BayMax+" fill className="object-contain" />
          </div>
          <span
            className="font-black text-xl tracking-tight text-[#1b2d5e]"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            BayMax<span className="text-[#e8394a]">+</span>
          </span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1 text-sm">
          {[
            { label: "Features", href: "#features" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "For Doctors", href: "#providers" },
            { label: "For Patients", href: "#patients" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-xl font-semibold text-slate-600 hover:text-[#1a73e8] hover:bg-blue-50 transition-all duration-200"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="/login"
            className="px-4 py-2 rounded-xl border-2 border-blue-100 font-semibold text-[#1b2d5e] hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-sm"
          >
            Sign In
          </a>
          <a
            href="/signup"
            className="px-4 py-2 rounded-xl font-bold text-white text-sm
              bg-gradient-to-r from-[#1b2d5e] to-[#1a73e8]
              shadow-[0_4px_14px_rgba(26,115,232,0.35)]
              hover:shadow-[0_6px_20px_rgba(26,115,232,0.45)]
              hover:-translate-y-0.5 transition-all duration-200"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            Get Started
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-blue-50 text-[#1b2d5e]"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-blue-100 px-4 py-4 flex flex-col gap-2">
          {[
            { label: "Features", href: "#features" },
            { label: "How It Works", href: "#how-it-works" },
            { label: "For Doctors", href: "#providers" },
            { label: "For Patients", href: "#patients" },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="px-4 py-2.5 rounded-xl font-semibold text-slate-600 hover:text-[#1a73e8] hover:bg-blue-50 transition-all"
            >
              {link.label}
            </a>
          ))}
          <div className="flex gap-3 mt-2">
            <a href="/login" className="flex-1 text-center px-4 py-2.5 rounded-xl border-2 border-blue-100 font-semibold text-[#1b2d5e] text-sm">
              Sign In
            </a>
            <a href="/signup" className="flex-1 text-center px-4 py-2.5 rounded-xl font-bold text-white text-sm bg-gradient-to-r from-[#1b2d5e] to-[#1a73e8]"
              style={{ fontFamily: "'Nunito', sans-serif" }}>
              Get Started
            </a>
          </div>
        </div>
      )}
    </header>
  );
}