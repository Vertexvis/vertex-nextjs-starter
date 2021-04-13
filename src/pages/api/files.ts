import { FileList, logError, VertexClient } from '@vertexvis/vertex-api-client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Env } from '../../lib/env';

export default async function getFiles(
  _req: NextApiRequest,
  res: NextApiResponse<FileList | { error: string }>
): Promise<void> {
  const client = await getClient();

  client
    ? res.status(200).json((await client.files.getFiles({ pageSize: 5 })).data)
    : res.status(500).json({
        error: 'Failed creating Vertex client, check server-side logs.',
      });
}

let vertexClient: VertexClient | undefined;
async function getClient(): Promise<VertexClient | undefined> {
  if (vertexClient != null) return vertexClient;

  try {
    vertexClient = await VertexClient.build({
      basePath:
        Env === 'platprod'
          ? 'https://platform.vertexvis.com'
          : `https://platform.${Env}.vertexvis.io`,
      client: {
        id: process.env.VERTEX_CLIENT_ID ?? '',
        secret: process.env.VERTEX_CLIENT_SECRET ?? '',
      },
    });
    return vertexClient;
  } catch (error) {
    logError(error);
    return undefined;
  }
}
