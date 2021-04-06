import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Props as LayoutProps } from '../components/Layout';
import { StreamCredsDialog } from '../components/StreamCredsDialog';
import { RightSidebar } from '../components/RightSidebar';
import { VertexLogo } from '../components/VertexLogo';
import { onTap, Viewer } from '../components/Viewer';
import { selectByHit } from '../lib/scene-items';
import { Env } from '../lib/env';
import { waitForHydrate } from '../lib/nextjs';
import { getStoredCreds, setStoredCreds, StreamCreds } from '../lib/storage';
import { useViewer } from '../lib/viewer';
import { LeftSidebar } from '../components/LeftSidebar';

const MonoscopicViewer = onTap(Viewer);
const Layout = dynamic<LayoutProps>(
  () => import('../components/Layout').then((m) => m.Layout),
  { ssr: false }
);

function Home(): JSX.Element {
  const router = useRouter();
  const { clientId: queryId, streamKey: queryKey } = router.query;
  const storedCreds = getStoredCreds();
  const viewerCtx = useViewer();

  const [creds, setCreds] = useState<StreamCreds>({
    clientId:
      queryId?.toString() ||
      storedCreds.clientId ||
      '08F675C4AACE8C0214362DB5EFD4FACAFA556D463ECA00877CB225157EF58BFA',
    streamKey:
      queryKey?.toString() ||
      storedCreds.streamKey ||
      'U9cSWVb7fvS9k-NQcT28uZG6wtm6xmiG0ctU',
  });
  const [dialogOpen, setDialogOpen] = useState(
    !creds.clientId || !creds.streamKey
  );

  useEffect(() => {
    router.push(
      `/?clientId=${encodeURIComponent(
        creds.clientId
      )}&streamKey=${encodeURIComponent(creds.streamKey)}`
    );
    setStoredCreds(creds);
  }, [creds]);

  return (
    <Layout title="Vertex Starter">
      <div className="col-span-full">
        <Header logo={<VertexLogo />}>
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
      <div className="row-start-2 row-span-full col-span-1">
        <LeftSidebar />
      </div>
      <div className="flex w-full row-start-2 row-span-full col-start-2 col-span-full">
        {!dialogOpen && viewerCtx.viewerState.isReady && (
          <div className="w-0 flex-grow ml-auto relative">
            <MonoscopicViewer
              configEnv={Env}
              creds={creds}
              viewer={viewerCtx.viewer}
              onSceneReady={viewerCtx.onSceneReady}
              onSelect={async (hit) => {
                await selectByHit({
                  hit,
                  scene: await viewerCtx.viewer.current?.scene(),
                });
              }}
            />
          </div>
        )}
        <RightSidebar />
      </div>{' '}
      {dialogOpen && (
        <StreamCredsDialog
          creds={creds}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={(cs) => {
            setCreds(cs);
            setDialogOpen(false);
          }}
        />
      )}
    </Layout>
  );
}

export default waitForHydrate(Home);
