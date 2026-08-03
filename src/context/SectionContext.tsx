"use client";

import { createContext, useContext, RefObject } from "react";

interface SectionContextType {
  scrollToIndex: (index: number) => void;
  currentIndex: number;
  containerRef: RefObject<HTMLDivElement | null>;
}

export const SectionContext = createContext<SectionContextType>({
  scrollToIndex: () => {},
  currentIndex: 0,
  containerRef: { current: null },
});

export const useSectionContext = () => useContext(SectionContext);
