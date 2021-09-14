import {
  Failure,
  isFailure,
  VertexClient,
  VertexError,
} from "@vertexvis/api-client-node";
import { AxiosResponse } from "axios";
import type { NextApiResponse } from "next";

import { Config } from "./config";

export async function makeCallAndReturn<T>(
  res: NextApiResponse<T | Failure>,
  apiCall: (client: VertexClient) => Promise<AxiosResponse<T>>
): Promise<void> {
  const result = await makeCall(apiCall);
  return isFailure(result)
    ? res.status(500).json(result)
    : res.status(200).json(result);
}

export async function makeCall<T>(
  apiCall: (client: VertexClient) => Promise<AxiosResponse<T>>
): Promise<T | Failure> {
  try {
    const c = await getClient();
    return (await apiCall(c)).data;
  } catch (error) {
    const ve = error as VertexError;
    console.error("Error calling Vertex API", ve);
    return (
      ve.vertexError?.res ?? {
        errors: new Set([
          { status: "500", title: "Unknown error from Vertex API." },
        ]),
      }
    );
  }
}

let Client: VertexClient | undefined;
async function getClient(): Promise<VertexClient> {
  if (Client != null) return Client;

  Client = await VertexClient.build({
    basePath: Config.network.apiHost.toString(),
    client: {
      id: process.env.VERTEX_CLIENT_ID ?? "",
      secret: process.env.VERTEX_CLIENT_SECRET ?? "",
    },
  });

  return Client;
}
