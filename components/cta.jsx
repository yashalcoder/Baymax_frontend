import { Stethoscope, FlaskConical, Building2, User, UserCog } from "lucide-react";

export default function CTA() {
  return (
    <div
      id="cta"
      className="relative overflow-hidden rounded-3xl
        bg-gradient-to-br from-[#1b2d5e] via-[#1e3a8a] to-[#1a73e8]
        p-8 md:p-14 shadow-[0_20px_60px_rgba(26,115,232,0.3)]"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[radial-gradient(ellipse,rgba(255,255,255,0.06),transparent_65%)]" />
        <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full bg-[radial-gradient(ellipse,rgba(26,45,94,0.4),transparent_65%)]" />
      </div>

      {/* ECG line */}
      <svg className="absolute top-0 left-0 w-full opacity-10 pointer-events-none" viewBox="0 0 800 40" preserveAspectRatio="none">
        <polyline
          points="0,20 80,20 100,5 115,35 130,10 150,20 300,20 320,5 335,35 350,10 370,20 550,20 570,5 585,35 600,10 620,20 800,20"
          fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        />
      </svg>

      {/* Plus icons */}
      <span className="absolute top-6 left-8 text-2xl text-white/10 select-none">✚</span>
      <span className="absolute bottom-6 right-8 text-2xl text-white/10 select-none">✚</span>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">

        {/* Left text */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white/60 text-xs font-semibold uppercase tracking-widest">
              Secure & Private
            </span>
          </div>
          <h4
            className="text-3xl md:text-4xl font-black text-white leading-tight"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            Create Your Account<br />
            <span className="text-sky-300">on BayMax+</span>
          </h4>
          <p className="text-white/60 mt-3 max-w-md leading-relaxed">
            Your data is encrypted and protected with bank-level security, ensuring your privacy at all times.
          </p>

          {/* Role pills */}
          <div className="flex flex-wrap gap-2 mt-5">
            {[
              { label: "Doctor", icon: Stethoscope },
              { label: "Patient", icon: User },
              { label: "Assistant", icon: UserCog },
              { label: "Pharmacy", icon: Building2 },
              { label: "Laboratory", icon: FlaskConical },
            ].map(({ label, icon: Icon }) => (
              <span
                key={label}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-xs font-semibold"
              >
                <Icon size={11} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {/* Right CTA */}
        <div className="flex flex-col items-center gap-3 shrink-0">
          <a
            href="/signup"
            className="px-8 py-4 rounded-2xl font-black text-[#1b2d5e] text-base bg-white
              shadow-[0_8px_24px_rgba(0,0,0,0.2)]
              hover:shadow-[0_12px_32px_rgba(0,0,0,0.3)]
              hover:-translate-y-0.5 transition-all duration-200"
            style={{ fontFamily: "'Nunito', sans-serif" }}
          >
            Get Started Free →
          </a>
          <span className="text-white/40 text-xs">No credit card required</span>
        </div>
      </div>
    </div>
  );
}