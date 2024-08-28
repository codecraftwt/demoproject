import React, { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import VerifyAccount from './VerifyAccount'
import { Login } from '../auth/Login'
import { useAuth0 } from '@auth0/auth0-react'

export const VerificationAccount = (props: any) => {
  //const [authUser, setAuthUser] = useState<any | undefined>(null)
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoading, isAuthenticated, user } = useAuth0()

  useEffect(() => {
    if (user) {
      //setAuthUser(user)
      if (isAuthenticated) {
        navigate('/')
      }
    }
  }, [user, isAuthenticated, navigate])

  if (isLoading) {
    return <div>Loading...</div>
  }

  return <>
    <VerifyAccount id={id} />
    <Login />
  </>
}