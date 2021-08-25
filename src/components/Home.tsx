import type { Environment } from "@vertexvis/viewer";
import { FrameCamera } from "@vertexvis/viewer/dist/types/lib/types/frameCamera";
import { useRouter } from "next/router";
import React from "react";
import { useHotkeys } from "react-hotkeys-hook";
import { WebrtcProvider } from "y-webrtc";
import * as Y from "yjs";

import { DefaultCredentials, head, StreamCredentials } from "../lib/config";
import { FileData } from "../lib/files";
import { Metadata, toMetadata } from "../lib/metadata";
import { selectByItemId, updateCamera } from "../lib/scene-items";
import { useViewer } from "../lib/viewer";
import { Header } from "./Header";
import { Layout, RightDrawerWidth } from "./Layout";
import { encodeCreds, OpenDialog } from "./OpenScene";
import { RightDrawer } from "./RightDrawer";
import { Viewer } from "./Viewer";

export interface Props {
  readonly files: FileData[];
  readonly vertexEnv: Environment;
}

const CameraKey = "camera";
const Colors = [
  "#30bced",
  "#6eeb83",
  "#ffbc42",
  "#ecd444",
  "#ee6352",
  "#9ac2c9",
  "#8acb88",
  "#1be7ff",
];
const name = `Rocky${(Math.random() * 100).toFixed(0)}`;
const color = Colors[Math.floor(Math.random() * Colors.length)];

export function Home({ files, vertexEnv }: Props): JSX.Element {
  const router = useRouter();
  const viewer = useViewer();
  const [credentials, setCredentials] = React.useState<
    StreamCredentials | undefined
  >();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [metadata, setMetadata] = React.useState<Metadata | undefined>();
  const provider = React.useRef<WebrtcProvider>();
  const doc = React.useRef(new Y.Doc());
  // const yCamera = React.useRef(doc.current.getMap());
  const ySelection = React.useRef(doc.current.getMap());
  // const undoManager = React.useRef(new Y.UndoManager(yCamera.current));
  // const [camera, setCamera] = React.useState<Partial<FrameCamera>>();
  const [selection, setSelection] = React.useState<{ [id: string]: string }>(
    {}
  );

  // React.useEffect(() => {
  //   const sharedC = yCamera.current.get(CameraKey);
  //   if (sharedC != null) {
  //     const c = JSON.parse(sharedC);
  //     if (c !== camera) {
  //       console.log("Updating camera");
  //       updateCamera(c);
  //     }
  //   }
  // }, [camera]);

  React.useEffect(() => {
    if (!provider.current?.connected) {
      provider.current = new WebrtcProvider("vertex-demo", doc.current);
      provider.current.awareness.setLocalStateField("user", { name, color });
      ySelection.current.observe(() => {
        ySelection.current.forEach(({ color, itemId }, k) => {
          if (k !== name) {
            console.log("ySelection", k, color, itemId);
            selectByItemId({ color, itemId, viewer: viewer.ref.current });
          }
        });
      });
      provider.current.awareness.on("change", () => {
        // const strings = [];
        provider.current?.awareness.getStates().forEach((state) => {
          console.log("State", state);
          // if (state.user) {
          //   strings.push(
          //     `<div style="color:${state.user.color};">• ${state.user.name}</div>`
          //   );
          // }
          // document.querySelector("#users").innerHTML = strings.join("");
        });
      });
    }
  }, []);

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
            // onFrameDrawn={(e) => {
            //   const { lookAt, position, up } = e.detail.scene.camera;
            //   const c = { lookAt, position, up };
            //   setCamera(c);
            //   yCamera.current.set(CameraKey, JSON.stringify(c));
            // }}
            onSelect={async (hit) => {
              console.debug({
                hitNormal: hit?.hitNormal,
                hitPoint: hit?.hitPoint,
                partName: hit?.metadata?.partName,
                sceneItemId: hit?.itemId?.hex,
                sceneItemSuppliedId: hit?.itemSuppliedId?.value,
              });
              setMetadata(toMetadata({ hit }));
              await selectByItemId({
                itemId: hit?.itemId?.hex ?? undefined,
                viewer: viewer.ref.current,
              });
              if (hit?.itemId?.hex != null) {
                ySelection.current.set(name, { itemId: hit.itemId.hex, color });
              }
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
          onConfirm={(cs: StreamCredentials) => {
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
