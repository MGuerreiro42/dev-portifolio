"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Reveal from "@/components/ui/Reveal";
import TechPill from "@/components/ui/TechPill";
import { useSectionContext } from "@/context/SectionContext";
import { useIsSectionActive } from "@/hooks/useIsSectionActive";
import { useIsDesktop } from "@/hooks/useIsDesktop";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* Carregado só no cliente, sob demanda — mesma lógica do DustField do Hero. */
const GlassBlobs = dynamic(() => import("./GlassBlobs"), { ssr: false });

const EXPERIENCE_IDS = ["luizalabs", "castGroup"] as const;

const TECH_STACK = ["React", "Next.js", "TypeScript", "Node.js", "Tailwind"];

export default function AboutSection() {
  const t = useTranslations("About");
  const competencies = t.raw("competencies") as string[];

  const sectionRef = useRef<HTMLElement>(null);
  const { containerRef: scrollContainerRef, currentIndex } = useSectionContext();
  const isVisible = useIsSectionActive(1, currentIndex, sectionRef, scrollContainerRef);
  const isDesktop = useIsDesktop();
  const reduceMotion = usePrefersReducedMotion();

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative w-full min-h-screen md:h-screen bg-black md:sticky md:top-0 z-[2] overflow-hidden"
    >
      {/* Blobs de "vidro" em 3D (Three.js) preenchendo o espaço negativo
          entre as duas colunas — só monta enquanto a seção está visível,
          já que as 4 seções ficam no DOM o tempo todo (sticky-stacked).
          Só no desktop: no mobile as colunas empilham em uma só, e as
          posições dos dois blobs foram calibradas pro layout largo de duas
          colunas — sem isso ficavam fora de quadro, rodando à toa. */}
      {isVisible && isDesktop && !reduceMotion && <GlassBlobs />}

      {/* Container de conteúdo — abaixo de 3xl (monitores grandes/ultrawide)
          continua full-bleed como sempre; a partir daí ganha uma largura
          máxima centralizada, pra não esticar indefinidamente em telas bem
          largas. Os blobs de fundo acima continuam full-bleed sempre. */}
      <div className="relative z-[1] w-full h-full mx-auto 3xl:max-w-[1800px] grid grid-cols-1 md:grid-cols-[2fr_3fr] gap-10 md:gap-24 items-start md:items-center px-6 md:px-24 py-24 md:py-0">
        {/* Linha divisória do topo */}
        <div className="absolute top-0 left-6 right-6 md:left-24 md:right-24 h-px bg-white/[0.08]" />

        {/* ── Coluna esquerda — deslocada para cima, mais perto do centro */}
      <div className="relative z-[1] flex flex-col md:[transform:translateY(clamp(-40px,-4vh,-16px))]">
        <Reveal delay={0.05} className="mb-10">
          <h3 className="font-light text-[10px] tracking-[0.55em] uppercase text-muted-warm/90">
            {t("label")}
          </h3>
        </Reveal>

        <Reveal delay={0.15} className="mb-8">
          {/* Foto — flutua à esquerda, texto contorna e continua embaixo */}
          <div className="relative w-[150px] h-[150px] float-left mr-6 mb-3 rounded-full [shape-outside:circle(50%)] border border-white/[0.12] overflow-hidden">
            <Image
              src="/about-photo.jpg"
              alt="Miguel Guerreiro"
              fill
              className="object-cover"
            />
          </div>
          <p className="font-light text-[14px] leading-[1.85] text-body/80 text-justify">
            {t("bio")}
          </p>
        </Reveal>

        {/* Experiências — no mobile, um único blob de vidro fica só atrás
            deste bloco (não a seção inteira), já que as duas colunas
            empilham e não sobra espaço negativo pros dois blobs do desktop */}
        <div className="relative flex flex-col mt-auto">
          {isVisible && !isDesktop && !reduceMotion && <GlassBlobs single />}
          <div className="relative z-[1] flex flex-col">
            {EXPERIENCE_IDS.map((id, i) => (
              <div key={id}>
                <Reveal delay={0.25 + i * 0.12}>
                  <div className="h-px bg-white/[0.08] mb-5" />
                  <p className="font-light text-[10px] tracking-[0.4em] uppercase text-muted-warm/90 mb-2">
                    {t(`experience.${id}.period`)}
                  </p>
                  <p className="font-light text-[12px] tracking-[0.18em] uppercase text-body/90 mb-6">
                    {t(`experience.${id}.role`)}
                  </p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Coluna direita — mais deslocada para baixo que a esquerda */}
      <div className="relative z-[1] flex flex-col justify-between md:[transform:translateY(clamp(60px,15vh,150px))]">
        {/* Quote */}
        <Reveal delay={0.2} className="mb-10">
          <h2 className="font-display text-[clamp(22px,2.8vw,38px)] leading-[1.18] tracking-[-0.01em] uppercase text-highlight">
            {t("quotePrefix")}{" "}
            <span className="text-muted-warm/90">{t("quoteHighlight")}</span>
          </h2>
        </Reveal>

        {/* Parágrafo */}
        <Reveal delay={0.32} className="mb-16">
          <p className="font-light text-[13px] leading-[2] text-body/80 max-w-[520px]">
            {t("paragraph")}
          </p>
        </Reveal>

        {/* Sub-colunas */}
        <div className="grid grid-cols-2 gap-6 md:gap-12">
          {/* Competências */}
          <div>
            <Reveal delay={0.42} className="mb-5">
              <h3 className="font-light text-[10px] tracking-[0.55em] uppercase text-muted-warm/90">
                {t("competenciesLabel")}
              </h3>
            </Reveal>
            <ul className="flex flex-col gap-2">
              {competencies.map((item, i) => (
                <Reveal key={item} delay={0.48 + i * 0.07}>
                  <li className="font-light text-[13px] text-muted-warm">
                    {item}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Tech Stack */}
          <div>
            <Reveal delay={0.42} className="mb-5">
              <h3 className="font-light text-[10px] tracking-[0.55em] uppercase text-muted-warm/90">
                {t("techStackLabel")}
              </h3>
            </Reveal>
            <div className="flex flex-wrap gap-2">
              {TECH_STACK.map((tech, i) => (
                <Reveal key={tech} delay={0.48 + i * 0.06}>
                  <TechPill label={tech} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </section>
  );
}
