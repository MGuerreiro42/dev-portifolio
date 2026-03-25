"use client";

import { useEffect, useRef, useState } from "react";

export function useHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseXRef = useRef(0);
  const mouseYRef = useRef(0);

  const tiltRef = useRef({ x: 0, y: 0 });
  const currentTilt = useRef({ x: 0, y: 0 });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current!.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    mouseXRef.current = x;
    mouseYRef.current = y;
    tiltRef.current = { x, y };
  };

  const handleMouseLeave = () => {
    mouseXRef.current = 0;
    mouseYRef.current = 0;
    tiltRef.current = { x: 0, y: 0 };
  };

  useEffect(() => {
    let raf: number;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const loop = () => {
      currentTilt.current.x = lerp(currentTilt.current.x, tiltRef.current.x, 0.07);
      currentTilt.current.y = lerp(currentTilt.current.y, tiltRef.current.y, 0.07);
      setTilt({ ...currentTilt.current });
      setGlowPos({
        x: 50 + currentTilt.current.x * 20,
        y: 50 + currentTilt.current.y * 16,
      });
      raf = requestAnimationFrame(loop);
    };

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const rotateY = tilt.x * 11;
  const rotateX = -tilt.y * 9;
  const translateX = tilt.x * 18;
  const translateY = tilt.y * 12;

  return {
    containerRef,
    mouseXRef,
    mouseYRef,
    glowPos,
    rotateX,
    rotateY,
    translateX,
    translateY,
    handleMouseMove,
    handleMouseLeave,
  };
}
