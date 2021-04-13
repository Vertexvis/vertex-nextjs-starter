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
  // Vertex Viewer component context.
  const viewer = useViewer();

  // Prefer credentials in URL to enable easy scene sharing.
  // If they don't exist, check local storage. If empty, use defaults.
  const router = useRouter();
  const { clientId: queryId, streamKey: queryKey } = router.query;
  const stored = getStoredCreds();
  const [creds, setCreds] = useState<StreamCreds>({
    clientId: queryId?.toString() || stored.clientId || DefaultClientId,
    streamKey: queryKey?.toString() || stored.streamKey || DefaultStreamKey,
  });

  // React state for dialog open/close and metadata properties.
  const [dialogOpen, setDialogOpen] = useState(false);
  const [properties, setProperties] = useState<Properties>({});

  // On credentials changes, update URL and store in local storage.
  useEffect(() => {
    router.push(encode(creds));
    setStoredCreds(creds);
  }, [creds]);

  // Ensure router is ready so if credentials exist in URL, we use them
  return router.isReady ? (
    <Layout title="Vertex Starter">
      <div className="col-span-full">
        <Header logo={<VertexLogo />}>
          <OpenButton onClick={() => setDialogOpen(true)} />
        </Header>
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
      <div className="flex w-full row-start-2 row-span-full col-span-full">
        {creds.clientId && creds.streamKey && viewer.isReady && (
          <div className="w-0 flex-grow ml-auto relative">
            <Viewer
              configEnv={Env}
              creds={creds}
              viewer={viewer.ref}
              onSelect={async (hit) => {
                setProperties(toProperties({ hit }));
                await selectByHit({ hit, viewer: viewer.ref.current });
              }}
            />
          </div>
        )}
        <RightSidebar properties={properties} />
      </div>
    </Layout>
  ) : (
    <></>
  );
}

export default Home;
