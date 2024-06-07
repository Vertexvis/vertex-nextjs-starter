import { useRouter } from "next/router";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";

import {
  Configuration,
  DefaultCredentials,
  StreamCredentials,
} from "../lib/config";
import { FileData } from "../lib/files";
import { Metadata, toMetadata } from "../lib/metadata";
import { selectByHit } from "../lib/scene-items";
import { useViewer } from "../lib/viewer";
import { Header } from "./Header";
import { Layout, RightDrawerWidth } from "./Layout";
import { encodeCreds, OpenDialog } from "./OpenScene";
import { RightDrawer } from "./RightDrawer";
import { Viewer } from "./Viewer";

export interface Props {
  readonly baseUrl: string;
  readonly config: Configuration;
  readonly files: FileData[];
  readonly streamCredentials: StreamCredentials;
}

export function Home({ baseUrl, files, streamCredentials, config: { network } }: Props): JSX.Element {
  const router = useRouter();
  const viewer = useViewer();
  const [credentials, setCredentials] = React.useState<
    StreamCredentials | undefined
  >(streamCredentials);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [metadata, setMetadata] = React.useState<Metadata | undefined>();

  // Prefer credentials in URL to enable easy scene sharing. If empty, use defaults.
  React.useEffect(() => {
    if (!router.isReady) return;

    setCredentials({
      clientId: streamCredentials.clientId || DefaultCredentials.clientId,
      streamKey: streamCredentials.streamKey || DefaultCredentials.streamKey,
      suppliedId: streamCredentials.suppliedId || DefaultCredentials.suppliedId,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  // On credentials changes, update URL.
  React.useEffect(() => {
    if (credentials) router.push(encodeCreds(credentials));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials]);

  // Open dialog if 'o' key pressed
  useHotkeys("o", () => setDialogOpen(true), { keyup: true });

  return router.isReady && credentials ? (
    <Layout
      header={<Header onOpenSceneClick={() => setDialogOpen(true)} />}
      main={
        viewer.isReady && (
          <Viewer
            config={JSON.stringify({ network })}
            credentials={{ clientId: credentials.clientId, streamKey: credentials.streamKey}}
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
            window.location.assign(`${baseUrl}/?suppliedId=${cs.suppliedId}`);
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
