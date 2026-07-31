"use client";

import { User } from "lucide-react";
import { useTranslations } from "next-intl";
import Reveal from "@/components/ui/Reveal";

const EXPERIENCE_IDS = ["luizalabs", "castGroup"] as const;

const TECH_STACK = ["React", "Next.js", "TypeScript", "Node.js", "Tailwind"];

export default function AboutSection() {
  const t = useTranslations("About");
  const competencies = t.raw("competencies") as string[];

  return (
    <section
      id="about"
      className="relative w-full min-h-screen md:h-screen bg-black px-6 md:px-24 py-24 md:py-0 grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-10 md:gap-24 items-start md:items-center md:sticky md:top-0 z-[2]"
    >
      {/* Linha divisória do topo */}
      <div className="absolute top-0 left-6 right-6 md:left-24 md:right-24 h-px bg-white/[0.06]" />

      {/* ── Coluna esquerda ── */}
      <div className="flex flex-col">
        <Reveal delay={0.05} className="mb-10">
          <p className="font-light text-[10px] tracking-[0.55em] uppercase text-[#f0ede8]/[0.18]">
            {t("label")}
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mb-16">
          {/* Foto (placeholder) — flutua à esquerda, texto contorna e continua embaixo */}
          <div className="w-[150px] h-[150px] float-left mr-6 mb-3 rounded-full [shape-outside:circle(50%)] bg-white/[0.04] border border-white/[0.12] flex items-center justify-center overflow-hidden">
            <User className="w-14 h-14 text-white/15" strokeWidth={1} />
          </div>
          <p className="font-light text-[14px] leading-[1.85] text-[#f0ede8]/60">
            {t("bio")}
          </p>
        </Reveal>

        {/* Experiências */}
        <div className="flex flex-col mt-auto">
          {EXPERIENCE_IDS.map((id, i) => (
            <div key={id}>
              <Reveal delay={0.25 + i * 0.12}>
                <div className="h-px bg-white/[0.08] mb-5" />
                <p className="font-light text-[10px] tracking-[0.4em] uppercase text-[#f0ede8]/[0.22] mb-2">
                  {t(`experience.${id}.period`)}
                </p>
                <p className="font-light text-[12px] tracking-[0.18em] uppercase text-[#f0ede8]/70 mb-6">
                  {t(`experience.${id}.role`)}
                </p>
              </Reveal>
            </div>
          ))}
        </div>
      </div>

      {/* ── Coluna direita ── */}
      <div className="flex flex-col justify-between">
        {/* Quote */}
        <Reveal delay={0.2} className="mb-10">
          <p className="font-display text-[clamp(22px,2.8vw,38px)] leading-[1.18] tracking-[-0.01em] uppercase text-[#f0ede8]">
            {t("quotePrefix")}{" "}
            <span className="text-[#f0ede8]/[0.22]">{t("quoteHighlight")}</span>
          </p>
        </Reveal>

        {/* Parágrafo */}
        <Reveal delay={0.32} className="mb-16">
          <p className="font-light text-[13px] leading-[2] text-[#f0ede8]/[0.28] max-w-[520px]">
            {t("paragraph")}
          </p>
        </Reveal>

        {/* Sub-colunas */}
        <div className="grid grid-cols-2 gap-6 md:gap-12">
          {/* Competências */}
          <div>
            <Reveal delay={0.42} className="mb-5">
              <p className="font-light text-[10px] tracking-[0.55em] uppercase text-[#f0ede8]/[0.18]">
                {t("competenciesLabel")}
              </p>
            </Reveal>
            <ul className="flex flex-col gap-2">
              {competencies.map((item, i) => (
                <Reveal key={item} delay={0.48 + i * 0.07}>
                  <li className="font-light text-[13px] text-[#f0ede8]/50">
                    {item}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <Reveal delay={0.42} className="mb-5">
              <p className="font-light text-[10px] tracking-[0.55em] uppercase text-[#f0ede8]/[0.18]">
                {t("techStackLabel")}
              </p>
            </Reveal>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.map((tech, i) => (
                <Reveal key={tech} delay={0.48 + i * 0.06}>
                  <span className="font-light text-[10px] tracking-[0.22em] uppercase text-[#f0ede8]/75 bg-white/[0.03] border border-white/[0.25] px-3 py-1.5">
                    {tech}
                  </span>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
