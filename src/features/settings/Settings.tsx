import React, { useEffect, useState } from 'react'
import { Box, Container, SnackbarOrigin, Typography } from '@mui/material'
import {
  useMutateSettings,
  useGetSettingsByUserId,
  useGetTimezones,
  useGetProjectForms,
  useMutateNukeAccount,
} from './hooks'
import { Fetching } from '../../components/Fetching'
import { SettingsForm } from './SettingsForm'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import SnackBarContext from '../../context/SnackBarContext'
import { useAuth0 } from '@auth0/auth0-react'
import { useSessionStorage } from '../../hooks/useSessionStorage'

// TODO: Other possible settings: language preference (Spanish/English), cost codes
// TODO: Add user settings gathering from the authentication flow instead. Only update on save here.

export interface State extends SnackbarOrigin {
  open: boolean
}

export const Settings = () => {
  const { isLoading, user, logout } = useAuth0()
  const [, setSettings] = useLocalStorage('settings', {})
  const { data: timezones, isFetching: isFetchingZones } = useGetTimezones()
  const { data: userSettings, isFetching: isFetchingSettings } =
    useGetSettingsByUserId('settings')
  const { data: forms, isFetching: isFetchingForms } =
    useGetProjectForms('forms')
  const { mutate } = useMutateSettings('settings', 123)
  const [currentUserRole, setCurrentUserRole] = useState(null)
  const snackBarMode = React.useContext(SnackBarContext)
  const { mutate: nukeAccount } = useMutateNukeAccount('nukeAccount')
  const [sessionUser] = useSessionStorage('user', {})

  useEffect(() => {
    if (user) {
      setCurrentUserRole(user[`${process.env.REACT_APP_WEB_URL}/roles`][0])
    }
  }, [user])

  if (isFetchingForms || isFetchingSettings || isFetchingZones || isLoading) {
    return <Fetching />
  }

  const handleSubmit = (formData: any) => {
    mutate(formData)
    setSettings(formData)
    snackBarMode.toggleSnackbar('Settings Updated!', 'success')
  }

  const handleNukeAccount = async () => {
    try {
      const nukedAccount = await nukeAccount(sessionUser?.accountId?._id)
      console.log('sessionUser: ', sessionUser)
      console.log('sessionUser?.accountId?._id: ', sessionUser?.accountId?._id)
      console.log('nukedAccount: ', nukedAccount)
      // localStorage.clear()
      // sessionStorage.clear()
      logout({
        logoutParams: {
          returnTo: `${window.location.origin}/login`,
        },
      })
    } catch (error) {
      console.error('Error deleting account:', error)
    }
  }

  return (
    <>
      {timezones && forms && currentUserRole ? (
        <Box sx={{ marginTop: 1, marginLeft: 2, marginRight: 2 }}>
          <Container maxWidth='lg'>
            {userSettings ? (
              <SettingsForm
                {...userSettings}
                forms={forms}
                timezones={timezones}
                currentUserRole={currentUserRole}
                onSubmit={handleSubmit}
                handleNukeAccount={handleNukeAccount}
              />
            ) : (
              <Typography variant='h4' gutterBottom>
                Settings
              </Typography>
            )}
          </Container>
        </Box>
      ) : null}
    </>
  )
}
