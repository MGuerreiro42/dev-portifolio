"use client";

const SECTIONS = ["Hero", "About", "Work", "Contact"];

interface SectionIndicatorProps {
  current: number;
  onDotClick: (index: number) => void;
}

export default function SectionIndicator({ current, onDotClick }: SectionIndicatorProps) {
  return (
    <div data-indicator="true" className="fixed right-8 top-1/2 -translate-y-1/2 z-[200] flex flex-col gap-3">
      {SECTIONS.map((_, i) => (
        <button
          key={i}
          onClick={() => onDotClick(i)}
          className="w-4 h-4 flex items-center justify-center group cursor-pointer bg-transparent border-none p-0"
          aria-label={`Go to section ${i + 1}`}
        >
          <span
            className={[
              "block rounded-full transition-all duration-500",
              current === i
                ? "w-2 h-2 bg-[#f0ede8]/80"
                : "w-1.5 h-1.5 bg-[#f0ede8]/20 group-hover:bg-[#f0ede8]/40",
            ].join(" ")}
          />
        </button>
      ))}
    </div>
  );
}
