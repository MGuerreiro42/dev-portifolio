"use client";

import { useEffect, useState } from "react";

/** MotionConfig com reducedMotion="user" cobre todo motion.* do Framer
 * Motion automaticamente — isso aqui é só pro que fica de fora: as cenas
 * Three.js (DustField, GlassBlobs, animação contínua via requestAnimationFrame,
 * não CSS/Framer) e as transformações manuais do Hero (tilt de mouse,
 * parallax de saída no scroll). */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}
