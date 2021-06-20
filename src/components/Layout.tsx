import { AppBar as MuiAppBar, Box, Toolbar } from "@material-ui/core";
import { styled, Theme } from "@material-ui/core/styles";
import React from "react";

export const BottomDrawerHeight = 240;
export const DenseToolbarHeight = 48;
export const LeftDrawerWidth = 240;
export const RightDrawerWidth = 320;

interface Props {
  readonly bottomDrawer?: React.ReactNode;
  readonly bottomDrawerOpen?: boolean;
  readonly children?: React.ReactNode;
  readonly header?: React.ReactNode;
  readonly leftDrawer?: React.ReactNode;
  readonly leftDrawerOpen?: boolean;
  readonly main: React.ReactNode;
  readonly rightDrawer?: React.ReactNode;
  readonly rightDrawerOpen?: boolean;
}

interface DrawerProps {
  bottomDrawerOpen: boolean;
  leftDrawerOpen: boolean;
  rightDrawerOpen: boolean;
}

function shouldForwardProp(prop: PropertyKey): boolean {
  return prop !== "rightDrawerOpen" && prop !== "toolbarHeight";
}

const AppBar = styled(MuiAppBar, { shouldForwardProp })<DrawerProps>(
  ({ leftDrawerOpen, rightDrawerOpen, theme }) => {
    const ldw = leftDrawerOpen ? LeftDrawerWidth : 0;
    const rdw = rightDrawerOpen ? RightDrawerWidth : 0;
    return {
      marginLeft: ldw,
      width: `100%`,
      ...(rightDrawerOpen && {
        marginRight: rdw,
        width: `calc(100% - ${ldw + rdw}px)`,
      }),
      [theme.breakpoints.down("sm")]: {
        margin: 0,
        width: `100%`,
      },
    };
  }
);

const Main = styled("main", { shouldForwardProp })<
  DrawerProps & { toolbarHeight: number }
>(
  ({
    bottomDrawerOpen,
    leftDrawerOpen,
    rightDrawerOpen,
    theme,
    toolbarHeight,
  }) => {
    const bdh = bottomDrawerOpen ? BottomDrawerHeight : 0;
    const ldw = leftDrawerOpen ? LeftDrawerWidth : 0;
    const rdw = rightDrawerOpen ? RightDrawerWidth : 0;
    return {
      flexGrow: 1,
      height: `calc(100% - ${bdh + toolbarHeight}px)`,
      marginTop: `${toolbarHeight}px`,
      width: `calc(100% - ${ldw}px)`,
      [theme.breakpoints.down("sm")]: { width: `100%` },
      ...(rightDrawerOpen && {
        width: `calc(100% - ${ldw + rdw}px)`,
      }),
    };
  }
);

export function Layout({
  bottomDrawer,
  bottomDrawerOpen = false,
  children,
  header,
  leftDrawer,
  leftDrawerOpen = false,
  main,
  rightDrawer,
  rightDrawerOpen = false,
}: Props): JSX.Element {
  return (
    <Box height="100vh" display="flex">
      {header && (
        <AppBar
          bottomDrawerOpen={bottomDrawerOpen}
          color="default"
          elevation={1}
          leftDrawerOpen={leftDrawerOpen}
          position="fixed"
          rightDrawerOpen={rightDrawerOpen}
        >
          <Toolbar variant="dense">{header}</Toolbar>
        </AppBar>
      )}
      {leftDrawerOpen && leftDrawer ? leftDrawer : <></>}
      <Main
        bottomDrawerOpen={bottomDrawerOpen}
        leftDrawerOpen={leftDrawerOpen}
        rightDrawerOpen={rightDrawerOpen}
        toolbarHeight={header ? DenseToolbarHeight : 0}
      >
        {main}
      </Main>
      {rightDrawerOpen && rightDrawer ? rightDrawer : <></>}
      {children ?? <></>}
      {bottomDrawerOpen && bottomDrawer ? bottomDrawer : <></>}
    </Box>
  );
}
