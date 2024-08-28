import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import CssBaseline from '@mui/material/CssBaseline'
import * as Sentry from '@sentry/react'

// import i18n (needs to be bundled ;))
import './lib/i18n'
import SnackBarContext from './context/SnackBarContext'

// Error logging
Sentry.init({
  dsn: process.env.REACT_APP_SENTRYIO_DSN,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay({
      networkDetailAllowUrls: [
        ///^https:\/\/api\.bynaus\.ai\/v1\/projects\/.*/,
        'https://api.bynaus.ai/v1/projects/search',
        'https://api.bynaus.ai/v1/users/register-user',
      ],
      networkRequestHeaders: ['X-Custom-Header'],
      networkResponseHeaders: ['X-Custom-Header'],
    }),
  ],
  tracesSampleRate: process.env.REACT_APP_SENTRYIO_TRACES_SAMPLE_RATE
    ? parseInt(process.env.REACT_APP_SENTRYIO_TRACES_SAMPLE_RATE)
    : 0.25,
  attachStacktrace: process.env.REACT_APP_SENTRYIO_ATTACH_Stacktrace === 'true',
  debug: process.env.REACT_APP_SENTRYIO_DEBUG === 'true',
  release: process.env.REACT_APP_RELEASE,
  environment: process.env.REACT_APP_ENVIRONMENT,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
})

const toggleSnackbar = (message: any, severity: any) => {}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <React.StrictMode>
    <CssBaseline />
    <SnackBarContext.Provider value={{ toggleSnackbar }}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </SnackBarContext.Provider>
  </React.StrictMode>
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister()

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
