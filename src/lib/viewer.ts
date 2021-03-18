import { defineCustomElements } from '@vertexvis/viewer-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export interface ViewerContext {
  viewer: React.MutableRefObject<HTMLVertexViewerElement | null>;
  onSceneReady: () => void;
  viewerState: ViewerState;
}

interface ViewerState {
  sceneViewId?: string;
  isReady: boolean;
}

export function useViewer(): ViewerContext {
  const ref = useRef<HTMLVertexViewerElement>(null);
  const [state, setState] = useState<ViewerState>({ isReady: false });

  const onSceneReady = useCallback(async () => {
    const scene = await ref.current?.scene();
    setState({ ...state, sceneViewId: scene?.sceneViewId });
  }, [state]);

  useEffect(() => {
    async function setup(): Promise<void> {
      await defineCustomElements();
      setState({ ...(state ?? {}), isReady: true });
    }

    if (!state.isReady) {
      setup();
    }
  }, [state]);

  return { viewer: ref, viewerState: state, onSceneReady };
}
