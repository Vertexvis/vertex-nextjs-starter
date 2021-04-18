import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { Properties } from "../lib/metadata";

interface Props {
  readonly properties: Properties;
}

const useStyles = makeStyles((theme) => ({
  empty: {
    padding: `${theme.spacing(1)}px ${theme.spacing(2)}px`,
  },
  root: {
    padding: theme.spacing(0.5),
  },
  table: {
    marginBottom: theme.spacing(1),
  },
}));

export function MetadataProperties({ properties }: Props): JSX.Element {
  const { empty, root, table } = useStyles();
  const propKeys = Object.keys(properties);

  return propKeys.length > 0 ? (
    <TableContainer className={root}>
      <Table className={table} padding="checkbox" size="small">
        <TableHead>
          <TableRow>
            <TableCell>Key</TableCell>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {propKeys.map((k) => (
            <TableRow key={k}>
              <TableCell>{k}</TableCell>
              <TableCell>{properties[k]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <Typography className={empty} variant="body2">
      No data
    </Typography>
  );
}
