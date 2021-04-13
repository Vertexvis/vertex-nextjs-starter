import { Failure, FileList } from '@vertexvis/vertex-api-client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { call } from '../../lib/vertex-api';

export default async function getFiles(
  _req: NextApiRequest,
  res: NextApiResponse<FileList | Failure>
): Promise<void> {
  return call(res, (client) => client.files.getFiles({ pageSize: 5 }));
}
