import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";

const DenseToolbarHeight = 48;
export const RightDrawerWidth = 320;

interface Props {
  readonly children: React.ReactNode;
  readonly header: React.ReactNode;
  readonly main: React.ReactNode;
  readonly rightDrawer: React.ReactNode;
}

const useStyles = makeStyles((theme) => ({
  appBar: {
    marginRight: RightDrawerWidth,
    width: `calc(100% - ${RightDrawerWidth}px)`,
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    height: `calc(100% - ${DenseToolbarHeight}px)`,
    width: `calc(100% - ${RightDrawerWidth}px)`,
  },
  offset: {
    minHeight: `${DenseToolbarHeight}px`,
  },
  root: {
    height: `100vh`,
    display: "flex",
  },
}));

export function Layout({
  children,
  header,
  main,
  rightDrawer,
}: Props): JSX.Element {
  const { appBar, content, offset, root } = useStyles();

  return (
    <div className={root}>
      <AppBar position="fixed" elevation={1} color="default" className={appBar}>
        <Toolbar variant="dense">{header}</Toolbar>
      </AppBar>
      <main className={content}>
        <div className={offset} />
        {main}
      </main>
      {rightDrawer}
      {children}
    </div>
  );
}
