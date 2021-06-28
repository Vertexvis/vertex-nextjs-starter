import {
  Accordion,
  AccordionSummary,
  Drawer,
  Typography,
} from "@material-ui/core";
import { drawerClasses } from "@material-ui/core/Drawer";
import { styled } from "@material-ui/core/styles";
import { ExpandMore } from "@material-ui/icons";
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

const Title = styled((props) => <Typography variant="body2" {...props} />)(
  () => ({ textTransform: "uppercase" })
);

export function RightDrawer({ files, metadata }: Props): JSX.Element {
  return (
    <Drawer
      anchor="right"
      sx={{
        display: { sm: "block", xs: "none" },
        width: RightDrawerWidth,
        [`& .${drawerClasses.paper}`]: { width: RightDrawerWidth },
      }}
      variant="permanent"
    >
      <Accordion expanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Title>Metadata Properties</Title>
        </AccordionSummary>
        <MetadataProperties metadata={metadata} />
      </Accordion>
      <Accordion expanded>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Title>Recent Files</Title>
        </AccordionSummary>
        <RecentFiles files={files} />
      </Accordion>
    </Drawer>
  );
}
