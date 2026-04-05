import {
  Languages,
  FileText,
  BrainCircuit,
  Pill,
  ScanSearch,
  UserSquare2,
  ShieldCheck,
  Mic,
} from "lucide-react";

const items = [
  {
    title: "Bilingual Transcription",
    desc: "Real-time transcription of doctor‑patient conversations in both Urdu and English, ensuring nothing gets lost in translation.",
    icon: Languages,
    gradient: "from-indigo-500 to-blue-500",
  },
  {
    title: "Digital Medical Records",
    desc: "Secure storage of patient history, symptoms, allergies, and treatments in one centralized, easily accessible system.",
    icon: FileText,
    gradient: "from-cyan-400 to-sky-500",
  },
  {
    title: "AI Diagnosis Support",
    desc: "Intelligent suggestions for possible diagnoses based on symptoms and medical history to assist doctors in decision-making.",
    icon: BrainCircuit,
    gradient: "from-violet-500 to-indigo-500",
  },
  {
    title: "Smart Prescriptions",
    desc: "Automated prescription generation with interaction checks, allergy alerts, and DRAP compliance.",
    icon: Pill,
    gradient: "from-blue-500 to-[#1b2d5e]",
  },
  {
    title: "Medicine Price Comparison",
    desc: "Compare medicine prices and availability from local pharmacies to help patients find affordable options.",
    icon: ScanSearch,
    gradient: "from-emerald-400 to-teal-500",
  },
  {
    title: "Patient Portal",
    desc: "Patients can access their records, prescriptions, and treatment history anytime, anywhere.",
    icon: UserSquare2,
    gradient: "from-rose-400 to-pink-500",
  },
  {
    title: "Safety Checks",
    desc: "Comprehensive allergy screening and harmful drug interaction detection before finalizing any prescription.",
    icon: ShieldCheck,
    gradient: "from-amber-400 to-orange-500",
  },
  {
    title: "Voice Recognition",
    desc: "Accurate speech‑to‑text tuned for medical terms in both Urdu and English.",
    icon: Mic,
    gradient: "from-purple-500 to-violet-600",
  },
];

function FeatureCard({ title, desc, icon: Icon, gradient }) {
  return (
    <div className="group bg-white rounded-2xl border-2 border-slate-100 p-6
      shadow-sm hover:shadow-[0_8px_30px_rgba(26,115,232,0.12)]
      hover:border-blue-200 hover:-translate-y-1
      transition-all duration-300">
      <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-4 shadow-sm`}>
        <Icon className="text-white w-5 h-5" />
      </div>
      <h3
        className="font-black text-[#1b2d5e] text-base mb-2"
        style={{ fontFamily: "'Nunito', sans-serif" }}
      >
        {title}
      </h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  );
}

export default function Features() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {items.map((it) => (
        <FeatureCard key={it.title} {...it} />
      ))}
    </div>
  );
}