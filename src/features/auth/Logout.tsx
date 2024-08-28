import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Button } from '@mui/material'
import { PowerSettingsNew } from '@mui/icons-material'

export const Logout = () => {

  const { logout } = useAuth0()

  return <>
    <Button
      variant='contained'
      color='secondary'
      startIcon={<PowerSettingsNew />}
      onClick={() => {
        localStorage.clear()
        sessionStorage.clear()
        logout({
          logoutParams: {
            returnTo: `${window.location.origin}/login`,
          }
        })
      }}>
      Logout
    </Button>
  </>
}