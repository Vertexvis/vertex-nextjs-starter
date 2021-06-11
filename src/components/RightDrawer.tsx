import {
  Accordion,
  AccordionSummary,
  Drawer as MuiDrawer,
  Typography,
} from "@material-ui/core";
import { getDrawerUtilityClass } from "@material-ui/core/Drawer";
import { styled } from "@material-ui/core/styles";
import dynamic from "next/dynamic";
import React from "react";

import { FileData } from "../lib/files";
import { Metadata } from "../lib/metadata";
import { RightDrawerWidth } from "./Layout";
import { MetadataProperties } from "./MetadataProperties";
import { RecentFiles } from "./RecentFiles";

interface Props {
  readonly files: FileData[];
  readonly metadata?: Metadata;
}

// Temporary until this revert is published, https://github.com/mui-org/material-ui/pull/26310
const ExpandMoreIcon = dynamic(() => import("@material-ui/icons/ExpandMore"), {
  ssr: false,
});

const Drawer = styled((props) => (
  <MuiDrawer
    anchor="right"
    sx={{ display: { xl: "none", xs: "block" } }}
    variant="permanent"
    {...props}
  />
))(({ theme }) => {
  return {
    [`& .${getDrawerUtilityClass("paper")}`]: { width: RightDrawerWidth },
    display: "block",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  };
});

const Title = styled((props) => <Typography variant="body2" {...props} />)(
  () => ({ textTransform: "uppercase" })
);

export function RightDrawer({ files, metadata }: Props): JSX.Element {
  return (
    <Drawer>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Title>Metadata Properties</Title>
        </AccordionSummary>
        <MetadataProperties metadata={metadata} />
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Title>Recent Files</Title>
        </AccordionSummary>
        <RecentFiles files={files} />
      </Accordion>
    </Drawer>
  );
}
