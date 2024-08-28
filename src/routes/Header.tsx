import { useAuth0 } from '@auth0/auth0-react'
import { NotificationsOutlined, ScreenshotMonitor } from '@mui/icons-material'
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  MenuItem,
  Menu as NavMenu,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LogoImage from '../assets/icons/logo.svg'
import KioskModeContext from '../context/KioskModeContext'
import { Logout } from '../features/auth/Logout'
import { useSessionStorage } from '../hooks/useSessionStorage'
import { useGetUserAccount } from '../features/userManagement/hooks'

export const Header = ({ isOpened, toggleIsOpened }: any) => {
  const { user } = useAuth0()
  const [sessionUser] = useSessionStorage('user', {})
  const navigate = useNavigate()
  const kioskMode = React.useContext(KioskModeContext)
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const [userRoles, setUserRoles] = useState<
    'vtadmin' | 'superintendent' | 'worker' | null
  >(null)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const { data, isFetching } = useGetUserAccount('user', sessionUser?.userId)
  const userPic: any = data ? data.idPhoto || data.picture : ''
  const initials: any = user ? user.nickname : ''

  useEffect(() => {
    setUserRoles(user![`${process.env.REACT_APP_WEB_URL}/roles`])
  }, [])

  return (
    <AppBar sx={{ backgroundColor: '#24212C' }}>
      <Toolbar>
        {/* <IconButton
          onClick={() => toggleIsOpened()}>
          {isOpened
            ? <ChevronLeft sx={{ color: `${theme.palette.primary.contrastText}` }} />
            : <Menu sx={{ color: `${theme.palette.primary.contrastText}` }} />
          }
        </IconButton> */}
        {user && !isFetching && (
          <>
        <Link to='/dashboard' style={{ marginRight: 'auto', marginTop: '5px' }}>
          <img src={LogoImage} width='100' />
        </Link>

        <Box sx={{ flexGrow: 0 }}>
          <Tooltip title='Notifications'>
            <IconButton onClick={() => {}} sx={{ marginRight: 0.4 }}>
              <NotificationsOutlined sx={{ color: 'rgba(255,255,255,0.7)' }} />
            </IconButton>
          </Tooltip>
          <Tooltip title='Open settings'>
            <IconButton onClick={handleClick} sx={{ p: 0 }}>
              <Avatar
                sx={{
                  backgroundColor: `${theme.palette.secondary.main}`,
                  width: 35,
                  height: 35,
                  marginRight: 1,
                }}
                src={userPic}>
                {initials.substring(0, 1)}
              </Avatar>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                {user?.email?.toString()}
              </Typography>
            </IconButton>
          </Tooltip>
          <NavMenu
            id='basic-menu'
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}>
            {/* <MenuItem onClick={handleClose}>My account</MenuItem> */}
            {/* <MenuItem onClick={colorMode.toggleColorMode}>
              <Button
                variant='text'
                color='secondary'
                endIcon={
                  theme.palette.mode === 'dark'
                    ? <Brightness7 />
                    : <Brightness4 />
                }>
                {theme.palette.mode}
              </Button>
            </MenuItem> */}
            <MenuItem onClick={() => null} disabled>
              <Typography variant='h6'>
                {sessionUser?.accountId?.companyName}
              </Typography>
            </MenuItem>
            {userRoles?.includes('superintendent') && (
              <MenuItem
                onClick={() => {
                  handleClose()
                  navigate('/profile')
                }}>
                Profile
              </MenuItem>
            )}
            <MenuItem onClick={kioskMode.setProjectFirst}>
              <Button
                variant='text'
                color='secondary'
                endIcon={<ScreenshotMonitor />}>
                Kiosk Mode
              </Button>
            </MenuItem>
            <MenuItem onClick={handleClose}>
              <Logout />
            </MenuItem>
          </NavMenu>
        </Box>
        </>
        )
        }
      </Toolbar>
    </AppBar>
  )
}
