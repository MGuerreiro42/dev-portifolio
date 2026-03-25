"use client";

import { useRef, useEffect, useState, useCallback, ReactNode } from "react";
import SectionIndicator from "./SectionIndicator";
import { SectionContext } from "@/context/SectionContext";

interface ScrollContainerProps {
  children: ReactNode;
  duration?: number;
}

const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export default function ScrollContainer({
  children,
  duration = 1400,
}: ScrollContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
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
      const targetY = index * container.clientHeight;
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

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimating.current) return;
      scrollToIndex(currentIndexRef.current + (e.deltaY > 0 ? 1 : -1));
    };

    container.addEventListener("wheel", onWheel, { passive: false });
    return () => container.removeEventListener("wheel", onWheel);
  }, [scrollToIndex]);

  return (
    <SectionContext.Provider value={{ scrollToIndex }}>
      <div
        ref={containerRef}
        className="h-screen overflow-y-scroll"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" } as React.CSSProperties}
      >
        {children}
        <SectionIndicator current={currentIndex} onDotClick={scrollToIndex} />
      </div>
    </SectionContext.Provider>
  );
}
