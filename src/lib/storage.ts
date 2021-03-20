export enum StorageKey {
  ClientId = 'vertexvis:client-id',
  StreamKey = 'vertexvis:stream-key',
}

export function getItem(key: StorageKey): string | undefined {
  if (typeof window === 'undefined') {
    return;
  }

  return window.localStorage.getItem(key) ?? undefined;
}

export function setItem(key: StorageKey, value: string): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, value);
}
