interface NetworkConfig {
  apiHost: string;
  renderingHost: string;
  sceneTreeHost: string;
}

export interface Configuration {
  readonly network: NetworkConfig;
}

export interface StreamCredentials {
  readonly clientId: string;
  readonly streamKey: string;
}

const DefaultHosts = {
  api: "https://platform.platprod.vertexvis.io",
  rendering: "wss://stream.platprod.vertexvis.io",
  sceneTree: "https://scene-trees.platprod.vertexvis.io",
};

const { api, rendering, sceneTree } = DefaultHosts;
export const Config: Configuration = {
  network: {
    apiHost: envVarUrl("VERTEX_API_HOST", api, "https:"),
    renderingHost: envVarUrl("VERTEX_RENDERING_HOST", rendering, "wss:"),
    sceneTreeHost: envVarUrl("VERTEX_SCENE_TREE_HOST", sceneTree, "https:"),
  },
};

// Vertex Valve
export const DefaultCredentials: StreamCredentials = {
  clientId: "08F675C4AACE8C0214362DB5EFD4FACAFA556D463ECA00877CB225157EF58BFA",
  streamKey: "vpe5dKpDffDT8bLzhbP0S7Da2nN9-w-xgq6X",
};

export function head<T>(items?: T | T[]): T | undefined {
  return Array.isArray(items) ? items[0] : items ?? undefined;
}

function envVarUrl(
  name: string,
  fallback: string,
  protocol: "https:" | "wss:"
): string {
  const ev = process.env[name];
  try {
    const url = new URL(ev ? ev : fallback);
    return url.protocol === protocol
      ? url.toString()
      : logAndFallback(name, fallback, ev);
  } catch {
    return logAndFallback(name, fallback, ev);
  }
}

function logAndFallback(
  name: string,
  fallback: string,
  envVar?: string
): string {
  console.error(
    `Invalid URL provided for ${name}, ${envVar}. Falling back to ${fallback}`
  );
  return fallback;
}
