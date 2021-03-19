import React from 'react';
import { Dialog } from './Dialog';

interface Props {
  clientId?: string;
  streamKey?: string;
  open: boolean;
  onClose: VoidFunction;
  onLoad: (clientId: string, streamKey: string) => void;
}

export function LoadStreamKeyDialog({
  clientId,
  streamKey,
  open,
  onClose,
  onLoad,
}: Props): JSX.Element {
  const [inputClientId, setInputClientId] = React.useState(clientId || '');
  const [inputStreamKey, setInputStreamKey] = React.useState(streamKey || '');

  const handleDialogClose = (): void => {
    onClose();
  };

  React.useEffect(() => {
    if (clientId != null) {
      setInputClientId(clientId);
    }
    if (streamKey != null) {
      setInputStreamKey(streamKey);
    }
  }, [clientId, streamKey, setInputClientId, setInputStreamKey]);

  return (
    <Dialog
      header="Open Scene"
      footer={
        <React.Fragment>
          <button
            className="btn btn-primary"
            disabled={inputClientId === '' || inputStreamKey === ''}
            onClick={() => {
              if (inputClientId != null && inputStreamKey != null) {
                onLoad(inputClientId, inputStreamKey);
              }
            }}
          >
            Open Scene
          </button>
          <button className="btn btn-secondary" onClick={handleDialogClose}>
            Cancel
          </button>
        </React.Fragment>
      }
      open={open}
      onClose={handleDialogClose}
    >
      <div data-testid="dialog-content">
        {
          <>
            Enter the Client ID and stream key to view and edit your scene.
            <div className="py-2">
              <input
                placeholder="Client ID"
                className="txt-input"
                type="text"
                value={inputClientId}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setInputClientId(event.target.value);
                }}
              />
            </div>
            <div className="py-2">
              <input
                placeholder="Stream Key"
                className="txt-input"
                type="text"
                value={inputStreamKey}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                  setInputStreamKey(event.target.value);
                }}
              />
            </div>
          </>
        }
      </div>
    </Dialog>
  );
}
