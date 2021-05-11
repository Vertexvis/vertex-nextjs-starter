import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FileData } from "../lib/files";
import { Properties } from "../lib/metadata";
import { RightDrawerWidth } from "./Layout";
import { MetadataProperties } from "./MetadataProperties";
import { RecentFiles } from "./RecentFiles";

interface Props {
  readonly files: FileData[];
  readonly properties: Properties;
}

const useStyles = makeStyles(() => ({
  paper: {
    width: RightDrawerWidth,
  },
  title: {
    textTransform: "uppercase",
  },
}));

export function RightDrawer({ files, properties }: Props): JSX.Element {
  const { paper, title } = useStyles();

  return (
    <Drawer anchor="right" variant="permanent" classes={{ paper }}>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={title} variant="body2">
            Metadata Properties
          </Typography>
        </AccordionSummary>
        <MetadataProperties properties={properties} />
      </Accordion>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography className={title} variant="body2">
            Recent Files
          </Typography>
        </AccordionSummary>
        <RecentFiles files={files} />
      </Accordion>
    </Drawer>
  );
}
