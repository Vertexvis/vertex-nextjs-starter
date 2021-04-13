import { defineCustomElements } from '@vertexvis/viewer-react';
import { MutableRefObject, useEffect, useRef, useState } from 'react';

export interface ViewerContext {
  readonly ref: MutableRefObject<HTMLVertexViewerElement | null>;
  readonly isReady: boolean;
}

export function useViewer(): ViewerContext {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    defineCustomElements().then(() => setIsReady(true));
  }, []);

  return { ref: useRef<HTMLVertexViewerElement>(null), isReady };
}
