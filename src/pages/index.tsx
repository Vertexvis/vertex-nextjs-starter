import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import React from "react";

import { Home } from "../components/Home";
import { Config, Configuration, DefaultCredentials, StreamCredentials } from "../lib/config";
import { FileData, toFileData } from "../lib/files";

export interface Props {
  readonly baseUrl: string;
  readonly config: Configuration;
  readonly files: FileData[];
  readonly streamCredentials: StreamCredentials;
}

export default function Index(props: Props): JSX.Element {
  return <Home {...props} />;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Props>> {
  const empty = { props: { baseUrl: "", files: [], config: Config, streamCredentials: {clientId: DefaultCredentials.clientId} } };
  const host = context.req.headers.host;
  if (!host) return empty;

  const baseUrl = `http${host.startsWith("localhost") ? "" : "s"}://${host}`;
  const files = await (await fetch(`${baseUrl}/api/files`)).json();
  const suppliedId = context.query && context.query.suppliedId ? context.query.suppliedId.toString() : DefaultCredentials.suppliedId ?? '';
  const streamKey = suppliedId != null ? await (await fetch(`${baseUrl}/api/streamKey/${suppliedId}`)).text() : DefaultCredentials.streamKey;

  return {
    props: {
      ...empty.props,
      baseUrl,
      files: files == null || files.errors ? [] : toFileData(files),
      streamCredentials: {
        clientId: DefaultCredentials.clientId,
        suppliedId,
        streamKey
      }
    }
  };
}
