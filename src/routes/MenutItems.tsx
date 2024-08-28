import React, { useEffect, useState } from 'react'
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  styled,
  useTheme,
} from '@mui/material'
import {
  Dashboard,
  Badge,
  Settings,
  ListAlt,
  ManageAccounts,
  Assessment,
  SubdirectoryArrowRight,
} from '@mui/icons-material'
import { NavLink, useLocation } from 'react-router-dom'
import { checkUserRoles } from '../lib/rolesAndPermissions'
import {
  ContractAIIcon,
  DashboardIcon,
  FilesIcon,
  ProjectsIcon,
  ReportsIcon,
  UsersManagement,
  WorkersIcon,
} from '../assets/icons/icons'
import { useProjectsCount } from '../features/projects/hooks'

var menuItems: any[] = [
  {
    text: 'Dashboard',
    icon: DashboardIcon,
    route: '/dashboard',
    roles: ['vtadmin', 'superintendent'],
  },
  // {
  //   text: 'Accounts',
  //   icon: ManageAccounts,
  //   route: '/accounts',
  //   roles: 'admin'
  // },
  // {
  //   text: 'Manage Codes',
  //   icon: Dataset,
  //   route: '/cost-codes',
  //   roles: 'admin'
  // },
  {
    text: 'Workers',
    icon: WorkersIcon,
    route: '/workers',
    roles: ['vtadmin','superintendent'],
  },
  // {
  //   text: 'Geofences',
  //   icon: ShareLocation,
  //   route: '/geo-fences',
  //   roles: 'admin'
  // },
  {
    text: 'Projects',
    icon: ProjectsIcon,
    route: '/projects',
    roles: ['vtadmin', 'superintendent'],
  },
  {
    text: 'Reports',
    icon: ReportsIcon,
    route: '/reports',
    // roles: 'admin'
    roles: ['vtadmin', 'superintendent'],
    subItems: [
      {
        text: 'Report Builder',
        icon: SubdirectoryArrowRight,
        route: '/reports',
        roles: ['vtadmin', 'superintendent'],
      },
      {
        text: 'Daily Report',
        icon: SubdirectoryArrowRight,
        route: '/reports/daily-report',
        roles: ['vtadmin', 'superintendent'],
      },
      {
        text: 'Attendance Report',
        icon: SubdirectoryArrowRight,
        route: '/reports/employee-attendance',
        roles: ['vtadmin', 'superintendent'],
      },
      // {
      //   text: 'Accounting System Exports',
      //   icon: SubdirectoryArrowRight,
      //   route: '/reports',
      //   roles: ['vtadmin', 'superintendent'],
      // },
    ],
  },
  // {
  //   text: 'Global Push Notifications',
  //   icon: Campaign,
  //   route: '/push-notifications',
  //   roles: 'admin'
  // },
  // {
  //   text: 'Kiosk',
  //   icon: ScreenshotMonitor,
  //   route: '/kiosk',
  //   roles: 'admin'
  // },
  {
    text: 'Contract AI',
    icon: ContractAIIcon,
    route: '/contract-ai',
    roles: ['vtadmin'],
  },
  {
    text: 'Files',
    icon: FilesIcon,
    route: '/files',
    roles: ['vtadmin', 'superintendent'],
  },
  {
    text: 'User Management',
    icon: UsersManagement,
    route: '/user-management',
    roles: ['vtadmin'],
  },
  
]

const StyledNavLink = styled(NavLink)(({ theme }) => ({
  textDecoration: 'none',
}))

const StyledIcon = styled(ListItemIcon)(({ theme }) => ({
  minWidth: 'auto',
  '& svg': {
    width: '20px',
  },
  paddingRight: theme.spacing(1.2),
  color: 'rgba(165, 162, 165, 1)',
}))

const StyledListItem = styled(ListItem)(({ theme }) => ({
  color: 'rgba(165, 162, 165, 1)',
  display: 'flex',
  paddingLeft: theme.spacing(1.3),
  paddingTop: theme.spacing(0.9),
  paddingBottom: theme.spacing(0.9),
  '& span': {
    fontSize: '15px',
    fontWeight: '500',
    color: '#24212C',
    fontFamily: 'Roboto',
  },
}))

export const MenuItem = (props: any) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isActive, setIsActive] = useState(false)
  const {
    text,
    count,
    Icon,
    route,
    subItems,
    borderBottom = true,
    style = {},
  } = props
  const theme = useTheme()
  const location = useLocation()

  useEffect(() => {
    if (location.pathname.includes(route)) {
      setIsActive(true)
    } else {
      setIsActive(false)
    }
  }, [location])

  return (
    <>
      <StyledNavLink
        to={route}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          backgroundColor:
            isActive || isHovered ? theme.palette.primary.light : '',
          borderRadius: '8px !important',
          marginTop: 0.5,
          display: 'block',
        }}>
        <StyledListItem
          sx={{
            borderBottom:
              isActive || isHovered
                ? borderBottom
                  ? '0.5px solid rgba(0,0,0,0.1) !important'
                  : 'none'
                : 'none',
            backgroundColor:
              isActive || isHovered ? theme.palette.primary.light : '',
            color: isActive || isHovered ? 'rgba(165, 162, 165, 1)' : '',
            borderRadius: '8px !important',
            border: 'none !important',
            ...style,
          }}>
          <StyledIcon>
            <Icon
              fill={
                !isHovered && !isActive
                  ? 'rgba(165, 162, 165, 1)'
                  : theme.palette.primary.main
              }
            />
          </StyledIcon>
          <ListItemText
            sx={{
              color: 'black',
              fontSize: 14,
              fontWeight: 'bold !important',
              '& span': {
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                flexDirection: 'row',
              },
            }}>
            {text}
            {count > 0 && (
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(36, 33, 44, 0.08)',
                  color: 'rgba(36, 33, 44, 0.5)',
                  height: 23,
                  width: 23,
                  borderRadius: 10,
                  marginLeft: 1,
                }}>
                <Typography sx={{ fontSize: 13 }}>{count}</Typography>
              </Box>
            )}
          </ListItemText>
        </StyledListItem>
      </StyledNavLink>
      {subItems &&
        subItems.map((item: any, i: number) => {
          const isActiveSubItem = location.pathname == item.route
          return (
            <List key={i} component='div' disablePadding>
              <StyledNavLink
                to={item.route}
                sx={{
                  backgroundColor: isActiveSubItem
                    ? theme.palette.primary.light
                    : '',
                }}>
                <StyledListItem
                  sx={{
                    pl: 4,
                    backgroundColor: isActiveSubItem
                      ? theme.palette.primary.light
                      : '',
                  }}>
                  <StyledIcon
                    sx={{
                      '& .MuiSvgIcon-root': {
                        fontSize: '1.4rem',
                      },
                    }}>
                    <SubdirectoryArrowRight />
                  </StyledIcon>
                  <ListItemText
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.9rem',
                      },
                    }}>
                    {item.text}
                  </ListItemText>
                </StyledListItem>
              </StyledNavLink>
            </List>
          )
        })}
    </>
  )
}

const MenuItems = (props: any) => {
  const { userRoles } = props
  const { data: projects, isFetching: isFetchingProjects } =
    useProjectsCount('projects-count')
  const projectsCount = projects?.totalProjects || 0
  menuItems[
    menuItems.findIndex(item => item.text.toLowerCase() == 'projects')
  ].count = projectsCount

  return (
    <>
      {menuItems.map((menuItem, key) => {
        return checkUserRoles(menuItem.roles, userRoles) ? (
          <MenuItem
            key={key}
            route={menuItem.route}
            text={menuItem.text}
            Icon={menuItem.icon}
            count={menuItem?.count || 0}
            rolesAllowed={menuItem.roles}
            subItems={menuItem?.subItems}
          />
        ) : null
      })}
    </>
  )
}

export default MenuItems
