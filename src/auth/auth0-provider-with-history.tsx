import React from 'react'
import { Auth0Provider } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';

const Auth0ProviderWithHistory: React.FC<any> = ({ children }) => {
  const domain: string = (process.env.REACT_APP_AUTH0_DOMAIN as string)
  const clientId: string = (process.env.REACT_APP_AUTH0_CLIENT_ID as string)
  const audience: string = (process.env.REACT_APP_AUTH0_AUDIENCE as string)
  const navigate = useNavigate()

  const onRedirectCallback = (appState: any) => {
    navigate((appState && appState.returnTo) || window.location.pathname)
    console.log('redirect call back', appState)
  }

  return <Auth0Provider
    domain={domain}
    clientId={clientId}
    authorizationParams={{
      redirect_uri: window.location.origin,
      audience: audience,
      prompt: 'login',
      scope: "openid profile email offline_access"
    }}
    onRedirectCallback={onRedirectCallback}
    useRefreshTokens={true}
    useRefreshTokensFallback={true}
    cacheLocation='localstorage'
  >
    {children}
  </Auth0Provider>
}

export default Auth0ProviderWithHistory