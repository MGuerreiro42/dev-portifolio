"use client";

import { useEffect, useState, RefObject } from "react";

/**
 * Decide se a seção deve montar sua cena Three.js pesada.
 *
 * No desktop as 4 seções ficam `sticky` e empilhadas — uma vez "grudada",
 * o retângulo geométrico de uma seção nunca mais sai do viewport, mesmo
 * depois de ser coberta por outra seção por cima (confirmado medindo
 * getBoundingClientRect em vários scrollTop: fica sempre {top:0,
 * bottom:clientHeight}). IntersectionObserver só enxerga sobreposição com
 * o viewport, não oclusão por um irmão pintado depois — então ele nunca
 * reporta `false` de volta. Por isso no desktop usamos `currentIndex` do
 * contexto (sempre correto lá, porque o scroll é 100% via wheel→
 * scrollToIndex, nunca scroll nativo).
 *
 * No mobile as seções são `sticky` só a partir do breakpoint `md`
 * (`md:sticky`) — abaixo disso é fluxo normal, scroll nativo, sem esse
 * problema, e o IntersectionObserver funciona corretamente.
 */
export function useIsSectionActive(
  sectionIndex: number,
  currentIndex: number,
  elementRef: RefObject<HTMLElement | null>,
  containerRef: RefObject<HTMLElement | null>
) {
  const [isDesktop, setIsDesktop] = useState(true);
  const [intersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { root: containerRef.current, threshold: 0.01 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [elementRef, containerRef]);

  return isDesktop ? currentIndex === sectionIndex : intersecting;
}
