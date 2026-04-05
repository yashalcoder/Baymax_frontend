import Image from "next/image";
import Logo from "@/public/bay.png";
import { FlaskConical, Building2, Stethoscope, User, UserCog } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#1b2d5e] text-white">

      {/* Main footer */}
      <div className="max-w-6xl mx-auto px-4 py-14 grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="md:col-span-1">
          <a href="#" className="flex items-center gap-2 mb-4">
            <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white/20">
              <Image src={Logo} alt="BayMax+" fill className="object-contain" />
            </div>
            <span
              className="font-black text-xl tracking-tight text-white"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              BayMax<span className="text-[#e8394a]">+</span>
            </span>
          </a>
          <p className="text-white/50 text-sm leading-relaxed">
            Transforming healthcare in Pakistan with AI assistance, automated record keeping, and affordable medicine access.
          </p>

          {/* Status badge */}
          <div className="flex items-center gap-2 mt-4 bg-white/10 rounded-full px-3 py-1.5 w-fit border border-white/20">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/60 text-xs font-semibold">All systems operational</span>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <div
            className="font-black text-sm mb-4 text-white/80 uppercase tracking-widest"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            Quick Links
          </div>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: "Features", href: "#features" },
              { label: "How It Works", href: "#how-it-works" },
              { label: "For Doctors", href: "#providers" },
              { label: "For Patients", href: "#patients" },
            ].map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-white/50 hover:text-white transition-colors duration-200"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Roles */}
        <div>
          <div
            className="font-black text-sm mb-4 text-white/80 uppercase tracking-widest"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            Roles
          </div>
          <ul className="space-y-2.5 text-sm">
            {[
              { label: "Doctor", icon: Stethoscope },
              { label: "Patient", icon: User },
              { label: "Assistant", icon: UserCog },
              { label: "Pharmacy", icon: Building2 },
              { label: "Laboratory", icon: FlaskConical },
            ].map(({ label, icon: Icon }) => (
              <li key={label}>
                <a
                  href="/signup"
                  className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-200"
                >
                  <Icon size={13} />
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <div
            className="font-black text-sm mb-4 text-white/80 uppercase tracking-widest"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            Contact
          </div>
          <ul className="space-y-2.5 text-sm text-white/50">
            <li>FAST‑NUCES Chiniot</li>
            <li>Pakistan</li>
            <li>
              <a href="mailto:support@baymaxplus.com" className="hover:text-white transition-colors">
                support@baymaxplus.com
              </a>
            </li>
          </ul>

          {/* CTA */}
          <a
            href="/signup"
            className="inline-flex mt-6 px-5 py-2.5 rounded-xl font-black text-[#1b2d5e] text-sm bg-white
              hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            Get Started →
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-white/30 text-xs">
            © 2025 BayMax+. Final Year Project — FAST‑NUCES Chiniot
          </p>
          <div className="flex gap-4 text-xs text-white/30">
            <span>DRAP Compliant</span>
            <span>·</span>
            <span>Bilingual Support</span>
            <span>·</span>
            <span>Secure & Private</span>
          </div>
        </div>
      </div>
    </footer>
  );
}