const steps = [
  {
    title: "Conversation Capture",
    desc: "Doctor‑patient conversations are transcribed in real time in both Urdu and English using advanced AI.",
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    title: "AI Analysis",
    desc: "We extract symptoms, allergies, and history, then suggest possible diagnoses.",
    gradient: "from-violet-500 to-indigo-500",
  },
  {
    title: "Smart Prescription",
    desc: "Generate prescriptions with safety checks, interactions, and DRAP compliance.",
    gradient: "from-cyan-400 to-sky-500",
  },
  {
    title: "Patient Empowerment",
    desc: "Patients access their medical records and compare medicine prices for the best value.",
    gradient: "from-emerald-400 to-teal-500",
  },
];

export default function HowItWorks() {
  return (
    <div>
      <div className="text-center space-y-4 mb-14">
        <h3
          className="text-3xl md:text-4xl font-black text-[#1b2d5e]"
          style={{ fontFamily: "'Nunito', sans-serif" }}
        >
          How <span className="text-[#1a73e8]">BayMax+</span> Works
        </h3>
        <p className="text-slate-500 max-w-xl mx-auto md:text-lg">
          A simple, four‑step process that transforms healthcare delivery
        </p>
      </div>

      {/* Steps */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 relative">

        {/* Connector line (desktop) */}
        <div className="hidden lg:block absolute top-8 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-blue-100 via-blue-200 to-blue-100 z-0" />

        {steps.map((s, i) => (
          <div
            key={s.title}
            className="relative z-10 bg-white rounded-2xl border-2 border-slate-100 p-6
              shadow-sm hover:shadow-[0_8px_30px_rgba(26,115,232,0.12)]
              hover:border-blue-200 hover:-translate-y-1
              transition-all duration-300 group"
          >
            {/* Step number */}
            <div className={`h-12 w-12 rounded-2xl bg-gradient-to-br ${s.gradient} flex items-center justify-center mb-4 shadow-sm`}>
              <span
                className="text-white font-black text-lg"
                style={{ fontFamily: "'Nunito', sans-serif" }}
              >
                {i + 1}
              </span>
            </div>

            <div
              className="font-black text-[#1b2d5e] text-base mb-2"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              {s.title}
            </div>
            <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}