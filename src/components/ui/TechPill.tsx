import { TECH_ICONS } from "@/lib/techIcons";

interface TechPillProps {
  label: string;
}

/** Pill de tecnologia com ícone — mesmo tratamento visual do header (glass pill). */
export default function TechPill({ label }: TechPillProps) {
  const Icon = TECH_ICONS[label];

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md px-2.5 py-1 font-light text-[9px] tracking-[0.2em] uppercase text-[#f0ede8]/75">
      {Icon && <Icon className="w-[11px] h-[11px] shrink-0" />}
      {label}
    </span>
  );
}
