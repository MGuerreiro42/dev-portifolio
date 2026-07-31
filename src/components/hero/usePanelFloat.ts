"use client";

import { useEffect, useRef, useState } from "react";

/* Inclinação 3D sutil ao hover + flutuação ambiente contínua, no mesmo
   ritmo lento do DustField (RAF + lerp), para o painel de vidro do Hero. */
export function usePanelFloat() {
  const panelRef = useRef<HTMLDivElement>(null);
  const hoverTarget = useRef({ x: 0, y: 0 });
  const hoverCurrent = useRef({ x: 0, y: 0 });
  const mountOffset = useRef(28);
  const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0, translateY: 28 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = panelRef.current!.getBoundingClientRect();
    hoverTarget.current = {
      x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
      y: ((e.clientY - rect.top) / rect.height) * 2 - 1,
    };
  };

  const handleMouseLeave = () => {
    hoverTarget.current = { x: 0, y: 0 };
  };

  useEffect(() => {
    let raf: number;
    const start = performance.now();
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const loop = () => {
      hoverCurrent.current.x = lerp(hoverCurrent.current.x, hoverTarget.current.x, 0.08);
      hoverCurrent.current.y = lerp(hoverCurrent.current.y, hoverTarget.current.y, 0.08);
      mountOffset.current = lerp(mountOffset.current, 0, 0.045);

      const t = (performance.now() - start) / 1000;
      const ambientRotateX = Math.sin(t * 0.35) * 1.4;
      const ambientRotateY = Math.cos(t * 0.28) * 1.8;
      const ambientY = Math.sin(t * 0.32) * 7;

      setTransform({
        rotateX: ambientRotateX - hoverCurrent.current.y * 6,
        rotateY: ambientRotateY + hoverCurrent.current.x * 6,
        translateY: ambientY + mountOffset.current,
      });

      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return { panelRef, handleMouseMove, handleMouseLeave, ...transform };
}
