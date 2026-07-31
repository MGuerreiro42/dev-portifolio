"use client";

import { createContext, useContext } from "react";

interface SectionContextType {
  scrollToIndex: (index: number) => void;
  currentIndex: number;
}

export const SectionContext = createContext<SectionContextType>({
  scrollToIndex: () => {},
  currentIndex: 0,
});

export const useSectionContext = () => useContext(SectionContext);
