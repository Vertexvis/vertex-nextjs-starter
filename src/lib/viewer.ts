import React from "react";

interface Viewer {
  readonly ref: React.MutableRefObject<HTMLVertexViewerElement | null>;
  readonly isReady: boolean;
}

export function useViewer(): Viewer {
  const [isReady, setIsReady] = React.useState(false);

  React.useEffect(() => {
    async function loadComponents() {
      const { defineCustomElements } = await import("@vertexvis/viewer/loader");
      await defineCustomElements();
      setIsReady(true);
    }

    loadComponents();
  }, []);

  return { ref: React.useRef<HTMLVertexViewerElement>(null), isReady };
}
