/** Ordem das seções da home — única fonte de verdade para índice↔nome.
 * Usado pelo Navbar/MobileMenu (rótulos) e pelo ScrollContainer (índice↔
 * hash da URL), pra não ter duas listas que podem ficar fora de sincronia. */
export const SECTION_KEYS = ["home", "about", "work", "contact"] as const;

export type SectionKey = (typeof SECTION_KEYS)[number];
