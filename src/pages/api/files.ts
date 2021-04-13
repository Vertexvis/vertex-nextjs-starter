import { FileList, VertexClient } from '@vertexvis/vertex-api-client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Env } from '../../lib/env';

export default async function getFiles(
  _req: NextApiRequest,
  res: NextApiResponse<FileList>
): Promise<void> {
  const client = await getClient();
  res.status(200).json((await client.files.getFiles({ pageSize: 5 })).data);
}

let vertexClient: VertexClient | undefined;
async function getClient(): Promise<VertexClient> {
  if (vertexClient != null) return vertexClient;

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
}
