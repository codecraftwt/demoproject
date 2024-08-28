import { useAuth0 } from '@auth0/auth0-react'
import jwtDecode from 'jwt-decode'

export const getUserRole = async() => {
    const { getAccessTokenSilently } = useAuth0()

    const theToken = await getAccessTokenSilently()
    const decoded = jwtDecode(theToken)
    console.log('access token', decoded)
}