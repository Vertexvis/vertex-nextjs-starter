import { Environment } from "@vertexvis/viewer";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { Header } from "../components/Header";
import { Layout } from "../components/Layout";
import { encodeCreds, OpenDialog } from "../components/OpenScene";
import { RightDrawer } from "../components/RightDrawer";
import { Viewer } from "../components/Viewer";
import {
  Config,
  DefaultCredentials,
  head,
  StreamCredentials,
} from "../lib/config";
import { FileData, toFileData } from "../lib/files";
import { Metadata, toMetadata } from "../lib/metadata";
import { selectByHit as onSelect } from "../lib/scene-items";
import { useViewer } from "../lib/viewer";

interface Props {
  readonly files: FileData[];
  readonly vertexEnv: Environment;
}

export default function Home({ files, vertexEnv }: Props): JSX.Element {
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
  useHotkeys("o", () => setDialogOpen(true), { keyup: true });

  return router.isReady && credentials ? (
    <Layout
      header={<Header onOpenSceneClick={() => setDialogOpen(true)} />}
      main={
        viewer.isReady && (
          <Viewer
            configEnv={vertexEnv}
            credentials={credentials}
            onSelect={async (hit) => {
              setMetadata(toMetadata({ hit }));
              await onSelect({ hit, viewer: viewer.ref.current });
            }}
            viewer={viewer.ref}
          />
        )
      }
      rightDrawer={<RightDrawer files={files} metadata={metadata} />}
      rightDrawerOpen={true}
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
  const noFiles = { props: { files: [], vertexEnv: Config.vertexEnv } };
  const host = context.req.headers.host;
  if (!host) return noFiles;

  const baseUrl = `http${host.startsWith("localhost") ? "" : "s"}://${host}`;
  const res = await (await fetch(`${baseUrl}/api/files`)).json();
  return res == null || res.errors
    ? noFiles
    : { props: { files: toFileData(res) } };
};
