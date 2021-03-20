import { vertexvis } from '@vertexvis/frame-streaming-protos';
import { Environment } from '@vertexvis/viewer';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { LoadStreamKeyDialog } from '../components/LoadStreamKeyDialog';
import { Sidebar } from '../components/Sidebar';
import { onTap, Viewer } from '../components/Viewer';
import { selectById } from '../lib/alterations';
import { waitForHydrate } from '../lib/nextjs';
import { getItem, setItem, StorageKey } from '../lib/storage';
import { useViewer } from '../lib/viewer';

const MonoscopicViewer = onTap(Viewer);

function Home(): JSX.Element {
  const router = useRouter();
  const [clientId, setClientId] = useState(
    router.query.clientId?.toString() ?? getItem(StorageKey.ClientId) ?? ''
  );
  const [streamKey, setStreamKey] = useState(
    router.query.streamKey?.toString() ?? getItem(StorageKey.StreamKey) ?? ''
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const viewerCtx = useViewer();

  useEffect(() => {
    if (router.query.clientId == null && router.query.streamKey == null) {
      const id = getItem(StorageKey.ClientId) ?? '';
      const key = getItem(StorageKey.StreamKey) ?? '';
      router.push(
        `/?clientId=${encodeURIComponent(id)}&streamKey=${encodeURIComponent(
          key
        )}`
      );
    }
  }, []);

  useEffect(() => {
    setItem(StorageKey.ClientId, clientId);
    setItem(StorageKey.StreamKey, streamKey);
  }, [clientId, streamKey]);

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
    <>
      <Head>
        <title>Vertex Template</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="icon" href="/favicon-512x512.png" />
      </Head>
      <main className="h-screen w-screen">
        <div className="h-full w-full grid grid-cols-sidebar-16 grid-rows-header-6">
          <div className="col-span-full">
            <Header
              logo={
                <Image
                  src="/vertex-logo.svg"
                  alt="Vertex"
                  width="29"
                  height="28"
                />
              }
            >
              <div className="ml-4 mr-auto">
                <button
                  className="btn btn-primary text-sm"
                  onClick={() => setDialogOpen(true)}
                >
                  Open Scene
                </button>
              </div>
            </Header>
          </div>
          <div className="flex w-full row-start-2 row-span-full col-start-2 col-span-full">
            {dialogOpen && (
              <LoadStreamKeyDialog
                clientId={clientId}
                streamKey={streamKey}
                open={dialogOpen}
                onClose={() => setDialogOpen(false)}
                onLoad={(clientId, streamKey) => {
                  setClientId(clientId);
                  setStreamKey(streamKey);
                  router.push(
                    `/?clientId=${encodeURIComponent(
                      clientId
                    )}&streamKey=${encodeURIComponent(streamKey)}`
                  );
                  setDialogOpen(false);
                }}
              />
            )}
            {!dialogOpen && viewerCtx.viewerState.isReady && (
              <div className="flex w-full row-start-2 row-span-full col-start-2 col-span-full">
                <MonoscopicViewer
                  configEnv={
                    (process.env.NEXT_PUBLIC_VERTEX_ENV as Environment) ??
                    'platprod'
                  }
                  clientId={clientId}
                  streamKey={streamKey}
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
    </>
  );
}

export default waitForHydrate(Home);
