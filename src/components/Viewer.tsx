/* @jsx jsx */ /** @jsxRuntime classic */ import { jsx } from "@emotion/react";
import { SpeedDial, SpeedDialAction } from "@material-ui/core";
import { ZoomOutMap } from "@material-ui/icons";
import { vertexvis } from "@vertexvis/frame-streaming-protos";
import {
  JSX as ViewerJSX,
  VertexViewer,
  VertexViewerToolbar,
  VertexViewerViewCube,
} from "@vertexvis/viewer-react";
import React from "react";

import { StreamCredentials } from "../lib/env";

interface ViewerProps extends ViewerJSX.VertexViewer {
  readonly credentials: StreamCredentials;
  readonly viewer: React.MutableRefObject<HTMLVertexViewerElement | null>;
}

interface Action {
  icon: React.ReactNode;
  name: string;
  onClick: () => void;
}

type ViewerComponentType = React.ComponentType<
  ViewerProps & React.RefAttributes<HTMLVertexViewerElement>
>;

type HOCViewerProps = React.RefAttributes<HTMLVertexViewerElement>;

export const Viewer = onTap(UnwrappedViewer);

function UnwrappedViewer({
  credentials,
  viewer,
  ...props
}: ViewerProps): JSX.Element {
  const AnimationDurationMs = 1500;

  const viewActions: Action[] = [
    {
      icon: <ZoomOutMap />,
      name: "Fit all",
      onClick: () => fitAll(),
    },
  ];

  async function fitAll(): Promise<void> {
    (await viewer.current?.scene())
      ?.camera()
      .viewAll()
      .render({ animation: { milliseconds: AnimationDurationMs } });
  }

  return (
    <VertexViewer
      css={{ height: "100%", width: "100%" }}
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
      <VertexViewerToolbar placement="bottom-right">
        <SpeedDial
          ariaLabel="Viewer toolbar"
          hidden={true}
          open={true}
          sx={{ mr: 3, mb: 2 }}
        >
          {viewActions.map((action) => (
            <SpeedDialAction
              icon={action.icon}
              key={action.name}
              onClick={() => action.onClick()}
              tooltipTitle={action.name}
            />
          ))}
        </SpeedDial>
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
              await onSelect(hit);
            }
          }
        }}
      />
    );
  };
}
