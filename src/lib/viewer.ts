import { applyPolyfills, defineCustomElements } from "@vertexvis/viewer-react";
import React from "react";

interface Viewer {
  readonly ref: React.MutableRefObject<HTMLVertexViewerElement | null>;
  readonly isReady: boolean;
}

export function useViewer(): Viewer {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    async function init() {
      await Promise.all([applyPolyfills(), defineCustomElements()]);
      setIsReady(true);
    }

    init();
  }, []);

  return { ref: React.useRef<HTMLVertexViewerElement>(null), isReady };
}
