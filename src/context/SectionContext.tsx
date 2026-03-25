"use client";

import { createContext, useContext } from "react";

interface SectionContextType {
  scrollToIndex: (index: number) => void;
}

export const SectionContext = createContext<SectionContextType>({
  scrollToIndex: () => {},
});

export const useSectionContext = () => useContext(SectionContext);
