"use client";

import { useRef, useEffect, useLayoutEffect, useState, useCallback, ReactNode } from "react";
import SectionIndicator from "./SectionIndicator";
import { SectionContext } from "@/context/SectionContext";
import { SECTION_KEYS } from "@/lib/sections";

interface ScrollContainerProps {
  children: ReactNode;
  /** Rendered outside the scrollable/sectioned area, so it isn't trapped inside any section's stacking context. */
  overlay?: ReactNode;
  duration?: number;
}

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function ScrollContainer({
  children,
  overlay,
  duration = 1400,
}: ScrollContainerProps) {
  const containerRef = useRef<HTMLElement>(null);
  const currentIndexRef = useRef(0);
  const isAnimating = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToIndex = useCallback(
    (index: number) => {
      const container = containerRef.current;
      if (!container) return;
      const sections = Array.from(container.children).filter(
        (el) => !(el as HTMLElement).dataset.indicator
      ) as HTMLElement[];

      if (isAnimating.current || index < 0 || index >= sections.length) return;

      isAnimating.current = true;
      const startY = container.scrollTop;
      // No desktop as seções são sticky + exatamente uma tela, então
      // offsetTop não é confiável (sticky some navegadores retornam a
      // posição "presa" atual em vez da posição estática original, uma vez
      // que a seção já foi ultrapassada no scroll) — usamos index * altura,
      // que é sempre exato nesse modo. No mobile as seções têm altura
      // variável (Work vira lista), então precisamos do offsetTop real.
      const isDesktop = window.matchMedia("(min-width: 768px)").matches;
      const targetY = isDesktop
        ? index * container.clientHeight
        : sections[index].offsetTop;
      const distance = targetY - startY;
      const startTime = performance.now();

      const tick = (now: number) => {
        const progress = Math.min((now - startTime) / duration, 1);
        container.scrollTop = startY + distance * easeInOutCubic(progress);

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          currentIndexRef.current = index;
          setCurrentIndex(index);
          isAnimating.current = false;
        }
      };

      requestAnimationFrame(tick);
    },
    [duration]
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // O snap-scroll por wheel assume seções de exatamente uma tela — no
    // mobile a seção Work vira uma lista vertical de altura variável, então
    // abaixo do breakpoint md deixamos o scroll nativo (touch) acontecer.
    const isDesktop = () => window.matchMedia("(min-width: 768px)").matches;

    const onWheel = (e: WheelEvent) => {
      if (!isDesktop()) return;
      e.preventDefault();
      if (isAnimating.current) return;
      scrollToIndex(currentIndexRef.current + (e.deltaY > 0 ? 1 : -1));
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [scrollToIndex]);

  // currentIndex só era atualizado ao final de um scrollToIndex — qualquer
  // scroll que não passe por ali (teclado com o container focado, uma
  // extensão do navegador, etc.) deixava currentIndex desatualizado em
  // relação à seção realmente visível. Aqui ele é recalculado a partir da
  // posição real de scroll, então fica correto não importa a causa do
  // scroll. Só no desktop — no mobile as seções têm altura variável (Work
  // vira lista), então a conta abaixo (índice × altura) não se aplica, e lá
  // scrollToIndex via clique no nav já é o único jeito de mudar de seção.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const update = () => {
      if (isAnimating.current) return;
      if (!window.matchMedia("(min-width: 768px)").matches) return;

      const idx = Math.round(container.scrollTop / container.clientHeight);
      const clamped = Math.min(Math.max(idx, 0), SECTION_KEYS.length - 1);
      if (clamped !== currentIndexRef.current) {
        currentIndexRef.current = clamped;
        setCurrentIndex(clamped);
      }
    };

    container.addEventListener("scroll", update, { passive: true });
    return () => container.removeEventListener("scroll", update);
  }, []);

  // Deep link — /#work etc. pula direto pra seção certa ao carregar, sem
  // animação (é a posição inicial da página, não uma navegação do
  // usuário). useLayoutEffect pra rodar antes do primeiro paint, sem
  // flash do Hero por trás.
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const hash = window.location.hash.replace("#", "");
    const index = SECTION_KEYS.indexOf(hash as (typeof SECTION_KEYS)[number]);
    if (index > 0) {
      container.scrollTop = index * container.clientHeight;
      currentIndexRef.current = index;
      setCurrentIndex(index);
    }
  }, []);

  // Mantém a URL em sincronia com a seção atual — dá pra compartilhar/
  // recarregar num link direto pra uma seção, e serve de sinal visível se
  // o estado algum dia desincronizar de novo.
  useEffect(() => {
    const newHash = `#${SECTION_KEYS[currentIndex]}`;
    if (window.location.hash !== newHash) {
      window.history.replaceState(null, "", newHash);
    }
  }, [currentIndex]);

  return (
    <SectionContext.Provider value={{ scrollToIndex, currentIndex, containerRef }}>
      {overlay}
      <main
        id="main-content"
        // Not in the tab order (only reachable via the skip link's
        // fragment jump, which moves focus here programmatically) — a
        // real focus stop here would otherwise be a no-op tab step with
        // no visible affordance.
        tabIndex={-1}
        ref={containerRef}
        className="h-screen overflow-y-scroll outline-none"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        {children}
        <SectionIndicator current={currentIndex} onDotClick={scrollToIndex} />
      </main>
    </SectionContext.Provider>
  );
}
