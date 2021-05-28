import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import React from "react";
import { FileData } from "../lib/files";
import { NoData } from "./NoData";

interface Props {
  readonly files: FileData[];
}

export function RecentFiles({ files }: Props): JSX.Element {
  return files.length > 0 ? (
    <TableContainer>
      <Table padding="checkbox" size="small" style={{ whiteSpace: "nowrap" }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Created</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {files.map((f) => (
            <TableRow key={f.id}>
              <TableCell>{f.name}</TableCell>
              <TableCell>{new Date(f.created).toLocaleDateString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <NoData />
  );
}
