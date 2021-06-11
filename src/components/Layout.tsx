import { AppBar as MuiAppBar, Box, Toolbar } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import React from "react";

const DenseToolbarHeight = 48;
export const LeftDrawerWidth = 0; // If mini-drawer provided, set to 76
export const RightDrawerWidth = 320; // If not provided, set to 0

interface Props {
  readonly children: React.ReactNode;
  readonly header: React.ReactNode;
  readonly leftDrawer?: React.ReactNode;
  readonly main: React.ReactNode;
  readonly rightDrawer?: React.ReactNode;
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
  leftDrawer,
  main,
  rightDrawer,
}: Props): JSX.Element {
  return (
    <Box height="100vh" display="flex">
      <AppBar>
        <Toolbar variant="dense">{header}</Toolbar>
      </AppBar>
      {leftDrawer ?? <></>}
      <Content>
        <Box minHeight={`${DenseToolbarHeight}px`} />
        {main}
      </Content>
      {rightDrawer ?? <></>}
      {children}
    </Box>
  );
}
