import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  Button,
  Grid,
  CardContent,
  Box,
} from '@mui/material'
import { CostCodeSelectField } from '../../components/timesheet/CostCodeSelectField'
import { HRQuestions } from '../../components/timesheet/HRQuestions'
import {
  useGetEntityFormByType,
  useGetHRQuestions,
} from '../../hooks/entityFormHook'
import { useGetAllCostCodes } from '../projects/cost-codes/hooks'
import { TimeStamps } from '../../components/timesheet/TimeStamps'
import { useParams, useLocation } from 'react-router-dom'
import {
  useGetTimeCard,
  useMutateTimesheet,
  useGetWorker,
  useGetAuthUser,
} from './hooks'
import {
  guessUserTZ,
  getCurrentDateTime,
  getTwoHoursBefore,
} from '../../lib/time'
import { useNavigate } from 'react-router-dom'
import { StyledCard } from '../../components/StyledCard'
import { useGetLatestTimeSheetByWorker, useGetProject } from '../projects/hooks'
import { KioskProjectCard } from '../../components/project/KioskProjectCard'
import { GoogleMapComponent } from '../../components/map/GoogleMapComponent'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useGetTNMItems } from '../projects/time-materials/hooks'
import { BackButton } from '../../components/navigation/BackButton'
import { useAuth0 } from '@auth0/auth0-react'
import { useGeolocated } from 'react-geolocated'
export const TimeCard = (props: any) => {
  const { selectedLocation } = props
  const { id, timecardId, workerId, authUserSub } = useParams()
  const { user: authUser, isLoading: isLoadingAuthUser } = useAuth0()
  const [isClockedIn, setIsClockedIn] = useState(!timecardId ? false : true)
  const [costCodes, setCostCodes] = useState([])
  const [selectedLocations, setSelectedLocation] = useState(selectedLocation)
  const [hrQuestions, setHRQuestions] = useState([])
  const [hasErrors, setHasErrors] = useState(false)
  const { data: hrQuestionsForm } = useGetEntityFormByType(
    'timesheet',
    'timesheet'
  )
  const { data: newhrquestions } = useGetHRQuestions('hr-questions')

  const { data: costCodeOptions } = useGetAllCostCodes('costcodes', id)
  const queryKey = ['timecards', timecardId]
  let { data: timeCard } = useGetTimeCard(queryKey, id)
  const { mutateAsync: mutateTimesheet } = useMutateTimesheet(queryKey)
  const { data: projectData } = useGetProject('project', id)
  const { data: workerData } = useGetWorker('worker', workerId)
  const { data: authUserData } = useGetAuthUser('authUser', authUser?.sub)
  const { data: tnmItems } = useGetTNMItems('tmreports', id)
  const [settings, setSettings] = useLocalStorage('settings', {})
  const [isDisabled, setIsDisabled] = useState(false)
  const [error, setError] = useState('')
  const [required, setRequired] = useState<boolean>(false)
  const [errorss, setErrors] = useState<boolean>(false)
  const [isLocationMatching, setIsLocationMatching] = useState(true)
  const defaultLunchDuration =
    projectData?.lunchDuration || settings.adminSettings?.lunchDuration || 30
  const navigate = useNavigate()
  const location = useLocation()
  const { data: timesheet } = useGetLatestTimeSheetByWorker(
    'timecards',
    workerId
  )

  const handleHRQuestions = (hrQuestions: any) => {
    setHRQuestions(hrQuestions)
  }

  // Helper function to determine if lunch was taken
  const checkIfLunchWasTaken = () => {
    return (
      hrQuestions?.some(
        (question: any) =>
          question?.question?.toLowerCase().includes('lunch') &&
          question?.answerText?.toLowerCase() === 'yes'
      ) ?? false
    )
  }

  const handleClockInOutNew = async () => {
    const isLunchTaken = checkIfLunchWasTaken()

    if (!isLocationMatching) {
      setError('You are not in the geofence')
      return
    }
    if (required) {
      setError('Please select answers for HR questions')
      return
    }
    setIsDisabled(true)

    try {
      const nowTimeStamp = getCurrentDateTime()
      const deviceTZ = guessUserTZ()
      const isEdit = location.pathname.includes('edit')

      const clockInOutData = !isClockedIn
        ? {
            startTimeStamp: nowTimeStamp,
            isClockedOut: false,
            timeStampTimeZone: deviceTZ,
          }
        : {
            _id: timeCard._id,
            startTimeStamp: timeCard.startTimeStamp,
            endTimeStamp: nowTimeStamp,
            timeStampTimeZone: deviceTZ,
            isClockedOut: true,
            isLunchBreakTaken: isLunchTaken,
            editedBy: isEdit ? authUserData?._id : null,
          }

      const timeCardData = {
        isClockedIn: !isClockedIn,
        clockOutAnswers: hrQuestions,
        costCodes: costCodes,
        project: id,
        user: workerId,
        ...clockInOutData,
      }

      await mutateTimesheet(timeCardData)
      navigate(`/projects/${id}`)
    } catch (error) {
      console.error('Failed to update timesheet:', error);
      setError('Error updating timesheet');
    } finally {
      setIsDisabled(false)
    }
  }

  useEffect(() => {
    if (!selectedLocation) setSelectedLocation(projectData?.locations[0])
    const errors = costCodes.filter(
      (costCode: any) => costCode.costCode === '' || costCode.percentage > 100
    )
    setHasErrors(errors.length > 0)
  }, [costCodes, errorss, workerId, selectedLocation, timeCard])
  const { coords } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: true,
    },
    userDecisionTimeout: 5000,
  })
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371 // Radius of the earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180) // Convert degrees to radians
    const dLon = (lon2 - lon1) * (Math.PI / 180)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distance in km
    return distance
  }

  useEffect(() => {
    if (coords) {
      console.log('Current Location:', coords)
      const distance = calculateDistance(
        selectedLocation.latitude,
        selectedLocation.longitude,
        coords.latitude,
        coords.longitude
      )

      const radius = selectedLocation?.radius || 10 // Set your desired radius in kilometers
      if (distance > radius) {
        setIsLocationMatching(false)
      } else {
        setIsLocationMatching(true)
      }
    }
  }, [coords, selectedLocation])

  return (
    <>
      <Container maxWidth='lg'>
        <Grid item xs={12} sm={6} md={4} lg={4}>
          <BackButton steps={workerId ? -3 : -1} />
        </Grid>
        <Typography variant='h4' gutterBottom>
          Time Card
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <KioskProjectCard
              project={projectData}
              user={workerData}
              selectedLocation={selectedLocations}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4} lg={4}>
            <StyledCard>
              <CardContent>
                {workerData ? (
                  <Typography variant='body1'>
                    {workerData.firstName} {workerData.lastName}
                    <br />
                    Id No.: {workerData.idNumber}
                  </Typography>
                ) : null}
                {timeCard ? (
                  <TimeStamps startTime={timeCard.workStartDateTimeUTC} />
                ) : null}
                <Button
                  onClick={handleClockInOutNew}
                  disabled={
                    isDisabled ||
                    (timeCard?.project !== projectData?._id && timecardId) ||
                    hasErrors ||
                    errorss ||
                    (timeCard && timeCard.finalizedDateUTC) ||
                    (timesheet && !timecardId)
                  }
                  variant='contained'
                  color='primary'>
                  {timecardId ? 'Clock Out' : 'Clock In'}
                </Button>
                <Box sx={{ marginTop: '10px' }}>
                  {error && (
                    <Typography variant='body2' color='error'>
                      <p style={{ color: 'red' }}>{error}</p>
                    </Typography>
                  )}
                </Box>
                {timesheet && !timecardId && (
                  <p style={{ color: 'red' }}>User is already clocked-in</p>
                )}
              </CardContent>
            </StyledCard>
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4}>
            <StyledCard>
              <CardContent>
                {projectData ? (
                  <GoogleMapComponent locations={[selectedLocations]} />
                ) : null}
              </CardContent>
            </StyledCard>
          </Grid>
          {costCodeOptions && timecardId ? (
            <Grid item xs={12} sm={12} md={8} lg={12}>
              <StyledCard>
                <CardContent>
                  <CostCodeSelectField
                    setErrors={setErrors}
                    handleCostCodes={setCostCodes}
                    costCodeOptions={costCodeOptions}
                    tnmItems={tnmItems}
                  />
                </CardContent>
              </StyledCard>
            </Grid>
          ) : null}
          {newhrquestions && newhrquestions?.length && timecardId ? (
            <Grid item xs={12} sm={12} md={8} lg={12}>
              <HRQuestions
                handleHRQuestions={handleHRQuestions}
                fields={newhrquestions}
                setRequired={setRequired}
              />
            </Grid>
          ) : null}
        </Grid>
        <br />
      </Container>
    </>
  )
}
