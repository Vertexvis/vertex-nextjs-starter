import { makeStyles } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Properties } from "../lib/metadata";
import { RightDrawerWidth } from "./Layout";
import { MetadataProperties } from "./MetadataProperties";

interface Props {
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

export function RightDrawer({ properties }: Props): JSX.Element {
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
    </Drawer>
  );
}
