//
// API ENDPOINT WHICH RETURNS A STREAM KEY FOR A GIVEN SCENE SUPPLIED ID
//

import { Failure, isFailure, SceneData } from "@vertexvis/api-client-node";
import type { NextApiRequest, NextApiResponse } from "next";

import { makeCall } from "../../../lib/vertex-api";

/**
 * This is the API handler for the /api/streamKey/[SUPPLIED_ID] path.
 * It is intended to accept a scene supplied ID from the path and fetch/return
 * a stream key from the Vertex API for the corresponding scene.
 */
export default async function handle(
  _req: NextApiRequest,
  res: NextApiResponse<string | Failure>
): Promise<void> {

  // get scene supplied id from request path
  const suppliedId = _req.query.suppliedId?.toString();
  console.log(`GET stream key for scene with supplied id: ${suppliedId}`);

  if (suppliedId) {
    // try to find the scene with matching supplied id
    const scene = await fetchSceneBySuppliedId(suppliedId);
    if (scene != null) {
      // we found the scene
      // now use the scene ID to get a stream key
      const streamKey = await createStreamKey({ sceneId: scene.id });
      if (streamKey != null) {
        return res.status(200).send(streamKey);
      }
    }
  }

  // If we got here, we were not able to get a stream key
  // Return 404 status with empty response
  res.status(404);
}

/**
 * This ASYNC helper method takes a scene supplied ID as input 
 * and calls the Vertex API to search for a scene that matches
 * the given supplied ID. If found, the `SceneData` object for 
 * the scene is returned. If no matching scene is found, method 
 * will return undefined.
 */
async function fetchSceneBySuppliedId(
  sceneSuppliedId: string
): Promise<SceneData | undefined> {
  const sceneSearch = await makeCall((client) => client.scenes.getScenes({
    filterSuppliedId: sceneSuppliedId,
  }));
  if (!isFailure(sceneSearch) && sceneSearch.data.length > 0) {
    const sceneData = sceneSearch.data[0];
    return sceneData;
  }
  return undefined;
}



type CreateStreamKeyParams = {
  sceneId: string
  excludePrunedItems?: boolean
  expiry?: number
}

/**
 * This ASYNC helper method takes a scene ID as input 
 * and calls the Vertex API to create a stream key 
 * for the requested scene. The resulting stream key 
 * is extracted from the response and returned as a string.
 */
async function createStreamKey({
  sceneId,
  excludePrunedItems = false,
  expiry = 36000 /* 10 hours */,
}: CreateStreamKeyParams): Promise<string | undefined> {
  const res = await makeCall((client) => client.streamKeys.createSceneStreamKey({
    id: sceneId,
    createStreamKeyRequest: {
      data: {
        attributes: {
          excludePrunedItems,
          expiry,
        },
        type: 'stream-key',
      },
    },
  }));
  if (!isFailure(res)) {
    const streamKeyResult = res.data;
    return streamKeyResult.attributes.key;
  } else {
    return undefined;
  }
}
