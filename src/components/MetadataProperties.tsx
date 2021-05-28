import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { Properties } from "../lib/metadata";
import { NoData } from "./NoData";

interface Props {
  readonly properties: Properties;
}

export function MetadataProperties({ properties }: Props): JSX.Element {
  const propKeys = Object.keys(properties);

  return propKeys.length > 0 ? (
    <TableContainer>
      <Table padding="checkbox" size="small" style={{ whiteSpace: "nowrap" }}>
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
    <NoData />
  );
}
