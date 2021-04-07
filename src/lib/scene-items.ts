import { vertexvis } from '@vertexvis/frame-streaming-protos';
import { ColorMaterial, Scene } from '@vertexvis/viewer';

const SelectColor = {
  ...ColorMaterial.create(255, 255, 0),
  glossiness: 4,
  specular: { r: 255, g: 255, b: 255, a: 0 },
};

export interface SceneReq {
  readonly scene?: Scene;
}

interface SelectByHitReq extends SceneReq {
  readonly hit?: vertexvis.protobuf.stream.IHit;
}

export async function hideAll({ scene }: SceneReq): Promise<void> {
  if (scene == null) return;

  await scene.items((op) => [op.where((q) => q.all()).hide()]).execute();
}

export async function selectByHit({
  hit,
  scene,
}: SelectByHitReq): Promise<void> {
  if (scene == null) return;

  const id = hit?.itemId?.hex;
  const suppliedId = hit?.itemSuppliedId?.value;
  if (id) {
    console.debug(`Selected ${id}${suppliedId ? `, ${suppliedId}` : ''}`);

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

export async function showAll({ scene }: SceneReq): Promise<void> {
  if (scene == null) return;

  await scene.items((op) => [op.where((q) => q.all()).show()]).execute();
}
