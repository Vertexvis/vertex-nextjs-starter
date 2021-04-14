import { Failure, FileList } from '@vertexvis/vertex-api-client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { makeCall } from '../../lib/vertex-api';

export default async function getFiles(
  _req: NextApiRequest,
  res: NextApiResponse<FileList | Failure>
): Promise<void> {
  return makeCall(res, (client) => client.files.getFiles({ pageSize: 5 }));
}
