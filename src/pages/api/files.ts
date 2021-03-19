import { FileList, VertexClient } from '@vertexvis/vertex-api-client';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function getFiles(
  _req: NextApiRequest,
  res: NextApiResponse<FileList>
): Promise<void> {
  const c = await getClient();
  res.status(200).json((await c.files.getFiles({ pageSize: 5 })).data);
}

let client: VertexClient | undefined;
async function getClient(): Promise<VertexClient> {
  if (client != null) return client;

  const basePath =
    process.env.NEXT_PUBLIC_VERTEX_ENV === 'platprod' ||
    process.env.NEXT_PUBLIC_VERTEX_ENV === ''
      ? 'https://platform.vertexvis.com'
      : `https://platform.${process.env.NEXT_PUBLIC_VERTEX_ENV}.vertexvis.io`;
  console.log(basePath);
  client = await VertexClient.build({
    basePath,
    client: {
      id: process.env.NEXT_PUBLIC_VERTEX_CLIENT_ID ?? '',
      secret: process.env.VERTEX_CLIENT_SECRET ?? '',
    },
  });
  return client;
}
