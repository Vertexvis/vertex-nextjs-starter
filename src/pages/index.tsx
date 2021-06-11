import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";

import { Header } from "../components/Header";
import { Layout } from "../components/Layout";
import { encodeCreds, OpenDialog } from "../components/OpenScene";
import { RightDrawer } from "../components/RightDrawer";
import { Viewer } from "../components/Viewer";
import { DefaultCredentials, Env, head, StreamCredentials } from "../lib/env";
import { FileData, toFileData } from "../lib/files";
import { useKeyListener } from "../lib/key-listener";
import { Metadata, toMetadata } from "../lib/metadata";
import { selectByHit } from "../lib/scene-items";
import { useViewer } from "../lib/viewer";

interface Props {
  readonly files: FileData[];
}

export default function Home({ files }: Props): JSX.Element {
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
  const keys = useKeyListener();
  React.useEffect(() => {
    if (!dialogOpen && keys.o) setDialogOpen(true);
  }, [dialogOpen, keys]);

  return router.isReady && credentials ? (
    <Layout
      header={<Header onOpenSceneClick={() => setDialogOpen(true)} />}
      main={
        viewer.isReady && (
          <Viewer
            configEnv={Env}
            credentials={credentials}
            onSelect={async (hit) => {
              setMetadata(toMetadata({ hit }));
              await selectByHit({ hit, viewer: viewer.ref.current });
            }}
            viewer={viewer.ref}
          />
        )
      }
      rightDrawer={<RightDrawer files={files} metadata={metadata} />}
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const noFiles = { props: { files: [] } };
  const host = context.req.headers.host;
  if (!host) return noFiles;

  const baseUrl = `http${host.startsWith("localhost") ? "" : "s"}://${host}`;
  const res = await (await fetch(`${baseUrl}/api/files`)).json();
  return res == null || res.errors
    ? noFiles
    : { props: { files: toFileData(res) } };
};
