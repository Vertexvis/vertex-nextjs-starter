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
  readonly streamKey?: string;
  readonly suppliedId?: string;
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
  clientId: envVar("VERTEX_CLIENT_ID"),
  suppliedId: envVar("DEFAULT_SUPPLIED_ID"),
  streamKey: envVar("DEFAULT_STREAM_KEY"),
};

export function head<T>(items?: T | T[]): T | undefined {
  return Array.isArray(items) ? items[0] : items ?? undefined;
}

function envVar(
  name: string,
  fallback?: string
): string {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  return process.env[name] ?? fallback!;
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
