import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Link from "@mui/material/Link";
import React from "react";

interface Props {
  readonly onOpenSceneClick: VoidFunction;
}

async function go() {
    const viewer = document.getElementsByTagName('vertex-viewer')[0] as HTMLVertexViewerElement;
    const scene = await viewer.scene();

    // scene ID 7ef8c76d-837c-4a54-87ee-9597bb7fe97f, tt114_988h_lwl_brep.zip, may 25 2022
    const seat = '2b09d3d6-8d37-49ac-851a-95815bbb1e59';
    const cabin = '070e1af2-85b0-4ed9-84d1-db297568b067';
    const lump = '1f13e1c4-360c-4968-92b9-3423cf999380';

    const fa = scene.camera().flyTo({
        boundingBox: {min: {x: -2000, y: -2000, z: -2000}, max: {x: 2000, y: 2000, z: 2000}}
    }).render({
        animation: {
            milliseconds: 300
        }
    });
    // await fa;

    await scene
        .items((op) => {
            return [
                op.where((q) => q.all()).setPhantom().hide(),
                op.where((q) => q.withItemId(cabin)).show().setPhantom(),
                op.where((q) => q.withItemId(seat)).show().clearPhantom(),
            ].filter((i) => i != null);
        })
        .execute();

    await new Promise(r => setTimeout(r, 200));

    const fb = scene.camera().flyTo({
        boundingBox: {min: {x: -3000, y: -2000, z: -2000}, max: {x: 1000, y: 2000, z: 2000}}
    }).render({
        animation: {
            milliseconds: 300
        }
    });
    // await fb;

    await scene
        .items((op) => {
            return [
                op.where((q) => q.all()).setPhantom().hide(),
                op.where((q) => q.withItemId(lump)).show().setPhantom(),
                op.where((q) => q.withItemId(cabin)).show().clearPhantom(),
            ].filter((i) => i != null);
        })
        .execute();
}

export function Header({ onOpenSceneClick }: Props): JSX.Element {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
    >
      <Button onClick={() => onOpenSceneClick()} variant="contained">
        Open Scene
      </Button>
      <Button onClick={() => go()}>go</Button>
      <Link
        href="https://github.com/Vertexvis/vertex-nextjs-starter"
        rel="noreferrer"
        sx={{ alignSelf: "center" }}
        target="_blank"
      >
        View on GitHub
      </Link>
    </Box>
  );
}
