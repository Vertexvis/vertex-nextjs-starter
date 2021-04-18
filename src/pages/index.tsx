import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import { useRouter } from "next/router";
import React from "react";
import { encodeCreds, OpenButton, OpenDialog } from "../components/OpenScene";
import { RightDrawer, RightDrawerWidth } from "../components/RightDrawer";
import { Viewer } from "../components/Viewer";
import { DefaultClientId, DefaultStreamKey, Env } from "../lib/env";
import { useKeyListener } from "../lib/key-listener";
import { Properties, toProperties } from "../lib/metadata";
import { selectByHit } from "../lib/scene-items";
import {
  getStoredCreds,
  setStoredCreds,
  StreamCredentials,
} from "../lib/storage";
import { useViewer } from "../lib/viewer";

const DenseToolbarHeight = 48;
const useStyles = makeStyles((theme) => ({
  appBar: {
    marginRight: RightDrawerWidth,
    width: `calc(100% - ${RightDrawerWidth}px)`,
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    height: `calc(100% - ${DenseToolbarHeight}px)`,
    width: `calc(100% - ${RightDrawerWidth}px)`,
  },
  offset: {
    minHeight: `${DenseToolbarHeight}px`,
  },
  root: {
    height: `100vh`,
    display: "flex",
  },
}));

export default function Dashboard(): JSX.Element {
  // Prefer credentials in URL to enable easy scene sharing.
  // If they don't exist, check local storage. If empty, use defaults.
  const router = useRouter();
  const { clientId: queryId, streamKey: queryKey } = router.query;
  const stored = getStoredCreds();
  const [credentials, setCredentials] = React.useState<StreamCredentials>({
    clientId: queryId?.toString() || stored.clientId || DefaultClientId,
    streamKey: queryKey?.toString() || stored.streamKey || DefaultStreamKey,
  });

  // On credentials changes, update URL and store in local storage.
  React.useEffect(() => {
    router.push(encodeCreds(credentials));
    setStoredCreds(credentials);
  }, [credentials]);

  // Open dialog if 'o' key pressed
  const keys = useKeyListener();
  React.useEffect(() => {
    if (!dialogOpen && keys.o) setDialogOpen(true);
  }, [keys]);

  const viewer = useViewer();
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [properties, setProperties] = React.useState<Properties>({});
  const { appBar, content, offset, root } = useStyles();

  return (
    <div className={root}>
      <AppBar position="fixed" elevation={1} color="default" className={appBar}>
        <Toolbar variant="dense">
          <OpenButton onClick={() => setDialogOpen(true)} />
        </Toolbar>
      </AppBar>
      <main className={content}>
        <div className={offset} />
        {credentials.clientId && credentials.streamKey && viewer.isReady && (
          <Viewer
            configEnv={Env}
            credentials={credentials}
            viewer={viewer.ref}
            onSelect={async (hit) => {
              setProperties(toProperties({ hit }));
              await selectByHit({ hit, viewer: viewer.ref.current });
            }}
          />
        )}
      </main>
      <RightDrawer properties={properties} />
      {dialogOpen && (
        <OpenDialog
          credentials={credentials}
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onConfirm={(cs) => {
            setCredentials(cs);
            setDialogOpen(false);
          }}
        />
      )}
    </div>
  );
}
