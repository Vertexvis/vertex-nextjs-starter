import Typography from "@material-ui/core/Typography";
import React from "react";

export function NoData(): JSX.Element {
  return (
    <Typography sx={{ mx: 2, mb: 2 }} variant="body2">
      No data
    </Typography>
  );
}
