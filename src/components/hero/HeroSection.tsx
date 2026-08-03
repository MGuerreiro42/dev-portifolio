"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useHero } from "./useHero";
import { usePanelFloat } from "./usePanelFloat";
import { useIsFirefox } from "./useIsFirefox";
import DustField from "./DustField";
import LocaleSwitcher from "@/components/nav/LocaleSwitcher";

/* Proporção original da foto: 1536 × 2730 ≈ 0.5629 */
const PHOTO_RATIO = "1536 / 2730";

export default function HeroSection() {
  const t = useTranslations("Hero");
  const {
    containerRef,
    mouseXRef,
    mouseYRef,
    glowPos,
    rotateX: photoRotateX,
    rotateY: photoRotateY,
    translateX: photoTranslateX,
    translateY: photoTranslateY,
    handleMouseMove,
    handleMouseLeave,
  } = useHero();
  const {
    panelRef,
    handleMouseMove: handlePanelMouseMove,
    handleMouseLeave: handlePanelMouseLeave,
    rotateX,
    rotateY,
    translateY: panelFloatY,
  } = usePanelFloat();
  const isFirefox = useIsFirefox();

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full min-h-screen md:h-screen bg-black flex flex-col overflow-hidden md:sticky md:top-0 z-[1]"
    >
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 50% at 50% 46%, rgba(255,255,255,0.09) 0%, rgba(255,255,255,0.03) 45%, transparent 75%)",
        }}
      />

      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.22) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.22) 2px, transparent 2px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 65% 60% at 50% 46%, black 0%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 65% 60% at 50% 46%, black 0%, transparent 78%)",
        }}
      />

      <DustField mouseXRef={mouseXRef} mouseYRef={mouseYRef} count={2000} opacity={0.22} />

      {/* ── Foto — canto inferior esquerdo, sempre cortada exatamente ao
          meio (a metade esquerda sai da tela, cortada pelo overflow-hidden
          da seção). O corte é uma classe Tailwind estática (-translate-x-1/2),
          nunca um valor animado pelo Framer Motion — motion.* "assume" a
          propriedade transform quando animate inclui x/y/rotate, o que
          silenciosamente ignorava um transform customizado aqui antes. */}
      <div
        className="absolute bottom-0 left-0 z-[2] pointer-events-none"
        style={{ perspective: "900px" }}
      >
        {/* Brilho de chão */}
        <div
          className="absolute bottom-0 left-0 h-[70%] pointer-events-none"
          style={{
            aspectRatio: PHOTO_RATIO,
            background:
              "radial-gradient(ellipse at 30% 100%, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 32%, transparent 68%)",
          }}
        />

        {/* Brilho de mouse */}
        <div
          className="absolute bottom-[20%] left-0 w-60 h-80 rounded-full blur-[90px] pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at ${glowPos.x}% ${glowPos.y}%, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 50%, transparent 72%)`,
          }}
        />

        <motion.div
          className="h-[100vh] md:h-[85vh] -translate-x-1/2"
          style={{ aspectRatio: PHOTO_RATIO }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Tilt do mouse — div comum (não motion.div), atualizada via
              re-render do React a cada frame do rAF em useHero; assim não
              disputa a propriedade transform com o Framer Motion. */}
          <div
            className="relative w-full h-full"
            style={{
              transform: `translateX(${photoTranslateX}px) translateY(${photoTranslateY}px) rotateX(${photoRotateX}deg) rotateY(${photoRotateY}deg)`,
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
          >
            <Image
              src="/photo.png"
              alt="Miguel Guerreiro"
              fill
              priority
              className="object-contain object-bottom mix-blend-lighten"
              style={{
                filter:
                  "grayscale(1) contrast(1.05) brightness(0.88) drop-shadow(0 0 72px rgba(255,255,255,0.06)) drop-shadow(0 0 140px rgba(255,255,255,0.03))",
              }}
            />
          </div>
        </motion.div>
      </div>

      <LocaleSwitcher />

      <div
        className="flex-1 flex items-center justify-center px-6 relative z-[5]"
        style={{ perspective: "1200px" }}
      >
        <motion.div
          ref={panelRef}
          onMouseMove={handlePanelMouseMove}
          onMouseLeave={handlePanelMouseLeave}
          className={[
            "relative flex flex-col items-center text-center rounded-[32px] border border-white/8 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.65)] px-[clamp(40px,8vw,120px)] py-[clamp(44px,6vw,84px)]",
            isFirefox ? "overflow-hidden bg-black" : "backdrop-blur-sm",
          ].join(" ")}
          style={{
            transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${panelFloatY}px)`,
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Firefox não renderiza backdrop-filter com transform 3D no
              ancestral (bug do WebRender, sem previsão de correção) — nesse
              caso, desenhamos uma cópia borrada da grade em vez do blur ao vivo. */}
          {isFirefox && (
            <div
              className="absolute inset-0 z-0 pointer-events-none"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.22) 2px, transparent 2px), linear-gradient(90deg, rgba(255,255,255,0.22) 2px, transparent 2px)",
                backgroundSize: "56px 56px",
                filter: "blur(6px)",
              }}
            />
          )}

          <div className="relative z-[1] flex flex-col items-center text-center">
            <motion.h1
            className="font-display text-[clamp(44px,6.4vw,96px)] leading-[0.94] tracking-[-0.01em] text-highlight uppercase"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            SOFTWARE<br />ENGINEER<br />
            <span className="text-dim/90">FRONT-END<br />DEVELOPER</span>
          </motion.h1>

          <motion.p
            className="font-display text-[clamp(20px,2.2vw,28px)] tracking-[0.01em] text-highlight/90 mt-[42px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.0 }}
          >
            {t("name")}
          </motion.p>

          <motion.p
            className="font-light text-[clamp(14px,1.3vw,17px)] tracking-[0.14em] uppercase text-muted-warm/80 mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            {t("subtitle")}
          </motion.p>

          <motion.a
            href="#work"
            className="group inline-flex items-center gap-4.5 font-light text-[10px] tracking-[0.5em] uppercase text-muted-warm/60 no-underline transition-colors duration-400 hover:text-body/85 mt-[52px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.45 }}
          >
            <span className="block w-8 h-px bg-current [transition:width_0.5s_cubic-bezier(0.16,1,0.3,1)] group-hover:w-15" />
            {t("cta")}
          </motion.a>
          </div>
        </motion.div>
      </div>

      {/* ── Rodapé ── */}
      <div className="absolute bottom-9.5 left-6 right-6 md:left-24 md:right-24 h-px bg-white/[0.08] z-10" />
      <motion.span
        className="absolute bottom-11.5 left-6 right-6 md:left-auto md:right-24 text-right font-light text-[9px] tracking-[0.45em] uppercase text-dim-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 2.0 }}
      >
        {t("location")}
      </motion.span>
    </div>
  );
}
