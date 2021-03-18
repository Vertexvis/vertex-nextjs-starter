import { VertexViewer, JSX as ViewerJSX } from '@vertexvis/viewer-react';
import { Environment } from '@vertexvis/viewer/dist/types/config/environment';
import { TapEventDetails } from '@vertexvis/viewer/dist/types/interactions/tapEventDetails';
import React, { RefAttributes } from 'react';
import { vertexvis } from '@vertexvis/frame-streaming-protos';

export interface ViewerProps extends ViewerJSX.VertexViewer {
  clientId: string;
  streamKey: string;
  configEnv: Environment;
  viewer: React.MutableRefObject<HTMLVertexViewerElement | null>;
}

export type ViewerComponentType = React.ComponentType<
  ViewerProps & RefAttributes<HTMLVertexViewerElement>
>;

export type HOCViewerProps = RefAttributes<HTMLVertexViewerElement>;

export function Viewer({
  streamKey,
  viewer,
  ...props
}: ViewerProps): JSX.Element {
  return (
    <VertexViewer
      ref={viewer}
      className="w-full h-full"
      src={`urn:vertexvis:stream-key:${streamKey}`}
      {...props}
    />
  );
}

export interface OnSelectProps extends HOCViewerProps {
  onSelect: (hit?: vertexvis.protobuf.stream.IHit) => Promise<void>;
}

export function onTap<P extends ViewerProps>(
  WrappedViewer: ViewerComponentType
): React.FunctionComponent<P & OnSelectProps> {
  return function Component({ viewer, onSelect, ...props }) {
    return (
      <WrappedViewer
        viewer={viewer}
        {...props}
        onTap={async (event: CustomEvent<TapEventDetails>) => {
          if (props.onTap) {
            props.onTap(event);
          }

          if (!event.defaultPrevented) {
            const scene = await viewer.current?.scene();
            const viewId = scene?.sceneViewId;
            const raycaster = scene?.raycaster();

            if (raycaster != null && viewId != null) {
              const res = await raycaster.hitItems(event.detail.position);
              const hit = (res?.hits || [])[0];
              onSelect(hit);
            }
          }
        }}
      />
    );
  };
}
