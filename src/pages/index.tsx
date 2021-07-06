import { Environment } from "@vertexvis/viewer";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import React from "react";

import { Config } from "../lib/config";
import { FileData, toFileData } from "../lib/files";

const Home = dynamic(() => import("../components/Home"), { ssr: false });

export interface Props {
  readonly files: FileData[];
  readonly vertexEnv: Environment;
}

export default function Index(props: Props): JSX.Element {
  return <Home {...props} />;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const empty = { props: { files: [], vertexEnv: Config.vertexEnv } };
  const host = context.req.headers.host;
  if (!host) return empty;

  const baseUrl = `http${host.startsWith("localhost") ? "" : "s"}://${host}`;
  const res = await (await fetch(`${baseUrl}/api/files`)).json();
  return res == null || res.errors
    ? empty
    : { props: { ...empty.props, files: toFileData(res) } };
};
