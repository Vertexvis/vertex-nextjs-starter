import React, { useEffect } from 'react';
import { Environment } from '@vertexvis/viewer';
import { onTap, Viewer } from '../components/Viewer';
import { Sidebar } from '../components/Sidebar';
import { useViewer } from '../lib/viewer';
import { vertexvis } from '@vertexvis/frame-streaming-protos';
import { selectById } from '../lib/alterations';

const MonoscopicViewer = onTap(Viewer);

export default function Home(): JSX.Element {
  const viewerCtx = useViewer();

  useEffect(() => {
    document.title = 'Vertex Template';
  }, []);

  async function handleModelSelect(
    hit?: vertexvis.protobuf.stream.IHit
  ): Promise<void> {
    const scene = await viewerCtx.viewer.current?.scene();
    if (scene == null) {
      return;
    }

    await selectById(scene, hit?.itemId?.hex ?? '');
  }

  return (
    <main className="h-screen w-screen">
      <div className="h-full w-full grid grid-cols-sidebar-16 grid-rows-header-6">
        <div className="flex w-full row-span-full col-span-full">
          {viewerCtx.viewerState.isReady && (
            <div className="w-0 flex-grow ml-auto relative">
              <MonoscopicViewer
                configEnv={
                  (process.env.NEXT_PUBLIC_VERTEX_ENV as Environment) ??
                  'platprod'
                }
                clientId={process.env.NEXT_PUBLIC_VERTEX_CLIENT_ID ?? ''}
                streamKey={process.env.NEXT_PUBLIC_VERTEX_STREAM_KEY ?? ''}
                viewer={viewerCtx.viewer}
                onSceneReady={viewerCtx.onSceneReady}
                onSelect={handleModelSelect}
              />
            </div>
          )}
          <Sidebar />
        </div>
      </div>
    </main>
  );
}
