import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import { vertexvis } from "@vertexvis/frame-streaming-protos";
import { Vector3 } from "@vertexvis/geometry";
import {
  VertexViewer,
  VertexViewerToolbar,
  JSX as ViewerJSX,
} from "@vertexvis/viewer-react";
import { Environment } from "@vertexvis/viewer/dist/types/config/environment";
import { FrameCamera } from "@vertexvis/viewer/dist/types/types";
import React from "react";
import { StreamCredentials } from "../lib/storage";

export interface ViewerProps extends ViewerJSX.VertexViewer {
  readonly credentials: StreamCredentials;
  readonly configEnv: Environment;
  readonly viewer: React.MutableRefObject<HTMLVertexViewerElement | null>;
}

export type ViewerComponentType = React.ComponentType<
  ViewerProps & React.RefAttributes<HTMLVertexViewerElement>
>;

export type HOCViewerProps = React.RefAttributes<HTMLVertexViewerElement>;

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
    width: "100%",
  },
  toolbar: {
    marginBottom: theme.spacing(2),
  },
}));

function UnwrappedViewer({
  credentials,
  viewer,
  ...props
}: ViewerProps): JSX.Element {
  const { root, toolbar } = useStyles();
  const RenderOptions = { animation: { milliseconds: 1500 } };
  const Back = Vector3.back();
  const Origin = Vector3.origin();
  const Right = Vector3.right();
  const Up = Vector3.up();
  const Iso = Vector3.add(Back, Up, Right);

  async function fitAll(): Promise<void> {
    (await viewer.current?.scene())?.camera().viewAll().render(RenderOptions);
  }

  async function iso(): Promise<void> {
    standardView({ position: Iso, lookAt: Origin, up: Up });
  }

  async function right(): Promise<void> {
    standardView({ position: Right, lookAt: Origin, up: Up });
  }

  async function top(): Promise<void> {
    standardView({ position: Up, lookAt: Origin, up: Vector3.forward() });
  }

  async function front(): Promise<void> {
    standardView({ position: Back, lookAt: Origin, up: Up });
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
      <VertexViewerToolbar className={toolbar}>
        <ButtonGroup variant="contained">
          <Button onClick={() => iso()}>Iso</Button>
          <Button onClick={() => right()}>+X</Button>
          <Button onClick={() => top()}>+Y</Button>
          <Button onClick={() => front()}>+Z</Button>
          <Button onClick={() => fitAll()}>Fit all</Button>
        </ButtonGroup>
      </VertexViewerToolbar>
    </VertexViewer>
  );
}

export const Viewer = onTap(UnwrappedViewer);

export interface OnSelectProps extends HOCViewerProps {
  readonly onSelect: (hit?: vertexvis.protobuf.stream.IHit) => Promise<void>;
}

export function onTap<P extends ViewerProps>(
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
