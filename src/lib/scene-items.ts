import { ColorMaterial, Components } from "@vertexvis/viewer";
import { FrameCamera } from "@vertexvis/viewer/dist/types/lib/types/frameCamera";

interface Req {
  readonly viewer: Components.VertexViewer | null;
}

interface SelectByHitReq extends Req {
  readonly color?: string;
  readonly deselect: boolean;
  readonly itemId?: string;
}

interface UpdateCameraReq extends Req {
  readonly camera: Partial<FrameCamera>;
}

export function createSelectColor(hex: string): ColorMaterial.ColorMaterial {
  return {
    ...ColorMaterial.fromHex(hex),
    glossiness: 4,
    specular: { r: 255, g: 255, b: 255, a: 0 },
  };
}

export async function selectByItemId({
  color = "#ffff00",
  deselect,
  itemId,
  viewer,
}: SelectByHitReq): Promise<void> {
  if (viewer == null) return;

  const scene = await viewer.scene();
  if (scene == null) return;

  if (itemId) {
    await scene
      .items((op) => {
        const de = deselect ? [op.where((q) => q.all()).deselect()] : [];
        return [
          ...de,
          op
            .where((q) => q.withItemId(itemId))
            .select(createSelectColor(color)),
        ];
      })
      .execute();
  } else {
    await scene.items((op) => op.where((q) => q.all()).deselect()).execute();
  }
}

export async function updateCamera({
  camera,
  viewer,
}: UpdateCameraReq): Promise<void> {
  if (viewer == null) return;

  const scene = await viewer.scene();
  if (scene == null) return;

  await scene.camera().update(camera).render();
}
