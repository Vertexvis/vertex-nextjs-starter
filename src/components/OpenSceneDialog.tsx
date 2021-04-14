import React, { useEffect, useState } from 'react';
import { StreamCredentials } from '../lib/storage';
import { Dialog } from './Dialog';

interface Props {
  readonly credentials: StreamCredentials;
  readonly open: boolean;
  readonly onClose: VoidFunction;
  readonly onConfirm: (credentials: StreamCredentials) => void;
}

export function OpenButton({ onClick }: { onClick: () => void }): JSX.Element {
  return (
    <div className="ml-4 mr-auto">
      <button className="btn btn-primary text-sm" onClick={onClick}>
        Open Scene
      </button>
    </div>
  );
}

export function OpenDialog({
  credentials,
  open,
  onClose,
  onConfirm,
}: Props): JSX.Element {
  const [inputCreds, setInputCreds] = useState<StreamCredentials>(credentials);
  const handleClose = (): void => onClose();

  useEffect(() => {
    if (credentials.clientId || credentials.streamKey)
      setInputCreds(credentials);
  }, [credentials]);

  return (
    <Dialog
      header="Open Scene"
      footer={
        <>
          <button
            className="btn btn-primary"
            disabled={inputCreds.clientId === '' || inputCreds.streamKey === ''}
            onClick={() => {
              if (inputCreds.clientId && inputCreds.streamKey) {
                onConfirm(inputCreds);
              }
            }}
          >
            Open Scene
          </button>
          <button className="btn btn-secondary" onClick={handleClose}>
            Cancel
          </button>
        </>
      }
      open={open}
      onClose={handleClose}
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
                value={inputCreds.clientId}
                onChange={(e) =>
                  setInputCreds({ ...inputCreds, clientId: e.target.value })
                }
              />
            </div>
            <div className="py-2">
              <input
                placeholder="Stream Key"
                className="txt-input"
                type="text"
                value={inputCreds.streamKey}
                onChange={(e) =>
                  setInputCreds({ ...inputCreds, streamKey: e.target.value })
                }
              />
            </div>
          </>
        }
      </div>
    </Dialog>
  );
}

export function encode(cs: StreamCredentials): string {
  return `/?clientId=${encodeURIComponent(
    cs.clientId
  )}&streamKey=${encodeURIComponent(cs.streamKey)}`;
}
