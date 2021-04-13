import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { Header } from '../components/Header';
import { Layout } from '../components/Layout';
import { encode, OpenButton, OpenDialog } from '../components/OpenSceneDialog';
import { RightSidebar } from '../components/RightSidebar';
import { VertexLogo } from '../components/VertexLogo';
import { Viewer } from '../components/Viewer';
import { DefaultClientId, DefaultStreamKey, Env } from '../lib/env';
import { Properties, toProperties } from '../lib/metadata';
import { selectByHit } from '../lib/scene-items';
import { getStoredCreds, setStoredCreds, StreamCreds } from '../lib/storage';
import { useViewer } from '../lib/viewer';

function Home(): JSX.Element {
  const router = useRouter();
  const { clientId: queryId, streamKey: queryKey } = router.query;
  const stored = getStoredCreds();
  const viewerCtx = useViewer();
  const [creds, setCreds] = useState<StreamCreds>({
    clientId: queryId?.toString() || stored.clientId || DefaultClientId,
    streamKey: queryKey?.toString() || stored.streamKey || DefaultStreamKey,
  });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [properties, setProperties] = useState<Properties>({});
  const { clientId, streamKey } = creds;

  useEffect(() => {
    router.push(encode(creds));
    setStoredCreds(creds);
  }, [creds]);

  return router.isReady ? (
    <Layout title="Vertex Starter">
      <div className="col-span-full">
        <Header logo={<VertexLogo />}>
          <OpenButton onClick={() => setDialogOpen(true)} />
        </Header>
      </div>
      <div className="flex w-full row-start-2 row-span-full col-span-full">
        {!dialogOpen && clientId && streamKey && viewerCtx.viewerState.isReady && (
          <div className="w-0 flex-grow ml-auto relative">
            <Viewer
              configEnv={Env}
              creds={creds}
              viewer={viewerCtx.viewer}
              onSceneReady={viewerCtx.onSceneReady}
              onSelect={async (hit) => {
                setProperties(toProperties({ hit }));
                await selectByHit({ hit, viewer: viewerCtx.viewer.current });
              }}
            />
          </div>
        )}
        <RightSidebar properties={properties} />
      </div>
      {dialogOpen && (
        <OpenDialog
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
  ) : (
    <></>
  );
}

export default Home;
