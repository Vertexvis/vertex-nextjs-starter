import { vertexvis } from "@vertexvis/frame-streaming-protos";
import type { Components } from "@vertexvis/viewer";
import type { ColorMaterial } from "@vertexvis/viewer/dist/types/lib/scenes/colorMaterial";

interface Req {
  readonly viewer: Components.VertexViewer | null;
}

interface SelectByHitReq extends Req {
  readonly hit?: vertexvis.protobuf.stream.IHit;
}

const SelectColor: ColorMaterial = {
  opacity: 100,
  glossiness: 4,
  diffuse: { r: 255, g: 255, b: 0, a: 0 },
  ambient: { r: 0, g: 0, b: 0, a: 0 },
  specular: { r: 255, g: 255, b: 255, a: 0 },
  emissive: { r: 0, g: 0, b: 0, a: 0 },
};

export async function selectByHit({
  hit,
  viewer,
}: SelectByHitReq): Promise<void> {
  if (viewer == null) return;

  const scene = await viewer.scene();
  if (scene == null) return;

  const id = hit?.itemId?.hex;
  if (id) {
    await scene
      .items((op) => [
        op.where((q) => q.all()).deselect(),
        op.where((q) => q.withItemId(id)).select(SelectColor),
      ])
      .execute();
  } else {
    await scene.items((op) => op.where((q) => q.all()).deselect()).execute();
  }
}
