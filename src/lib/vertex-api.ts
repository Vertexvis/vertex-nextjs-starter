import {
  ApiError,
  Failure,
  head,
  VertexClient,
} from '@vertexvis/vertex-api-client';
import { AxiosResponse } from 'axios';
import type { NextApiResponse } from 'next';
import { Env } from './env';

export async function call<T>(
  res: NextApiResponse<T | Failure>,
  apiCall: (client: VertexClient) => Promise<AxiosResponse<T>>
): Promise<void> {
  try {
    res.status(200).json((await apiCall(await getClient())).data);
  } catch (error) {
    const failure = error.vertexError?.res;
    if (!failure) {
      const errors = new Set<ApiError>();
      errors.add({ status: '500', title: 'Unknown error from Vertex API.' });
      failure.errors = errors;
    }

    res.status(parseInt(head(failure.errors)?.status ?? 500, 10)).json(failure);
  }
}

let Client: VertexClient | undefined;
async function getClient(): Promise<VertexClient> {
  if (Client != null) return Client;

  Client = await VertexClient.build({
    basePath:
      Env === 'platprod'
        ? 'https://platform.vertexvis.com'
        : `https://platform.${Env}.vertexvis.io`,
    client: {
      id: process.env.VERTEX_CLIENT_ID ?? '',
      secret: process.env.VERTEX_CLIENT_SECRET ?? '',
    },
  });

  return Client;
}
