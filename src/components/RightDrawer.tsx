import { experimentalStyled as styled } from "@material-ui/core/styles";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MuiDrawer, { getDrawerUtilityClass } from "@material-ui/core/Drawer";
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

const Drawer = styled((props) => (
  <MuiDrawer anchor="right" variant="permanent" {...props} />
))(() => {
  return {
    [`& .${getDrawerUtilityClass("paper")}`]: { width: RightDrawerWidth },
  };
});

const Title = styled((props) => <Typography variant="body2" {...props} />)(
  () => ({ textTransform: "uppercase" })
);

export function RightDrawer({ files, properties }: Props): JSX.Element {
  return (
    <Drawer>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Title>Metadata Properties</Title>
        </AccordionSummary>
        <MetadataProperties properties={properties} />
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
