import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import Link from "@material-ui/core/Link";

interface Props {
  onOpenSceneClick: () => void;
}

export function Header({ onOpenSceneClick }: Props): JSX.Element {
  return (
    <Box display="flex" justifyContent="space-between" width="100%">
      <Button onClick={() => onOpenSceneClick()} variant="contained">
        Open Scene
      </Button>
      <Link
        href="https://github.com/Vertexvis/vertex-nextjs-starter"
        rel="noreferrer"
        style={{ alignSelf: "center" }}
        target="_blank"
      >
        View on GitHub
      </Link>
    </Box>
  );
}
