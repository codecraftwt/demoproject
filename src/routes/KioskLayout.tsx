import React from 'react'
import { Outlet } from 'react-router-dom'
import {
  Box,
  styled,
} from '@mui/material'
import { useAuth0 } from '@auth0/auth0-react'
import { Fetching } from '../components/Fetching'

const OuterContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  overflow: 'hidden',
  height: 'inherit',
  flexDirection: 'column',
  minHeight: '100vh',
  fontFamily: 'Montserrat, sans-serif'
}))

// const StyledHeader = styled(Header)`
//   //flex: 1;
// `

// const StyledToolbar = styled(Toolbar)`
//   //flex: 1;
// `

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
  height: '100vh',
  flex: 1,
  overflow: 'auto',
  width: '100%',
  paddingTop: '30px',
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


export const KioskLayout = () => {
  const { isLoading } = useAuth0()

  if (isLoading) {
    return <FetchingCenteredContainer>
      <Fetching />
    </FetchingCenteredContainer>
  }

  return (
    <OuterContainer>
      <InnerContainer>
        <StyledMain>
          <Outlet />
        </StyledMain>
      </InnerContainer>
    </OuterContainer>
  )
}