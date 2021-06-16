import { AppBar as MuiAppBar, Box, Toolbar } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
import React from "react";

export const BottomDrawerHeight = 0; // If provided, set to 270
export const DenseToolbarHeight = 48;
export const LeftDrawerWidth = 0; // If mini-drawer provided, set to 76
export const RightDrawerWidth = 320; // If not provided, set to 0

interface Props {
  readonly bottomDrawer?: React.ReactNode;
  readonly children?: React.ReactNode;
  readonly header?: React.ReactNode;
  readonly leftDrawer?: React.ReactNode;
  readonly main: React.ReactNode;
  readonly rightDrawer?: React.ReactNode;
  readonly rightDrawerOpen?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "rightDrawerOpen",
})<{ rightDrawerOpen?: boolean }>(({ theme, rightDrawerOpen }) => ({
  marginLeft: LeftDrawerWidth,
  width: `100%`,
  [theme.breakpoints.down("md")]: {
    margin: 0,
    width: `100%`,
  },
  ...(rightDrawerOpen && {
    width: `calc(100% - ${LeftDrawerWidth + RightDrawerWidth}px)`,
    marginRight: RightDrawerWidth,
  }),
}));

const Main = styled("main", {
  shouldForwardProp: (prop) => prop !== "rightDrawerOpen",
})<{
  rightDrawerOpen?: boolean;
}>(({ theme, rightDrawerOpen }) => ({
  flexGrow: 1,
  height: `calc(100% - ${BottomDrawerHeight + DenseToolbarHeight}px)`,
  marginTop: `${DenseToolbarHeight}px`,
  width: `calc(100% - ${LeftDrawerWidth + RightDrawerWidth}px)`,
  [theme.breakpoints.down("md")]: { width: `100%` },
  ...(rightDrawerOpen && {
    width: `calc(100% - ${LeftDrawerWidth + RightDrawerWidth}px)`,
  }),
}));

export function Layout({
  bottomDrawer,
  children,
  header,
  leftDrawer,
  main,
  rightDrawer,
  rightDrawerOpen,
}: Props): JSX.Element {
  return (
    <Box height="100vh" display="flex">
      {header && (
        <AppBar
          color="default"
          elevation={1}
          position="fixed"
          rightDrawerOpen={rightDrawerOpen}
        >
          <Toolbar variant="dense">{header}</Toolbar>
        </AppBar>
      )}
      {leftDrawer ?? <></>}
      <Main rightDrawerOpen={rightDrawerOpen}>{main}</Main>
      {rightDrawer ?? <></>}
      {children ?? <></>}
      {bottomDrawer ?? <></>}
    </Box>
  );
}
