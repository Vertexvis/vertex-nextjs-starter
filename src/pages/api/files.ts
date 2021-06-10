import { Failure, FileList } from "@vertexvis/api-client-node";
import type { NextApiRequest, NextApiResponse } from "next";

import { makeCall } from "../../lib/vertex-api";

export default function getFiles(
  _req: NextApiRequest,
  res: NextApiResponse<FileList | Failure>
): Promise<void> {
  return makeCall(res, (client) => client.files.getFiles({ pageSize: 5 }));
}
