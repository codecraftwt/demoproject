import React, { useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { useMutateRegisterUser } from './hooks'
import { guessUserTZ } from '../../lib/time'
import { useNavigate } from 'react-router-dom'
import { Fetching } from '../../components/Fetching'

export const CompleteSignUp = () => {
  const { user, isLoading, loginWithRedirect }: any = useAuth0()
  const { mutateAsync: registerUserAsync } = useMutateRegisterUser('user')
  const navigate = useNavigate()

  useEffect(() => {
    if (!user && !isLoading) {
      loginWithRedirect({
        authorizationParams: {
          redirect_uri: `${window.location.origin}/complete-signup`,
          screen_hint: 'login'
        }
      })
    } else if (user && !isLoading) {
      const registerUser = async () => {
        //console.log('user roles', user[`${process.env.REACT_APP_WEB_URL}/roles`][0])
        const payload = {
          user: {
            ...user,
            timeZone: guessUserTZ(),
            type: user[`${process.env.REACT_APP_WEB_URL}/roles`][0]
          },
        }
        await registerUserAsync(payload)
        navigate('/dashboard')
      }
      registerUser()
    }

  }, [user, isLoading, loginWithRedirect, navigate, registerUserAsync])

  return <>
    <Fetching />
  </>
}