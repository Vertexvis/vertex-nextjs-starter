import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { FileData } from "../lib/files";

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
    <Box mx={2} mb={2}>
      <Typography variant="body2">No data</Typography>
    </Box>
  );
}
