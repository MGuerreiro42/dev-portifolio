"use client";

import Reveal from "@/components/ui/Reveal";

const EXPERIENCE = [
  { period: "2023 — Current", role: "Software Engineer @ Stefanini" },
  { period: "2022 — 2023", role: "Frontend Dev @ Freelance" },
];

const COMPETENCIES = [
  "Interface Engineering",
  "Motion Design",
  "Design Systems",
  "Performance Optimization",
];

const TECH_STACK = ["React", "Next.js", "TypeScript", "Tailwind", "Three.js"];

export default function AboutSection() {
  return (
    <section
      id="about"
      className="relative w-full h-screen bg-black px-24 grid grid-cols-[2fr_3fr] gap-24 items-center sticky top-0 z-[2]"
    >
      {/* Linha divisória do topo */}
      <div className="absolute top-0 left-24 right-24 h-px bg-white/[0.06]" />

      {/* ── Coluna esquerda ── */}
      <div className="flex flex-col">
        <Reveal delay={0.05} className="mb-10">
          <p className="font-light text-[9px] tracking-[0.55em] uppercase text-[#f0ede8]/[0.18]">
            Biography_Log
          </p>
        </Reveal>

        <Reveal delay={0.15} className="mb-16">
          <h2 className="font-display text-[clamp(52px,6vw,96px)] leading-[0.87] tracking-[-0.01em] uppercase text-[#f0ede8]">
            Attention<br />to Detail.
          </h2>
        </Reveal>

        {/* Experiências */}
        <div className="flex flex-col mt-auto">
          {EXPERIENCE.map((item, i) => (
            <div key={i}>
              <Reveal delay={0.25 + i * 0.12}>
                <div className="h-px bg-white/[0.08] mb-5" />
                <p className="font-light text-[9px] tracking-[0.4em] uppercase text-[#f0ede8]/[0.22] mb-2">
                  {item.period}
                </p>
                <p className="font-light text-[11px] tracking-[0.18em] uppercase text-[#f0ede8]/70 mb-6">
                  {item.role}
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
            I build interfaces as if they are{" "}
            <span className="text-[#f0ede8]/[0.22]">architecture.</span>{" "}
            Not just screens, but structures that balance motion, clarity, and human experience.
          </p>
        </Reveal>

        {/* Parágrafo */}
        <Reveal delay={0.32} className="mb-16">
          <p className="font-light text-[12px] leading-[2] text-[#f0ede8]/[0.28] max-w-[520px]">
            My approach is rooted in obsessive attention to detail — every transition, every spacing decision, every interaction must serve a purpose. I care about the craft as much as the outcome.
          </p>
        </Reveal>

        {/* Sub-colunas */}
        <div className="grid grid-cols-2 gap-12">
          {/* Competências */}
          <div>
            <Reveal delay={0.42} className="mb-5">
              <p className="font-light text-[9px] tracking-[0.55em] uppercase text-[#f0ede8]/[0.18]">
                Core Competencies
              </p>
            </Reveal>
            <ul className="flex flex-col gap-2">
              {COMPETENCIES.map((item, i) => (
                <Reveal key={item} delay={0.48 + i * 0.07}>
                  <li className="font-light text-[12px] text-[#f0ede8]/50">
                    {item}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <Reveal delay={0.42} className="mb-5">
              <p className="font-light text-[9px] tracking-[0.55em] uppercase text-[#f0ede8]/[0.18]">
                Selected Tech Stack
              </p>
            </Reveal>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.map((tech, i) => (
                <Reveal key={tech} delay={0.48 + i * 0.06}>
                  <span className="font-light text-[9px] tracking-[0.22em] uppercase text-[#f0ede8]/50 border border-white/[0.10] px-3 py-1.5">
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
