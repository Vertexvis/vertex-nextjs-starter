import {
  Accordion,
  AccordionSummary,
  Drawer as MuiDrawer,
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

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  display: "block",
  width: RightDrawerWidth,
  [`& .${drawerClasses.paper}`]: { width: RightDrawerWidth },
  [theme.breakpoints.down("md")]: {
    display: "none",
  },
}));

const Title = styled((props) => <Typography variant="body2" {...props} />)(
  () => ({ textTransform: "uppercase" })
);

export function RightDrawer({ files, metadata }: Props): JSX.Element {
  return (
    <Drawer
      anchor="right"
      sx={{ display: { xl: "none", xs: "block" } }}
      variant="permanent"
    >
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Title>Metadata Properties</Title>
        </AccordionSummary>
        <MetadataProperties metadata={metadata} />
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Title>Recent Files</Title>
        </AccordionSummary>
        <RecentFiles files={files} />
      </Accordion>
    </Drawer>
  );
}
