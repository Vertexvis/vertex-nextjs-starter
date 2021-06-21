import { AppBar as MuiAppBar, Box, Toolbar } from "@material-ui/core";
import { styled } from "@material-ui/core/styles";
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
  leftDrawerWidth: number;
  rightDrawerWidth: number;
}

function shouldForwardProp(prop: PropertyKey): boolean {
  return (
    prop !== "bottomDrawerHeight" &&
    prop !== "leftDrawerWidth" &&
    prop !== "rightDrawerWidth" &&
    prop !== "toolbarHeight"
  );
}

const AppBar = styled(MuiAppBar, { shouldForwardProp })<DrawerProps>(
  ({ leftDrawerWidth, rightDrawerWidth, theme }) => {
    return {
      marginLeft: leftDrawerWidth,
      width: `100%`,
      ...(rightDrawerWidth > 0 && {
        marginRight: rightDrawerWidth,
        width: `calc(100% - ${leftDrawerWidth + rightDrawerWidth}px)`,
      }),
      [theme.breakpoints.down("sm")]: {
        margin: 0,
        width: `100%`,
      },
    };
  }
);

const Main = styled("main", { shouldForwardProp })<
  DrawerProps & { bottomDrawerHeight: number; toolbarHeight: number }
>(
  ({
    bottomDrawerHeight,
    leftDrawerWidth,
    rightDrawerWidth,
    theme,
    toolbarHeight,
  }) => {
    return {
      flexGrow: 1,
      height: `calc(100% - ${bottomDrawerHeight + toolbarHeight}px)`,
      marginTop: `${toolbarHeight}px`,
      width: `calc(100% - ${leftDrawerWidth}px)`,
      [theme.breakpoints.down("sm")]: { width: `100%` },
      ...(rightDrawerWidth > 0 && {
        width: `calc(100% - ${leftDrawerWidth + rightDrawerWidth}px)`,
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
  const bdh = bottomDrawerOpen ? BottomDrawerHeight : 0;
  const ldw = leftDrawerOpen ? LeftDrawerWidth : 0;
  const rdw = rightDrawerOpen ? RightDrawerWidth : 0;
  const tbh = header ? DenseToolbarHeight : 0;

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      {header && (
        <AppBar
          color="default"
          elevation={1}
          leftDrawerWidth={ldw}
          position="fixed"
          rightDrawerWidth={rdw}
        >
          <Toolbar variant="dense">{header}</Toolbar>
        </AppBar>
      )}
      {leftDrawerOpen && leftDrawer ? leftDrawer : <></>}
      <Main
        bottomDrawerHeight={bdh}
        leftDrawerWidth={ldw}
        rightDrawerWidth={rdw}
        toolbarHeight={tbh}
      >
        {main}
      </Main>
      {rightDrawerOpen && rightDrawer ? rightDrawer : <></>}
      {children ?? <></>}
      {bottomDrawerOpen && bottomDrawer ? bottomDrawer : <></>}
    </Box>
  );
}
