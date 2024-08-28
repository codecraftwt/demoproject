import React from 'react'
import { withAuthenticationRequired } from '@auth0/auth0-react'
import { Fetching } from '../components/Fetching'

export const ProtectedRoute: React.FC<any> = ({ component, ...args }) => {

  const Component = withAuthenticationRequired(component,
    {
      returnTo: '/login',
      onRedirecting: () => <Fetching />,
      ...args
    })
  return <Component />
}