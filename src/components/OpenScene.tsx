import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import React from "react";

import { DefaultCredentials, StreamCredentials } from "../lib/config";

interface Props {
  readonly credentials: StreamCredentials;
  readonly open: boolean;
  readonly onClose: VoidFunction;
  readonly onConfirm: (credentials: StreamCredentials) => void;
}

interface Value {
  value: string;
}

export function OpenDialog({
  credentials,
  open,
  onClose,
  onConfirm,
}: Props): JSX.Element {
  const [inputCreds, setInputCreds] =
    React.useState<StreamCredentials>(credentials);
  const emptySuppliedId = inputCreds.suppliedId === "";
  const invalidSuppliedId = inputCreds.suppliedId != null && inputCreds.suppliedId.length > 64;

  function handleSuppliedIdChange(e: React.ChangeEvent<Value>): void {
    setInputCreds({ ...inputCreds, suppliedId: e.target.value });
  }

  function handleOpenSceneClick(): void {
    if (inputCreds.suppliedId && inputCreds.streamKey) {
      onConfirm(inputCreds);
    }
  }

  function handleRestoreDefaultsClick(): void {
    setInputCreds(DefaultCredentials);
  }

  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle id="open-scene-title">Open Scene</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Enter the Supplied ID of your scene.
        </DialogContentText>
        <TextField
          autoFocus={emptySuppliedId}
          error={invalidSuppliedId}
          fullWidth
          helperText={invalidSuppliedId ? "Supplied ID too long." : undefined}
          label="Scene Supplied ID"
          margin="normal"
          onChange={handleSuppliedIdChange}
          size="small"
          value={inputCreds.suppliedId}
        />
      </DialogContent>
      <DialogActions>
        <Button color="inherit" onClick={handleRestoreDefaultsClick}>
          Restore Defaults
        </Button>
        <Button color="inherit" onClick={onClose}>
          Cancel
        </Button>
        <Button onClick={handleOpenSceneClick}>Open Scene</Button>
      </DialogActions>
    </Dialog>
  );
}

export function encodeCreds(cs: StreamCredentials): string {
  return cs.suppliedId ? `/?suppliedId=${encodeURIComponent(
    cs.suppliedId
  )}` : `/`;
}
