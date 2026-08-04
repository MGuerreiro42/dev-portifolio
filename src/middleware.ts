import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Next.js serve as rotas especiais de metadata (icon, apple-icon,
  // robots.txt, sitemap.xml) sem extensão visível na URL às vezes (icon,
  // apple-icon), então a exclusão por ".*\..*" sozinha não pega — sem essa
  // lista explícita, o middleware tentava prefixar locale nelas e redirecionava
  // pra um 404 (ex.: /icon -> /en/icon, que não existe).
  matcher: [
    "/((?!api|_next|icon|apple-icon|opengraph-image|twitter-image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)",
  ],
};
