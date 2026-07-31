import { TECH_ICONS } from "@/lib/techIcons";

interface TechPillProps {
  label: string;
}

/** Pill de tecnologia com ícone — mesmo tratamento visual do header (glass pill). */
export default function TechPill({ label }: TechPillProps) {
  const Icon = TECH_ICONS[label];

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/40 backdrop-blur-md px-3 py-1.5 font-light text-[10px] tracking-[0.22em] uppercase text-[#f0ede8]/75">
      {Icon && <Icon className="w-[13px] h-[13px] shrink-0" />}
      {label}
    </span>
  );
}
