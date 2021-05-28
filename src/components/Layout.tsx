import { experimentalStyled as styled } from "@material-ui/core/styles";
import MuiAppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import React from "react";

const DenseToolbarHeight = 48;
export const LeftDrawerWidth = 0;
export const RightDrawerWidth = 320;

interface Props {
  readonly children: React.ReactNode;
  readonly header: React.ReactNode;
  readonly main: React.ReactNode;
  readonly rightDrawer: React.ReactNode;
}

const AppBar = styled((props) => (
  <MuiAppBar position="fixed" elevation={1} color="default" {...props} />
))(({ theme }) => ({
  marginLeft: LeftDrawerWidth,
  marginRight: RightDrawerWidth,
  width: `calc(100% - ${LeftDrawerWidth + RightDrawerWidth}px)`,
  zIndex: theme.zIndex.drawer + 1,
  [theme.breakpoints.down("md")]: {
    margin: 0,
    width: `100%`,
  },
}));

const Content = styled((props) => <main {...props} />)(({ theme }) => ({
  height: `calc(100% - ${DenseToolbarHeight}px)`,
  width: `calc(100% - ${LeftDrawerWidth + RightDrawerWidth}px)`,
  [theme.breakpoints.down("md")]: {
    width: `100%`,
  },
}));

export function Layout({
  children,
  header,
  main,
  rightDrawer,
}: Props): JSX.Element {
  return (
    <Box height="100vh" display="flex">
      <AppBar>
        <Toolbar variant="dense">{header}</Toolbar>
      </AppBar>
      <Content>
        <Box minHeight={`${DenseToolbarHeight}px`} />
        {main}
      </Content>
      {rightDrawer}
      {children}
    </Box>
  );
}
