import { makeStyles } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { vertexvis } from "@vertexvis/frame-streaming-protos";
import { Vector3 } from "@vertexvis/geometry";
import {
  VertexViewer,
  VertexViewerToolbar,
  VertexViewerViewCube,
  JSX as ViewerJSX,
} from "@vertexvis/viewer-react";
import { Environment } from "@vertexvis/viewer/dist/types/config/environment";
import { FrameCamera } from "@vertexvis/viewer/dist/types/types";
import React from "react";
import { StreamCredentials } from "../lib/env";

interface ViewerProps extends ViewerJSX.VertexViewer {
  readonly credentials: StreamCredentials;
  readonly configEnv: Environment;
  readonly viewer: React.MutableRefObject<HTMLVertexViewerElement | null>;
}

type ViewerComponentType = React.ComponentType<
  ViewerProps & React.RefAttributes<HTMLVertexViewerElement>
>;

type HOCViewerProps = React.RefAttributes<HTMLVertexViewerElement>;

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
    width: "100%",
  },
}));

export const Viewer = onTap(UnwrappedViewer);

function UnwrappedViewer({
  credentials,
  viewer,
  ...props
}: ViewerProps): JSX.Element {
  const AnimationDurationMs = 1500;
  const RenderOptions = { animation: { milliseconds: AnimationDurationMs } };
  const Back = Vector3.back();
  const Origin = Vector3.origin();
  const Right = Vector3.right();
  const Up = Vector3.up();
  const Iso = Vector3.add(Back, Up, Right);
  const { root } = useStyles();

  async function fitAll(): Promise<void> {
    (await viewer.current?.scene())?.camera().viewAll().render(RenderOptions);
  }

  async function iso(): Promise<void> {
    standardView({ position: Iso, lookAt: Origin, up: Up });
  }

  async function standardView(
    camera: Partial<FrameCamera.FrameCamera>
  ): Promise<void> {
    const scene = await viewer.current?.scene();
    await scene?.camera().update(camera).viewAll().render(RenderOptions);
  }

  return (
    <VertexViewer
      className={root}
      clientId={credentials.clientId}
      ref={viewer}
      src={`urn:vertexvis:stream-key:${credentials.streamKey}`}
      {...props}
    >
      <VertexViewerToolbar placement="top-right">
        <VertexViewerViewCube
          animationDuration={AnimationDurationMs}
          viewer={viewer.current ?? undefined}
        />
      </VertexViewerToolbar>
      <VertexViewerToolbar placement="bottom-center">
        <Box mb={2}>
          <ButtonGroup variant="contained">
            <Button onClick={() => iso()}>Iso</Button>
            <Button onClick={() => fitAll()}>Fit all</Button>
          </ButtonGroup>
        </Box>
      </VertexViewerToolbar>
    </VertexViewer>
  );
}

interface OnSelectProps extends HOCViewerProps {
  readonly onSelect: (hit?: vertexvis.protobuf.stream.IHit) => Promise<void>;
}

function onTap<P extends ViewerProps>(
  WrappedViewer: ViewerComponentType
): React.FunctionComponent<P & OnSelectProps> {
  return function Component({ viewer, onSelect, ...props }: P & OnSelectProps) {
    return (
      <WrappedViewer
        viewer={viewer}
        {...props}
        onTap={async (e) => {
          if (props.onTap) props.onTap(e);

          if (!e.defaultPrevented) {
            const scene = await viewer.current?.scene();
            const raycaster = scene?.raycaster();

            if (raycaster != null) {
              const res = await raycaster.hitItems(e.detail.position, {
                includeMetadata: true,
              });
              const hit = (res?.hits ?? [])[0];
              onSelect(hit);
            }
          }
        }}
      />
    );
  };
}
