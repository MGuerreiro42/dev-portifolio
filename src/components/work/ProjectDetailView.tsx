"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { SiGithub } from "react-icons/si";
import type { Project } from "@/lib/projects";
import TechPill from "@/components/ui/TechPill";
import Reveal from "@/components/ui/Reveal";
import Brand from "@/components/nav/Brand";
import { Link } from "@/i18n/navigation";

interface ProjectDetailViewProps {
  project: Project;
}

function DetailSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Reveal delay={0.05} className="mb-16 md:mb-20">
      <p className="font-light text-[10px] tracking-[0.55em] uppercase text-muted-warm/90 mb-5">
        {label}
      </p>
      {children}
    </Reveal>
  );
}

export default function ProjectDetailView({ project }: ProjectDetailViewProps) {
  const t = useTranslations("Work");
  const category = t(`projects.${project.id}.category`);
  const architecture = t.raw(`projects.${project.id}.detail.architecture`) as string[];
  const stack = t.raw(`projects.${project.id}.detail.stack`) as string[];

  return (
    <div className="relative min-h-screen w-full bg-surface overflow-hidden">
      {/* Grade de fundo, mesmo tratamento do Hero/Contact */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />

      <Brand />

      <Link
        href="/"
        className="fixed top-5 right-6 md:right-24 z-[100] inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 backdrop-blur-md px-4 py-1.5 font-light leading-none text-[11px] tracking-[0.1em] uppercase no-underline text-highlight/85 transition-colors duration-300 hover:text-highlight"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        {t("backToWork")}
      </Link>

      <main className="relative z-[1] px-6 md:px-24 pt-32 md:pt-40 pb-24 max-w-4xl mx-auto">
        <Reveal delay={0} className="mb-3">
          <p className="font-light text-[10px] tracking-[0.55em] uppercase text-muted-warm/70">
            {category} · {project.year}
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mb-6">
          <h1 className="font-display text-[clamp(40px,7vw,88px)] leading-[0.9] tracking-[-0.01em] uppercase text-highlight">
            {project.title}
          </h1>
        </Reveal>

        <Reveal delay={0.14} className="mb-12 md:mb-16">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <TechPill key={tag} label={tag} />
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.18} className="mb-16 md:mb-20">
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/10">
            <Image
              src={project.image}
              alt={project.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 shadow-[inset_0_0_140px_40px_rgba(0,0,0,0.45)]" />
          </div>
        </Reveal>

        <DetailSection label={t("detailLabels.overview")}>
          <p className="font-light text-[14px] leading-[1.85] text-body/90 max-w-[640px]">
            {t(`projects.${project.id}.detail.overview`)}
          </p>
        </DetailSection>

        <DetailSection label={t("detailLabels.architecture")}>
          <ul className="flex flex-col gap-4">
            {architecture.map((point) => (
              <li
                key={point}
                className="flex gap-3 font-light text-[14px] leading-[1.85] text-body/90 max-w-[640px]"
              >
                <span className="mt-[10px] w-1 h-1 rounded-full bg-muted-warm/70 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </DetailSection>

        <DetailSection label={t("detailLabels.stack")}>
          <ul className="flex flex-col gap-4">
            {stack.map((point) => (
              <li
                key={point}
                className="flex gap-3 font-light text-[14px] leading-[1.85] text-body/90 max-w-[640px]"
              >
                <span className="mt-[10px] w-1 h-1 rounded-full bg-muted-warm/70 shrink-0" />
                {point}
              </li>
            ))}
          </ul>
        </DetailSection>

        <DetailSection label={t("detailLabels.challenge")}>
          <p className="font-light text-[14px] leading-[1.85] text-body/90 max-w-[640px]">
            {t(`projects.${project.id}.detail.challenge`)}
          </p>
        </DetailSection>

        <DetailSection label={t("detailLabels.status")}>
          <p className="font-light text-[14px] leading-[1.85] text-muted-warm max-w-[640px]">
            {t(`projects.${project.id}.detail.status`)}
          </p>
        </DetailSection>

        <Reveal delay={0.05}>
          <div className="flex flex-wrap gap-3 pt-4 border-t border-white/[0.08]">
            {project.href && (
              <a
                href={project.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.05] px-5 py-2.5 font-light text-[10px] tracking-[0.3em] uppercase text-body no-underline transition-colors duration-300 hover:bg-white/15 hover:border-white/30 hover:text-highlight"
              >
                {t("viewLive")}
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            <a
              href={project.repoHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.05] px-5 py-2.5 font-light text-[10px] tracking-[0.3em] uppercase text-body no-underline transition-colors duration-300 hover:bg-white/15 hover:border-white/30 hover:text-highlight"
            >
              <SiGithub className="w-[15px] h-[15px]" />
              {t("viewCode")}
            </a>
          </div>
        </Reveal>
      </main>
    </div>
  );
}
