import { vertexvis } from "@vertexvis/frame-streaming-protos";
import { ColorMaterial, Components } from "@vertexvis/viewer";

interface Req {
  readonly viewer: Components.VertexViewer | null;
}

interface SelectByHitReq extends Req {
  readonly deselectItemId?: string;
  readonly hit?: vertexvis.protobuf.stream.IHit;
}

const SelectColor = {
  ...ColorMaterial.create(255, 255, 0),
  glossiness: 4,
  specular: { r: 255, g: 255, b: 255, a: 0 },
};

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
          op.where((q) => q.withItemId(itemId)).select(SelectColor),
        ];
      })
      .execute();
  } else if (deselectItemId) {
    await scene
      .items((op) => [op.where((q) => q.withItemId(deselectItemId)).deselect()])
      .execute();
  }
}
