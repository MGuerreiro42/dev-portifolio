"use client";

import { useEffect, useState } from "react";

/**
 * Firefox's WebRender backend fails to render `backdrop-filter` when the
 * same element (or an ancestor) has a 3D transform (Bugzilla #1952612,
 * still unfixed). There's no CSS-detectable signal for this — Firefox
 * correctly reports support for the property, it just renders it wrong —
 * so we branch on the UA string instead.
 */
export function useIsFirefox() {
  const [isFirefox, setIsFirefox] = useState(false);

  useEffect(() => {
    setIsFirefox(/firefox/i.test(navigator.userAgent));
  }, []);

  return isFirefox;
}
