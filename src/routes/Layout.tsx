import React, { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Box, styled, Toolbar } from '@mui/material'
import { Header } from './Header'
import { SideBar } from './SideBar'
import { useAuth0 } from '@auth0/auth0-react'
import { Fetching } from '../components/Fetching'

const OuterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  overflow: 'hidden',
  height: 'inherit',
  flexDirection: 'column',
  minHeight: '100vh',
  fontFamily: 'Montserrat, sans-serif',
}))

const StyledHeader = styled(Header)`
  //flex: 1;
`

const StyledToolbar = styled(Toolbar)`
  //flex: 1;
`

const InnerContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flex: 1,
  flexdirection: 'row',
  overflow: 'hidden',
  height: '100%',
}))

const StyledMain = styled('main')(({ theme }) => ({
  //backgroundColor: theme.palette.primary.light,
  height: 'calc(100vh - 64px)',
  flex: 1,
  overflow: 'auto',
  width: '100%',
  backgroundColor: '#F1EFF1',
  paddingTop: '30px',
  paddingBottom: '6rem',
}))

const FetchingCenteredContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  overflow: 'hidden',
  height: '100%',
  flexDirection: 'row',
  minHeight: '100vh',
  fontFamily: 'Montserrat, sans-serif',
  alignItems: 'center',
  justifyContent: 'center',
}))

export const Layout = () => {
  const [isOpened, setIsOpened] = useState(true)

  const location = useLocation()

  const toggleIsOpened = () => {
    setIsOpened(!isOpened)
  }
  const { isLoading } = useAuth0()

  if (isLoading) {
    return (
      <FetchingCenteredContainer>
        <Fetching />
      </FetchingCenteredContainer>
    )
  }

  return (
    <OuterContainer>
      <StyledHeader isOpened={isOpened} toggleIsOpened={toggleIsOpened} />
      <StyledToolbar />

      <InnerContainer>
        <SideBar isOpened={isOpened} />
        <StyledMain>
          <Outlet />
        </StyledMain>
      </InnerContainer>
      {/*<Footer>
          <Typography>Footer</Typography>
        </Footer>*/}
    </OuterContainer>
  )
}
