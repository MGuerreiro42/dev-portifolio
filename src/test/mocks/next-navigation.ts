import { vi } from "vitest";

// Real Next.js App Router hooks need a router mounted by the Next.js
// runtime, which doesn't exist in Vitest — this stands in for both
// next-intl's Link/usePathname/useRouter wrappers and direct notFound()
// calls in layout/page files. Aliased in vitest.config.mts rather than
// vi.mock()'d, because next-intl's own nested node_modules copy of "next"
// fails Vite's resolver for this bare specifier before any vi.mock
// interception would run.
export const usePathname = vi.fn(() => "/");
export const useRouter = vi.fn(() => ({
  push: vi.fn(),
  replace: vi.fn(),
  prefetch: vi.fn(),
  back: vi.fn(),
  forward: vi.fn(),
  refresh: vi.fn(),
}));
export const useParams = vi.fn(() => ({}));
export const useSearchParams = vi.fn(() => new URLSearchParams());
export const notFound = vi.fn(() => {
  throw new Error("NEXT_NOT_FOUND");
});
export const redirect = vi.fn();
export const permanentRedirect = vi.fn();
