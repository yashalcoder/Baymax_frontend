import doctor from "@/public/doctor.png";
import Image from "next/image";
import { Check } from "lucide-react";

function Benefit({ title, desc }) {
  return (
    <li className="flex items-start gap-3">
      <div className="mt-0.5 h-5 w-5 rounded-full bg-gradient-to-br from-[#1a73e8] to-[#1b2d5e] flex items-center justify-center shrink-0 shadow-sm">
        <Check size={11} strokeWidth={3} className="text-white" />
      </div>
      <div>
        <div
          className="font-black text-[#1b2d5e] text-sm"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          {title}
        </div>
        <div className="text-slate-500 text-sm mt-0.5">{desc}</div>
      </div>
    </li>
  );
}

export default function Providers() {
  return (
    <div className="grid md:grid-cols-2 gap-12 items-center">

      {/* Text side */}
      <div className="order-2 md:order-1">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold
          bg-blue-50 text-[#1a73e8] border border-blue-100 mb-4"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          For Healthcare Providers
        </span>

        <h3
          className="text-3xl md:text-4xl font-black text-[#1b2d5e] leading-tight"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          Empower Your Practice with{" "}
          <span className="text-[#1a73e8]">AI Assistance</span>
        </h3>

        <p className="text-slate-500 mt-4 md:text-lg leading-relaxed">
          Focus on patient care while BayMax+ handles documentation and decision support.
        </p>

        <ul className="mt-6 space-y-4">
          <Benefit
            title="Save Time"
            desc="Reduce documentation time by up to 70% with automated transcription and record keeping."
          />
          <Benefit
            title="Better Communication"
            desc="Break language barriers with bilingual support in Urdu and English."
          />
          <Benefit
            title="Reduce Errors"
            desc="AI-powered safety checks for allergies and drug interactions."
          />
          <Benefit
            title="Smart Assistance"
            desc="Get diagnosis suggestions based on symptoms and history."
          />
        </ul>

        <a
          href="/signup"
          className="inline-flex mt-8 px-6 py-3 rounded-2xl font-black text-white text-sm
            bg-gradient-to-r from-[#1b2d5e] to-[#1a73e8]
            shadow-[0_6px_20px_rgba(26,115,232,0.35)]
            hover:shadow-[0_10px_28px_rgba(26,115,232,0.45)]
            hover:-translate-y-0.5 transition-all duration-200"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          Join as a Provider →
        </a>
      </div>

      {/* Image side */}
      <div className="order-1 md:order-2 flex justify-center">
        <div className="relative">
          {/* Glow ring */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(ellipse,rgba(26,115,232,0.15),transparent_70%)] scale-110" />
          <div className="relative w-[280px] h-[280px] md:w-[320px] md:h-[320px] rounded-full overflow-hidden
            border-4 border-white shadow-[0_20px_60px_rgba(26,115,232,0.2)]">
            <Image src={doctor} alt="Doctor" fill className="object-cover" />
          </div>
          {/* Floating badge */}
          <div className="absolute -bottom-4 -right-4 bg-white rounded-2xl px-4 py-2.5 shadow-lg border border-blue-100">
            <div className="text-xs text-slate-400 font-medium">Time Saved</div>
            <div className="text-xl font-black text-[#1a73e8]" style={{ fontFamily: "'Nunito', sans-serif" }}>70%</div>
          </div>
        </div>
      </div>
    </div>
  );
}