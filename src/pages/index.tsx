import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import React from "react";

import { Home } from "../components/Home";
import { Config, Configuration } from "../lib/config";
import { FileData, toFileData } from "../lib/files";

export interface Props {
  readonly config: Configuration;
  readonly files: FileData[];
}

export default function Index(props: Props): JSX.Element {
  return <Home {...props} />;
}

export async function getServerSideProps(
  context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<Props>> {
  const empty = { props: { files: [], config: Config } };
  const host = context.req.headers.host;
  if (!host) return empty;

  const baseUrl = `http${host.startsWith("localhost") ? "" : "s"}://${host}`;
  const res = await (await fetch(`${baseUrl}/api/files`)).json();
  return res == null || res.errors
    ? empty
    : { props: { ...empty.props, files: toFileData(res) } };
}
