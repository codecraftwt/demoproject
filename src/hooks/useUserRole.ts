import { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import jwtDecode from 'jwt-decode'

// TODO: Should be an env variable
const namespace: string = 'http://localhost:3003'

export const useUserRole = () => {
  const { getAccessTokenSilently } = useAuth0()
  const [userRole, setUserRole] = useState(null)

  useEffect(() => {
    (async () => {
      try {
        const token = await getAccessTokenSilently()
        const decoded: any = jwtDecode(token)
        console.log('decoded token: ', decoded)
        console.log('decoded token user role: ', decoded[namespace+'/roles'])
        // TODO: Set user role
      } catch (e) {
        console.log('Error decoding token')
      }
    })()
  }, [getAccessTokenSilently])

  if (!userRole) {
    return ''
  }

  return userRole
}