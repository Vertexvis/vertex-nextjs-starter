import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { Header } from "../components/Header";
import { Layout } from "../components/Layout";
import { encodeCreds, OpenDialog } from "../components/OpenScene";
import { RightDrawer } from "../components/RightDrawer";
import { Viewer } from "../components/Viewer";
import { DefaultClientId, DefaultStreamKey, Env } from "../lib/env";
import { FileData, toFileData } from "../lib/files";
import { useKeyListener } from "../lib/key-listener";
import { Properties, toProperties } from "../lib/metadata";
import { selectByHit } from "../lib/scene-items";
import {
  getStoredCreds,
  head,
  setStoredCreds,
  StreamCredentials,
} from "../lib/storage";
import { useViewer } from "../lib/viewer";

interface Props {
  readonly files: FileData[];
}

export default function Home({ files }: Props): JSX.Element {
  const router = useRouter();
  const viewer = useViewer();
  const [credentials, setCredentials] =
    React.useState<StreamCredentials | undefined>();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [properties, setProperties] = React.useState<Properties>({});

  // Prefer credentials in URL to enable easy scene sharing.
  // If they don't exist, check local storage. If empty, use defaults.
  React.useEffect(() => {
    if (!router.isReady) return;

    const { clientId, streamKey } = router.query;
    const stored = getStoredCreds();
    setCredentials({
      clientId: head(clientId) || stored?.clientId || DefaultClientId,
      streamKey: head(streamKey) || stored?.streamKey || DefaultStreamKey,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady]);

  // On credentials changes, update URL and store in local storage.
  React.useEffect(() => {
    if (!credentials) return;

    router.push(encodeCreds(credentials));
    setStoredCreds(credentials);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [credentials]);

  // Open dialog if 'o' key pressed
  const keys = useKeyListener();
  React.useEffect(() => {
    if (!dialogOpen && keys.o) setDialogOpen(true);
  }, [dialogOpen, keys]);

  return (
    <Layout
      header={<Header onOpenSceneClick={() => setDialogOpen(true)} />}
      main={
        credentials != null &&
        viewer.isReady && (
          <Viewer
            configEnv={Env}
            credentials={credentials}
            onSelect={async (hit) => {
              setProperties(toProperties({ hit }));
              await selectByHit({ hit, viewer: viewer.ref.current });
            }}
            viewer={viewer.ref}
          />
        )
      }
      rightDrawer={<RightDrawer files={files} properties={properties} />}
    >
      {credentials && dialogOpen && (
        <OpenDialog
          credentials={credentials}
          defaultCredentials={{
            clientId: DefaultClientId,
            streamKey: DefaultStreamKey,
          }}
          onClose={() => setDialogOpen(false)}
          onConfirm={(cs) => {
            setCredentials(cs);
            setDialogOpen(false);
          }}
          open={dialogOpen}
        />
      )}
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const noFiles = { props: { files: [] } };
  const host = context.req.headers.host;
  if (!host) return noFiles;

  const baseUrl = `http${host.startsWith("localhost") ? "" : "s"}://${host}`;
  const res = await (await fetch(`${baseUrl}/api/files`)).json();
  return res == null ? noFiles : { props: { files: toFileData(res) } };
};
