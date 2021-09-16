import { Box, Button, Link } from "@mui/material";
import React from "react";

interface Props {
  readonly onOpenSceneClick: () => void;
}

export function Header({ onOpenSceneClick }: Props): JSX.Element {
  return (
    <Box
      sx={{ display: "flex", justifyContent: "space-between", width: "100%" }}
    >
      <Button onClick={() => onOpenSceneClick()} variant="contained">
        Open Scene
      </Button>
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
