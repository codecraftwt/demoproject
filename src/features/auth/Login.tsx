import React from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import Button from '@mui/material/Button'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Grid } from '@mui/material'
import { Fetching } from '../../components/Fetching'

export const Login = () => {
  const navigate = useNavigate()
  const { loginWithRedirect, isAuthenticated } = useAuth0()
  const [searchParams] = useSearchParams()
  const createNonce = () =>
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)

  if (!searchParams.get('isRegister') && isAuthenticated) {
    navigate('/dashboard')
  } else {
    // If this was a button click from the email verified page clear out local storage
    localStorage.clear()
  }

  if (searchParams.get('invitation')) {
    const inviteURL =
      `https://${process.env.REACT_APP_AUTH0_DOMAIN}/authorize` +
      `?response_type=id_token token` +
      `&client_id=${process.env.REACT_APP_AUTH0_CLIENT_ID}` +
      `&redirect_uri=${window.location.origin}/complete-signup` +
      `&scope=openid profile email` +
      `&audience=${process.env.REACT_APP_AUTH0_AUDIENCE}` +
      `&organization=${searchParams.get('organization')}` +
      `&invitation=${searchParams.get('invitation')}` +
      `&nonce=${createNonce()}`
    console.log('inviteURL', inviteURL)
    window.location.href = inviteURL
    return (
      <>
        <Fetching />
      </>
    )
  }

  return (
    <>
      <Button
        variant='contained'
        fullWidth
        sx={{ mb: 2 }}
        onClick={() => {
          localStorage.clear()
          sessionStorage.clear()
          loginWithRedirect({
            authorizationParams: {
              redirect_uri: `${window.location.origin}`,
            },
          })
        }}>
        Sign In
      </Button>
      <Grid container>
        <Grid item>
          <Link to={'/create-organization'}>
            {"Don't have an account? Sign Up"}
          </Link>
        </Grid>
      </Grid>
    </>
  )
}
