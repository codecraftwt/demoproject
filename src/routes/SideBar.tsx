import React, { useEffect, useState } from "react";
import { Drawer, styled, Grid, List, Box } from "@mui/material";
import MenuItems, { MenuItem } from "./MenutItems";
import { useAuth0 } from "@auth0/auth0-react";
import { checkUserRoles } from "../lib/rolesAndPermissions";
import { Settings } from "@mui/icons-material";

const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== "isOpened",
})<{ isOpened: boolean }>(({ isOpened, theme }) => ({
  width: isOpened ? 260 : theme.spacing(7),
  //height: '100vh',
  //flex: '1',
  overflow: "auto",
  transition: isOpened
    ? theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      })
    : theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
  "& .MuiDrawer-paper": {
    background: "#E8E5EE",
    position: "static",
    overflowX: "hidden",
    borderRight: "none",
  },
  "& .MuiListItem-root:hover": {
    background: theme.palette.primary.light,
  },
}));

export const SideBar = ({ isOpened }: any) => {
  const { user } = useAuth0();
  const [authUser, setAuthUser] = useState<any | undefined>(null);
  const [userRoles, setUserRoles] = useState<
    "vtadmin" | "superintendent" | "worker" | null
  >(null);

  const isLargeScreen = true;
  const toggleIsOpened = (isOpened: any) => {
    return isOpened;
  };

  useEffect(() => {
    if (user) {
      setAuthUser(user);
      setUserRoles(user[`${process.env.REACT_APP_WEB_URL}/roles`]);
    }
  }, [user]);

  const menuItem = {
    text: "Settings",
    icon: Settings,
    route: "/settings",
    roles: ["vtadmin", "superintendent"],
  };

  return (
    <StyledDrawer
      variant={isLargeScreen ? "permanent" : "temporary"}
      open={!isLargeScreen && isOpened ? true : false}
      onClose={() => toggleIsOpened(!isOpened)}
      isOpened={isOpened}
    >
      <Grid>
        <List sx={{ margin: "0 10px", paddingTop: 5 }}>
          {userRoles ? (
            <MenuItems userInfo={authUser} userRoles={userRoles} />
          ) : null}
        </List>
        <Box
          style={{
            paddingTop:70,
            paddingBottom:10,
            // position: "absolute",
            // bottom: 20,
            left: 0,
            width: 260,
          }}
        >
          <Box
            sx={{
              margin: "0 10px",
              // paddingTop: 5,
            }}
          >
            {checkUserRoles(menuItem.roles, userRoles) ? (
              <MenuItem
                route={menuItem.route}
                text={menuItem.text}
                Icon={menuItem.icon}
                borderBottom={false}
                style={{
                  background: "rgba(0, 0, 0, 0.05) !important",
                  borderRadius: "8px !important",
                  color: "rgba(165, 162, 165, 1)",
                  "&:hover > .MuiListItemIcon-root": {
                    color: "rgba(165, 162, 165, 1)",
                  },
                }}
                rolesAllowed={menuItem.roles}
              />
            ) : null}
          </Box>
        </Box>
      </Grid>
    </StyledDrawer>
  );
};
