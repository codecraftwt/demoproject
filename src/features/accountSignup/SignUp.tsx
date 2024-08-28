import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Button, Grid } from '@mui/material'
import { Link } from 'react-router-dom'

export const SignUp = () => {
  const { loginWithRedirect } = useAuth0()

  return <><Button
    variant="contained"
    fullWidth
    sx={{ mb: 2 }}
    onClick={() =>
      loginWithRedirect({
        authorizationParams: {
          redirect_uri: `${window.location.origin}/create-organization`,
          screen_hint: 'signup'
        }
      })
    }>
    Sign Up
  </Button>
    <Grid container>
      <Grid item>
        <Link to={'/login'}>
          {"Already have an account? Login"}
        </Link>
      </Grid>
    </Grid>
  </>
}