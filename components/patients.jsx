import { Check, FlaskConical, Building2, User, Stethoscope } from "lucide-react";

function Item({ title, desc }) {
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
        <div className="text-sm text-slate-500 mt-0.5">{desc}</div>
      </div>
    </li>
  );
}

export default function Patients() {
  return (
    <div className="flex flex-col items-center justify-center w-full px-4">

      {/* Section label */}
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold
        bg-blue-50 text-[#1a73e8] border border-blue-100 mb-6"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        For Patients
      </span>

      {/* Main card */}
      <div className="max-w-2xl w-full bg-white rounded-3xl
        shadow-[0_20px_60px_rgba(26,115,232,0.1)]
        border-2 border-blue-50 p-8 md:p-12 text-center">

        <h3
          className="text-2xl md:text-3xl font-black text-[#1b2d5e] leading-tight"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          Take Control of Your{" "}
          <span className="text-[#1a73e8]">Health</span> Journey
        </h3>

        <p className="text-slate-500 mt-4 md:text-lg leading-relaxed">
          Access your complete medical history, view prescriptions, and find the most affordable
          medicines — all in one secure place.
        </p>

        <ul className="mt-8 space-y-4 text-left">
          <Item
            title="Your Records, Your Control"
            desc="Access your complete medical history anytime, anywhere."
          />
          <Item
            title="Complete Medical History"
            desc="Never lose track of past treatments, allergies, or diagnoses."
          />
          <Item
            title="Save Money"
            desc="Compare medicine prices and find affordable options nearby."
          />
          <Item
            title="Secure & Private"
            desc="Bank‑level encryption keeps your data protected."
          />
        </ul>

        {/* Connected services row */}
        <div className="mt-8 pt-6 border-t border-blue-50">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-widest mb-4">
            Connected With
          </p>
          <div className="flex justify-center gap-3 flex-wrap">
            {[
              { label: "Doctors", icon: Stethoscope, color: "bg-blue-50 text-blue-700 border-blue-100" },
              { label: "Pharmacies", icon: Building2, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
              { label: "Laboratories", icon: FlaskConical, color: "bg-purple-50 text-purple-700 border-purple-100" },
              { label: "Assistants", icon: User, color: "bg-rose-50 text-rose-600 border-rose-100" },
            ].map(({ label, icon: Icon, color }) => (
              <span
                key={label}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold ${color}`}
              >
                <Icon size={12} />
                {label}
              </span>
            ))}
          </div>
        </div>

        <a
          href="/signup"
          className="inline-flex mt-6 px-6 py-3 rounded-2xl font-black text-white text-sm
            bg-gradient-to-r from-[#1b2d5e] to-[#1a73e8]
            shadow-[0_6px_20px_rgba(26,115,232,0.35)]
            hover:shadow-[0_10px_28px_rgba(26,115,232,0.45)]
            hover:-translate-y-0.5 transition-all duration-200"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          Create Patient Account →
        </a>
      </div>
    </div>
  );
}