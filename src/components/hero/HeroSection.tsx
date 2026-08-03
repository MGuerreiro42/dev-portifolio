"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useHero } from "./useHero";
import { usePanelFloat } from "./usePanelFloat";
import { useIsFirefox } from "./useIsFirefox";
import LocaleSwitcher from "@/components/nav/LocaleSwitcher";
import { useSectionContext } from "@/context/SectionContext";
import { useIsSectionActive } from "@/hooks/useIsSectionActive";

/* Carregado só no cliente, sob demanda — three.js é pesado e não deveria
   entrar no bundle inicial de quem só quer ver o resto do site. */
const DustField = dynamic(() => import("./DustField"), { ssr: false });

/* Proporção original da foto: 1536 × 2730 ≈ 0.5629 */
const PHOTO_RATIO = "1536 / 2730";

export default function HeroSection() {
  const t = useTranslations("Hero");
  const { containerRef, mouseXRef, mouseYRef, handleMouseMove, handleMouseLeave } = useHero();
  const {
    panelRef,
    handleMouseMove: handlePanelMouseMove,
    handleMouseLeave: handlePanelMouseLeave,
    rotateX,
    rotateY,
    translateY: panelFloatY,
  } = usePanelFloat();
  const isFirefox = useIsFirefox();

  // Parallax de saída — só a seção Hero reage ao scroll: todos os elementos
  // sobem para fora da view, cada um numa velocidade diferente, conforme o
  // scroll avança de Hero (progress 0) para About (progress 1). Lê scrollTop/
  // clientHeight diretamente em vez de medir o retângulo do próprio Hero
  // via useScroll(target:...) — Hero é sticky, então seu rect fica
  // congelado assim que "gruda" no topo, quebrando qualquer cálculo de
  // progresso baseado em geometria (mesmo problema do offsetTop com sticky
  // já visto no ScrollContainer).
  const { containerRef: scrollContainerRef, scrollToIndex, currentIndex } = useSectionContext();
  const [exitProgress, setExitProgress] = useState(0);

  // Todas as 4 seções ficam montadas o tempo todo (sticky-stacked), então
  // sem isso a cena de partículas rodaria para sempre depois do primeiro
  // load, mesmo com o Hero enterrado embaixo de About/Work/Contact.
  const isVisible = useIsSectionActive(0, currentIndex, containerRef, scrollContainerRef);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const update = () => {
      const h = container.clientHeight || 1;
      setExitProgress(Math.min(Math.max(container.scrollTop / h, 0), 1));
    };

    update();
    container.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      container.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [scrollContainerRef]);

  const photoExitY = exitProgress * -110;
  const panelExitY = exitProgress * -170;
  const footerExitY = exitProgress * -60;
  const exitOpacity = 1 - exitProgress;

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

      {isVisible && (
        <DustField mouseXRef={mouseXRef} mouseYRef={mouseYRef} count={8000} opacity={0.22} />
      )}

      {/* ── Foto — canto inferior esquerdo, sempre cortada exatamente ao
          meio (a metade esquerda sai da tela, cortada pelo overflow-hidden
          da seção). O corte é uma classe Tailwind estática (-translate-x-1/2),
          nunca um valor animado pelo Framer Motion — motion.* "assume" a
          propriedade transform quando anima x/y/rotate, o que silenciosamente
          ignora um transform customizado no mesmo elemento. Por isso o
          parallax de saída (scroll) mora numa div comum própria, separada
          do crop estático e do fade de entrada. */}
      <div
        className="absolute bottom-0 left-0 z-0 pointer-events-none"
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

        <div
          className="h-[100vh] md:h-[85vh] -translate-x-1/2"
          style={{ aspectRatio: PHOTO_RATIO }}
        >
          <motion.div
            className="w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.4, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Parallax de saída — afasta a foto para o canto ao rolar para About */}
            <div
              className="relative w-full h-full"
              style={{
                transform: `translateY(${photoExitY}px)`,
                opacity: exitOpacity,
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
                    "grayscale(1) contrast(1.05) brightness(0.62) drop-shadow(0 0 60px rgba(255,255,255,0.04))",
                  opacity: 0.78,
                }}
              />
              {/* Vinheta — a foto competia demais com o headline; escurece
                  as bordas e reduz opacidade/brilho pra ela recuar como
                  pano de fundo em vez de disputar atenção. Gradiente linear
                  de cima pra baixo, não radial: uma elipse numa caixa tão
                  estreita/alta cria uma faixa "achatada" no topo que ficava
                  quase 100% preta e lisa, lendo como um retângulo colado
                  em cima do fundo em vez de um fade suave. */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, transparent 45%)",
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      <LocaleSwitcher />

      <div
        className="flex-1 flex items-center justify-center px-6 relative z-[5]"
        style={{ perspective: "1200px" }}
      >
        {/* Parallax de saída — o painel sobe e desaparece ao rolar para
            About; isolado num wrapper próprio para não disputar a
            propriedade transform com o tilt de mouse do painel abaixo. */}
        <div style={{ transform: `translateY(${panelExitY}px)`, opacity: exitOpacity }}>
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

          <motion.button
            onClick={() => scrollToIndex(2)}
            className="group inline-flex items-center gap-4.5 font-light text-[10px] tracking-[0.5em] uppercase text-muted-warm/60 no-underline transition-colors duration-400 hover:text-body/85 mt-[52px] cursor-pointer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.45 }}
          >
            <span className="block w-8 h-px bg-current [transition:width_0.5s_cubic-bezier(0.16,1,0.3,1)] group-hover:w-15" />
            {t("cta")}
          </motion.button>
          </div>
        </motion.div>
        </div>
      </div>

      {/* ── Rodapé — parallax de saída num wrapper próprio, subindo mais
          devagar que o painel ao rolar para About */}
      <div
        className="absolute inset-0 z-10 pointer-events-none"
        style={{ transform: `translateY(${footerExitY}px)`, opacity: exitOpacity }}
      >
        <div className="absolute bottom-9.5 left-6 right-6 md:left-24 md:right-24 h-px bg-white/[0.08]" />
        <motion.span
          className="absolute bottom-11.5 left-6 right-6 md:left-auto md:right-24 text-right font-light text-[9px] tracking-[0.45em] uppercase text-dim-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2.0 }}
        >
          {t("location")}
        </motion.span>
      </div>
    </div>
  );
}
