import { vertexvis } from '@vertexvis/frame-streaming-protos';
import { Components } from '@vertexvis/viewer';

interface Req {
  readonly viewer: Components.VertexViewer | null;
}

interface SelectByHitReq extends Req {
  readonly deselectItemId?: string;
  readonly hit?: vertexvis.protobuf.stream.IHit;
}

export async function selectByHit({
  deselectItemId,
  hit,
  viewer,
}: SelectByHitReq): Promise<void> {
  if (viewer == null) return;

  const scene = await viewer.scene();
  if (scene == null) return;

  const itemId = hit?.itemId?.hex;
  if (itemId) {
    await scene
      .items((op) => {
        return [
          ...(deselectItemId
            ? [op.where((q) => q.withItemId(deselectItemId)).deselect()]
            : []),
          op.where((q) => q.withItemId(itemId)).select(),
        ];
      })
      .execute();
  } else if (deselectItemId) {
    await scene
      .items((op) => [op.where((q) => q.withItemId(deselectItemId)).deselect()])
      .execute();
  }
}
