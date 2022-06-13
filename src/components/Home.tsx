import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

import {
  Configuration,
  DefaultCredentials,
  head,
  StreamCredentials,
} from '../lib/config';
import { FileData } from '../lib/files';
import { Metadata, toMetadata } from '../lib/metadata';
import { selectByHit } from '../lib/scene-items';
import { useViewer } from '../lib/viewer';
import { Header } from './Header';
import { Layout, RightDrawerWidth } from './Layout';
import { encodeCreds, OpenDialog } from './OpenScene';
import { RightDrawer } from './RightDrawer';

const Viewer = dynamic(() => import('./Viewer'), { ssr: false });

export interface Props {
  readonly config: Configuration;
  readonly files: FileData[];
}

export function Home({ files, config: { network } }: Props): JSX.Element {
  const router = useRouter();
  const viewer = useViewer();
  const [credentials, setCredentials] = React.useState<
    StreamCredentials | undefined
  >();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [metadata, setMetadata] = React.useState<Metadata | undefined>();

  // Prefer credentials in URL to enable easy scene sharing. If empty, use defaults.
  React.useEffect(() => {
    if (!router.isReady) return;

    setCredentials({
      clientId: head(router.query.clientId) || DefaultCredentials.clientId,
      streamKey: head(router.query.streamKey) || DefaultCredentials.streamKey,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  // On credentials changes, update URL.
  React.useEffect(() => {
    if (credentials) router.push(encodeCreds(credentials));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials]);

  // Open dialog if 'o' key pressed
  useHotkeys('o', () => setDialogOpen(true), { keyup: true });

  return router.isReady && credentials ? (
    <Layout
      header={<Header onOpenSceneClick={() => setDialogOpen(true)} />}
      main={
        viewer.isReady && (
          <Viewer
            config={JSON.stringify({ network })}
            credentials={credentials}
            onSelect={async (hit) => {
              console.debug({
                hitNormal: hit?.hitNormal,
                hitPoint: hit?.hitPoint,
                sceneItemId: hit?.itemId?.hex,
                sceneItemSuppliedId: hit?.itemSuppliedId?.value,
              });
              await selectByHit({
                deselectItemId: metadata?.itemId,
                hit,
                viewer: viewer.ref.current,
              });
              setMetadata(toMetadata({ hit }));
            }}
            viewer={viewer.ref}
          />
        )
      }
      rightDrawer={<RightDrawer files={files} metadata={metadata} open />}
      rightDrawerWidth={RightDrawerWidth}
    >
      {dialogOpen && (
        <OpenDialog
          credentials={credentials}
          onClose={() => setDialogOpen(false)}
          onConfirm={(cs) => {
            setCredentials(cs);
            setDialogOpen(false);
          }}
          open={dialogOpen}
        />
      )}
    </Layout>
  ) : (
    <></>
  );
}
