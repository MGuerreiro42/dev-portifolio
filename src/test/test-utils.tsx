import { render, type RenderOptions } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { createRef, type ReactElement, type ReactNode } from "react";
import { SectionContext } from "@/context/SectionContext";
import en from "../../messages/en.json";
import ptBr from "../../messages/pt-br.json";

const MESSAGES = { en, "pt-br": ptBr } as const;

export type Locale = keyof typeof MESSAGES;

export function getMessages(locale: Locale = "en") {
  return MESSAGES[locale];
}

export function makeSectionContextValue(
  overrides: Partial<{
    scrollToIndex: (index: number) => void;
    currentIndex: number;
    containerRef: { current: HTMLElement | null };
  }> = {}
) {
  return {
    scrollToIndex: overrides.scrollToIndex ?? (() => {}),
    currentIndex: overrides.currentIndex ?? 0,
    containerRef: overrides.containerRef ?? createRef<HTMLElement>(),
  };
}

interface WrapperOptions {
  locale?: Locale;
  section?: Partial<{
    scrollToIndex: (index: number) => void;
    currentIndex: number;
    containerRef: { current: HTMLElement | null };
  }>;
}

function Wrapper({
  children,
  locale = "en",
  section,
}: WrapperOptions & { children: ReactNode }) {
  const content = (
    <NextIntlClientProvider locale={locale} messages={getMessages(locale)}>
      {children}
    </NextIntlClientProvider>
  );

  if (!section) return content;

  return (
    <SectionContext.Provider value={makeSectionContextValue(section)}>
      {content}
    </SectionContext.Provider>
  );
}

export function renderWithIntl(
  ui: ReactElement,
  options: WrapperOptions & Omit<RenderOptions, "wrapper"> = {}
) {
  const { locale, section, ...renderOptions } = options;
  return render(ui, {
    wrapper: ({ children }) => (
      <Wrapper locale={locale} section={section}>
        {children}
      </Wrapper>
    ),
    ...renderOptions,
  });
}

export * from "@testing-library/react";
