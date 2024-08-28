import React, { useEffect, useState } from 'react'
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import { LocalizationProvider, MobileTimePicker } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { convertTZToUTC, convertUTCToTZ, guessUserTZ } from '../../lib/time'
import NotificationSettings from '../../types/NotificationSettings'
import { ConfirmDeleteProfile } from './ConfirmDeleteAccount'

interface Timezone {
  tz: string
  show: boolean
}

export const SettingsForm = (props: any) => {
  const [open, setOpen] = useState(false)
  const {
    timeZone,
    timezones,
    currentUserRole,
    adminSettings,
    onSubmit,
    handleNukeAccount,
  } = props
  const [formData, setFormData] = useState<any | undefined>({
    timeZone: timeZone,
  })
  const [adminFormData, setAdminFormData] = useState<NotificationSettings>(
    adminSettings && Object.keys(adminSettings).length !== 0
      ? adminSettings
      : {
          sendDailyReportReminder: true,
          defaultTimeForReminders: '08:30 PM',
          defaultTimeForRemindersUTC: null,
          sendDailyClockOutReminder: false,
          sendAllProjectActivityUpdates: false,
          sendSingleEmailPerProject: false,
          sendSingleEmailPerProjectTimeInterval: 'Once a day',
          lunchDuration: 30,
        }
  )

  const submitHandler = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    const submitData = {
      ...formData,
      adminSettings: {
        ...adminFormData,
      },
    }
    onSubmit(submitData)
  }

  const onDataEntry = (event?: React.ChangeEvent<HTMLInputElement> | any) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const onAdminDataEntry = (
    event?: React.ChangeEvent<HTMLInputElement> | any
  ) => {
    if ('checked' in event.target) {
      setAdminFormData({
        ...adminFormData,
        [event.target.name]: event.target.checked ? true : false,
      })
    } else {
      setAdminFormData({
        ...adminFormData,
        [event.target.name]: event.target.value,
      })
    }
  }

  const onTimeForReminderChange = (newTime: string | null) => {
    setAdminFormData({
      ...adminFormData,
      defaultTimeForReminders: newTime,
      defaultTimeForRemindersUTC: newTime ? convertTZToUTC(newTime) : newTime,
    })
  }

  const onNukeAccount = () => {
    setOpen(false)
    handleNukeAccount()
  }

  useEffect(() => {
    if (
      adminFormData.defaultTimeForRemindersUTC &&
      !adminFormData.defaultTimeForReminders
    ) {
      const userTZ = formData.timeZone ? formData.timeZone : guessUserTZ()
      const defaultTimeForReminders = convertUTCToTZ(
        adminFormData.defaultTimeForRemindersUTC,
        userTZ
      )
      setAdminFormData({
        ...adminSettings,
        defaultTimeForReminders: defaultTimeForReminders,
      })
    }
  }, [adminSettings, adminFormData, setAdminFormData, formData])

  return (
    <>
      {formData && adminFormData ? (
        <>
          <form onSubmit={submitHandler}>
            <Typography variant='h4' gutterBottom>
              Settings
            </Typography>
            <Card variant='outlined' sx={{ marginBottom: 3 }}>
              <CardContent>
                <InputLabel>Timezone</InputLabel>
                <FormControl sx={{ mt: 1, mb: 1, width: 300 }}>
                  <Select
                    id='timeZone'
                    name='timeZone'
                    placeholder='Select a timezone'
                    variant='filled'
                    value={formData.timeZone}
                    onChange={onDataEntry}>
                    {timezones.map((timeZone: Timezone, index: number) => {
                      return timeZone.show ? (
                        <MenuItem key={timeZone.tz} value={timeZone.tz}>
                          {timeZone.tz}
                        </MenuItem>
                      ) : null
                    })}
                  </Select>
                </FormControl>
              </CardContent>
            </Card>
            {currentUserRole === 'vtadmin' ? (
              <>
                <Typography variant='h4' gutterBottom>
                  Daily Report Settings
                </Typography>
                <Card variant='outlined' sx={{ marginBottom: 3 }}>
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name='sendDailyReportReminder'
                          checked={adminFormData.sendDailyReportReminder}
                          onChange={onAdminDataEntry}
                          // disabled
                        />
                      }
                      label='Send me a reminder about Daily Reports'
                    />
                  </CardContent>
                  <Divider variant='middle' />
                  <CardContent>
                    <InputLabel>Time for Reminders</InputLabel>
                    <FormControl sx={{ mt: 1, mb: 1, width: 300 }}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <MobileTimePicker
                          label=''
                          value={adminFormData.defaultTimeForReminders}
                          onChange={newTime => onTimeForReminderChange(newTime)}
                          renderInput={params => <TextField {...params} />}
                          // disabled
                        />
                      </LocalizationProvider>
                    </FormControl>
                  </CardContent>
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name='sendDailyClockOutReminder'
                          checked={adminFormData.sendDailyClockOutReminder}
                          onChange={onAdminDataEntry}
                          // disabled
                        />
                      }
                      label='Notify me when people have not clocked out by the end of the workday'
                    />
                  </CardContent>
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name='sendAllProjectActivityUpdates'
                          checked={adminFormData.sendAllProjectActivityUpdates}
                          onChange={onAdminDataEntry}
                          // disabled
                        />
                      }
                      label='Notify me on all project activity'
                    />
                  </CardContent>
                  <CardContent>
                    <FormControlLabel
                      control={
                        <Switch
                          name='sendSingleEmailPerProject'
                          checked={adminFormData.sendSingleEmailPerProject}
                          onChange={onAdminDataEntry}
                          // disabled
                        />
                      }
                      label='Send me a single email per project individually'
                    />
                  </CardContent>
                  {adminFormData.sendSingleEmailPerProject ? (
                    <CardContent>
                      <InputLabel>
                        Send Single Email Per Project Time Interval
                      </InputLabel>
                      <FormControl sx={{ mt: 1, mb: 1, minWidth: 300 }}>
                        <Select
                          id='sendSingleEmailPerProjectTimeInterval'
                          name='sendSingleEmailPerProjectTimeInterval'
                          placeholder='Select users to send notifications'
                          variant='filled'
                          value={
                            adminFormData.sendSingleEmailPerProjectTimeInterval
                          }
                          onChange={onAdminDataEntry}>
                          <MenuItem key='OnceADay' value='Once a day'>
                            Once a day
                          </MenuItem>
                          <MenuItem key='AsItHappens' value='As it happens'>
                            As it happens
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </CardContent>
                  ) : null}
                </Card>
                <Card>
                  <CardContent>
                    <InputLabel>Lunch Break Duration</InputLabel>
                    <FormControl sx={{ mt: 1, mb: 1, minWidth: 300 }}>
                      <Select
                        id='lunchDuration'
                        name='lunchDuration'
                        placeholder='Select lunch break duration'
                        variant='filled'
                        value={adminFormData.lunchDuration}
                        onChange={onAdminDataEntry}>
                        <MenuItem key='30' value={30}>
                          30 mins
                        </MenuItem>
                        <MenuItem key='45' value={45}>
                          45 mins
                        </MenuItem>
                        <MenuItem key='60' value={60}>
                          60 mins
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </CardContent>
                </Card>
              </>
            ) : null}
            <Stack spacing={2} direction='row' sx={{ mt: 2 }}>
              <Button type='submit' variant='contained'>
                Save
              </Button>
            </Stack>
          </form>
          {currentUserRole === 'vtadmin' ? (
            <>
              <Typography variant='h4' gutterBottom>
                Danger Zone
              </Typography>
              <Card variant='outlined' sx={{ marginBottom: 3 }}>
                <CardContent>
                  <Typography variant='body1' gutterBottom sx={{ mb: 2 }}>
                    Delete your account. This is irreversible.
                  </Typography>
                  <Button
                    variant='outlined'
                    color='error'
                    onClick={() => {
                      setOpen(true)
                    }}>
                    Delete Account
                  </Button>
                  <ConfirmDeleteProfile
                    open={open}
                    handleActionCallback={() => onNukeAccount()}
                    handleClose={() => setOpen(false)}
                  />
                </CardContent>
              </Card>
            </>
          ) : null}
        </>
      ) : null}
    </>
  )
}
