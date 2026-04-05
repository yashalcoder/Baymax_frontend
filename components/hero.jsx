import { Stethoscope, FlaskConical, Building2 } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f0f7ff] via-white to-[#e8f2ff] border-b border-blue-100">

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full bg-[radial-gradient(ellipse,rgba(58,142,255,0.18),transparent_65%)]" />
        <div className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full bg-[radial-gradient(ellipse,rgba(26,45,94,0.08),transparent_65%)]" />
      </div>

      {/* Floating plus signs */}
      <span className="absolute top-10 left-10 text-3xl text-blue-200 font-light select-none animate-pulse">✚</span>
      <span className="absolute top-20 right-20 text-2xl text-blue-200 font-light select-none animate-pulse">✚</span>
      <span className="absolute bottom-10 right-40 text-xl text-blue-100 font-light select-none animate-pulse">✚</span>

      {/* ECG line decoration */}
      <svg className="absolute top-0 left-0 w-full opacity-[0.07]" viewBox="0 0 800 40" preserveAspectRatio="none">
        <polyline
          points="0,20 80,20 100,5 115,35 130,10 150,20 300,20 320,5 335,35 350,10 370,20 550,20 570,5 585,35 600,10 620,20 800,20"
          fill="none" stroke="#1a73e8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>

      <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32">
        <div className="flex flex-col items-center text-center gap-6">

          {/* Badge */}
          <div className="flex items-center gap-2 text-xs md:text-sm px-4 py-1.5 rounded-full border-2 border-blue-100 bg-white shadow-sm font-bold text-[#1a73e8]"
            style={{ fontFamily: "'Nunito', sans-serif" }}>
            <Stethoscope size={16} />
            Secure • Reliable • Efficient
          </div>

          {/* Title */}
          <h1
            className="text-5xl md:text-7xl font-black text-[#1b2d5e] tracking-tight leading-tight"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            BayMax<span className="text-[#e8394a]">+</span>
          </h1>

          <h2
            className="text-3xl md:text-5xl font-black text-[#1a73e8] leading-tight"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            Smarter Healthcare
          </h2>

          <p className="text-slate-500 max-w-2xl md:text-xl leading-relaxed">
            Empowering doctors, patients, pharmacies, and laboratories in Pakistan with
            AI-powered transcription, smart diagnosis suggestions, and affordable medicine alternatives.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <a
              href="/signup"
              className="px-6 py-3.5 rounded-2xl font-black text-white text-base
                bg-gradient-to-r from-[#1b2d5e] to-[#1a73e8]
                shadow-[0_8px_24px_rgba(26,115,232,0.4)]
                hover:shadow-[0_12px_32px_rgba(26,115,232,0.5)]
                hover:-translate-y-0.5 transition-all duration-200"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              Get Started Free →
            </a>
            <a
              href="#how-it-works"
              className="px-6 py-3.5 rounded-2xl border-2 border-blue-100 bg-white font-bold text-[#1b2d5e] text-base
                hover:border-blue-300 hover:bg-blue-50 hover:-translate-y-0.5 transition-all duration-200"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              How It Works
            </a>
          </div>

          {/* Role pills */}
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {[
              { label: "Doctors", icon: Stethoscope, color: "bg-blue-50 text-blue-700 border-blue-100" },
              { label: "Patients", icon: Stethoscope, color: "bg-rose-50 text-rose-600 border-rose-100" },
              { label: "Pharmacies", icon: Building2, color: "bg-emerald-50 text-emerald-700 border-emerald-100" },
              { label: "Laboratories", icon: FlaskConical, color: "bg-purple-50 text-purple-700 border-purple-100" },
            ].map(({ label, icon: Icon, color }) => (
              <span
                key={label}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${color}`}
              >
                <Icon size={12} />
                {label}
              </span>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}