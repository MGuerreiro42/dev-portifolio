import { TECH_ICONS, TECH_COLORS } from "@/lib/techIcons";

interface TechPillProps {
  label: string;
}

/** Pill de tecnologia com ícone — mesmo tratamento visual do header (glass
 * pill). Só o ícone recebe a cor da marca, na opacidade da paleta do site;
 * o resto do pill continua neutro para não virar um arco-íris de chips. */
export default function TechPill({ label }: TechPillProps) {
  const Icon = TECH_ICONS[label];
  const color = TECH_COLORS[label];

  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-black/40 backdrop-blur-md px-2.5 py-1 font-light text-[9px] tracking-[0.2em] uppercase text-[#f0ede8]/75">
      {Icon && (
        <Icon
          className="w-[11px] h-[11px] shrink-0"
          style={color ? { color, opacity: 0.85 } : undefined}
        />
      )}
      {label}
    </span>
  );
}
