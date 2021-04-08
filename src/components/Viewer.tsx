import { vertexvis } from '@vertexvis/frame-streaming-protos';
import { Vector3 } from '@vertexvis/geometry';
import {
  VertexViewer,
  VertexViewerToolbar,
  VertexViewerToolbarGroup,
  VertexViewerButton,
  JSX as ViewerJSX,
} from '@vertexvis/viewer-react';
import { Environment } from '@vertexvis/viewer/dist/types/config/environment';
import { FrameCamera } from '@vertexvis/viewer/dist/types/types';
import React, {
  ComponentType,
  FunctionComponent,
  MutableRefObject,
  RefAttributes,
} from 'react';
import { StreamCreds } from '../lib/storage';

export interface ViewerProps extends ViewerJSX.VertexViewer {
  readonly creds: StreamCreds;
  readonly configEnv: Environment;
  readonly viewer: MutableRefObject<HTMLVertexViewerElement | null>;
}

export type ViewerComponentType = ComponentType<
  ViewerProps & RefAttributes<HTMLVertexViewerElement>
>;

export type HOCViewerProps = RefAttributes<HTMLVertexViewerElement>;

export function Viewer({ creds, viewer, ...props }: ViewerProps): JSX.Element {
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
      ref={viewer}
      className="w-full h-full"
      src={`urn:vertexvis:stream-key:${creds.streamKey}`}
      {...props}
    >
      <VertexViewerToolbar>
        <VertexViewerToolbarGroup>
          <VertexViewerButton className="mr-4" onClick={() => iso()}>
            Iso
          </VertexViewerButton>
          <VertexViewerButton className="mr-4" onClick={() => right()}>
            +X
          </VertexViewerButton>
          <VertexViewerButton className="mr-4" onClick={() => top()}>
            +Y
          </VertexViewerButton>
          <VertexViewerButton className="mr-4" onClick={() => front()}>
            +Z
          </VertexViewerButton>
          <VertexViewerButton className="" onClick={() => fitAll()}>
            Fit all
          </VertexViewerButton>
        </VertexViewerToolbarGroup>
      </VertexViewerToolbar>
    </VertexViewer>
  );
}

export interface OnSelectProps extends HOCViewerProps {
  readonly onSelect: (hit?: vertexvis.protobuf.stream.IHit) => Promise<void>;
}

export function onTap<P extends ViewerProps>(
  WrappedViewer: ViewerComponentType
): FunctionComponent<P & OnSelectProps> {
  return function Component({ viewer, onSelect, ...props }) {
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
