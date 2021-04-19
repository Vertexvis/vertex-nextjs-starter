import React from "react";

interface Keys {
  readonly o: boolean;
}

export function useKeyListener(): Keys {
  const [keys, setKeys] = React.useState<Keys>({ o: false });

  React.useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return function cleanup() {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  });

  function handleKeyDown(e: KeyboardEvent): void {
    if (e.key === "o") setKeys({ o: true });
  }

  function handleKeyUp(): void {
    setKeys({ o: false });
  }

  return keys;
}
