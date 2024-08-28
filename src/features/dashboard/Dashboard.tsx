import React, { useState, useEffect } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Login } from '../auth/Login'
import { Fetching } from '../../components/Fetching'
import {
  Box,
  Button,
  Card,
  Grid,
  Typography,
  useTheme,
  Paper,
  IconButton,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useSessionStorage } from '../../hooks/useSessionStorage'
import { useGetInfo, useGetStatsInfo } from './hooks'
import KioskModeContext from '../../context/KioskModeContext'
import AddIcon from '@mui/icons-material/Add'
import { GeoLocation } from './GeoLocation'
import { useGetProjectsBySuper } from '../projects/hooks'
import { getCurrentDateTime } from '../../lib/time'

import peopleIcon from '../../assets/icons/Dashboard/people.svg'
import shiftIcon from '../../assets/icons/Dashboard/shift.svg'
import inviteIcon from '../../assets/icons/Dashboard/invite.svg'

import addProjectIcon from '../../assets/icons/Dashboard/add_project.svg'
import settingIcon from '../../assets/icons/Dashboard/setting.svg'
import timesheetIcon from '../../assets/icons/Dashboard/timesheet.svg'
import viewWorkerIcon from '../../assets/icons/Dashboard/view_workers.svg'

import calendarIcon from '../../assets/icons/Dashboard/calendar.svg'
import locationIcon from '../../assets/icons/Dashboard/location.svg'
import {
  ChevBackIcon,
  Dashboard_hr_analysis,
  Dashboard_hr_incidents,
  Dashboard_hr_repeat,
  Dashboard_hr_slider_forward,
} from '../../assets/icons/icons'

import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

// User token is required so using a child component to call other hooks.
export const Dashboard = () => {
  const theme = useTheme()

  const navigate = useNavigate()

  const [authUser, setAuthUser] = useState<any | undefined>(null)
  const { isLoading, isAuthenticated, user } = useAuth0()
  const [userRoles, setUserRoles] = useState<any[]>([])
  const { data: userData, isFetching: isFetchingUserData } = useGetInfo(
    'profile',
    authUser ? authUser.sub : ''
  )
  const { data: statsData, isFetching: isFetchingStatsData } =
    useGetStatsInfo('stats')

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data: associatedProjectsData } = useGetProjectsBySuper(
    'projects',
    userData ? userData._id : null,
    userData && userRoles && userRoles.includes('superintendent') ? true : false
  )
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [, setSessionUserSettings] = useSessionStorage('user', {})
  const kioskMode = React.useContext(KioskModeContext)
  const [statistics, setStatistics] = useState<any | undefined>(null)

  useEffect(() => {
    if (user) {
      setAuthUser(user)
      setUserRoles(user[`${process.env.REACT_APP_WEB_URL}/roles`])
    }
  }, [user])

  useEffect(() => {
    if (userData && userData.account) {
      setSessionUserSettings({
        userId: userData._id,
        accountId: userData.account,
        sub: userData.sub,
      })
    }
  }, [userData, setSessionUserSettings])

  useEffect(() => {
    if (statsData) {
      setStatistics(statsData.statistics)
    }
  }, [statsData, setStatistics])

  console.log('statsData', statsData)

  if (isLoading || isFetchingUserData || isFetchingStatsData) {
    return <Fetching />
  }

  if (!isAuthenticated) {
    return (
      <div>
        Dashboard: <Login />
      </div>
    )
  }

  return (
    <>
      {authUser && statistics && (
        <Box sx={{ marginTop: 1, marginLeft: 5, marginRight: 5 }}>
          <Typography
            variant='h3'
            gutterBottom
            sx={{
              fontWeight: '500',
              color: '#2B262C',
            }}>
            Welcome,
            {authUser.nickname.charAt(0).toUpperCase() +
              authUser.nickname.slice(1)}
            !
          </Typography>

          <Grid container spacing={2} alignItems='start' sx={{ mb: 3 }}>
            <Grid item xs={12} sm={12} md={6} lg={6} sx={{}}>
              <Card
                sx={{
                  padding: 1,
                  boxShadow: 'none',
                  border: '1px solid #EEEEEE',
                  borderRadius: '8px',
                  paddingInline: '20px',
                  paddingTop: '15px',
                  height: userRoles.includes('worker') ? '25vh' : '35vh',
                }}>
                <Typography
                  sx={{
                    fontWeight: '600',
                    fontSize: '16px',
                    color: '#7C7A80',
                  }}>
                  Today
                </Typography>
                <Typography
                  sx={{
                    fontWeight: '600',
                    fontSize: '20px',
                    color: '#2B262C',
                    mb: '5px',
                  }}>
                  {/* Show the current time and date */}
                  {getCurrentDateTime('hh:mm A / DD MMMM')}
                </Typography>

                {[
                  {
                    image: peopleIcon,
                    name: `${
                      statistics?.totalClockInsToday -
                      statistics?.totalClockOutsToday
                    } person hasn't logged out today.`,
                  },
                  !userRoles.includes('worker') && {
                    image: shiftIcon,
                    name: `${statistics?.hrViolationsToday} HR/Safety Violations today.`,
                    hrclick: true,
                  },
                ].filter(Boolean)?.map((item :any, index) => (
                  <Box
                    sx={{
                      borderTop: '1px solid #DED9E7',
                      py: '15px',
                      display: 'flex',
                      alignItems: 'center',
                      cursor: index === 1 ? 'pointer' : 'auto',
                    }}
                    onClick={() => {
                      if (item?.hrclick) {
                        navigate('/dashboard/hr-violations')
                      }
                    }}>
                    <img
                      src={item?.image}
                      style={{
                        height: '3rem',
                        width: '3rem',
                        color: '#F0845D',
                        borderRadius: '50%',
                      }}
                      alt='image'
                    />
                    <Typography
                      sx={{
                        color: '#7C7A80',
                        fontSize: '17px',
                        pl: '10px',
                      }}>
                      {item?.name}
                    </Typography>
                  </Box>
                ))}
              </Card>
            </Grid>

            {!userRoles.includes('superintendent') &&
              !userRoles.includes('worker') && (
                <Grid item xs={12} sm={12} md={6} lg={6} sx={{}}>
                  <Card
                    sx={{
                      padding: 1,
                      boxShadow: 'none',
                      border: '1px solid #EEEEEE',
                      borderRadius: '8px',
                      height: '35vh',
                      position: 'relative',
                    }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        textAlign: 'center',
                        width: '100%',
                      }}>
                      <img src={inviteIcon} alt='Invite Icon' />
                      <Typography
                        sx={{
                          fontWeight: '600',
                          fontSize: '22px',
                        }}>
                        Invite Your Team Members
                      </Typography>
                      <Button
                        variant='contained'
                        sx={{
                          padding: theme.spacing(1.5, 5, 1.5, 5),
                          borderRadius: '8px',
                          textTransform: 'capitalize',
                          fontSize: '13px',
                          mt: '7px',
                        }}
                        onClick={() => navigate('/user-management/new')}>
                        <AddIcon /> <Box sx={{ width: 5 }} /> Add Users
                      </Button>
                    </Box>
                  </Card>
                </Grid>
              )}
          </Grid>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            {[
              !userRoles.includes('worker') && !userRoles.includes('superintendent') && {
                img: addProjectIcon,
                name: 'Add Project',
                color: '#7AB2B2',
                link: '/projects/new',
              },
              !userRoles.includes('worker') && {
                img: viewWorkerIcon,
                name: 'View Workers',
                color: '#726988',
                link: '/workers',
              },
              {
                img: timesheetIcon,
                name: 'Timesheet Kiosk',
                color: '#B17AB2',
              },
              {
                img: settingIcon,
                name: 'Settings',
                color: '#8C8795',
                link: '/settings',
              },
            ]
              .filter(item => item)
              .map((item, index) => (
                <Grid item xs={3} key={index}>
                  {item && (
                    <Box
                      sx={{
                        bgcolor: item.color,
                        p: 2,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        cursor: 'pointer',
                      }}
                      onClick={() => {
                        if (item.name === 'Timesheet Kiosk') {
                          kioskMode.setProjectFirst()
                        } else if (item.link) {
                          navigate(item.link)
                        }
                      }}>
                      <img
                        src={item.img}
                        alt='icons'
                        style={{ maxWidth: '100%', marginBottom: '16px' }}
                      />
                      <Typography
                        sx={{
                          color: 'white',
                          fontSize: '20',
                          fontWeight: '600',
                        }}>
                        {item.name}
                      </Typography>
                    </Box>
                  )}
                </Grid>
              ))}
          </Grid>

          <Grid container spacing={2}>
            <Grid item xs={4}>
              <Card
                sx={{
                  padding: 1,
                  boxShadow: 'none',
                  border: '1px solid #EEEEEE',
                  borderRadius: '8px',
                  paddingInline: '20px',
                  paddingTop: '15px',
                  height: '27vh',
                }}>
                <Box
                  sx={{
                    borderBottom: '1px solid #DED9E7',
                    py: '15px',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                  <img src={locationIcon} alt='image' />
                  <Typography
                    sx={{
                      color: '#7C7A80',
                      fontSize: '15px',
                      fontWeight: '600',
                      pl: '5px',
                    }}>
                    Your Location
                  </Typography>
                </Box>

                <GeoLocation />
              </Card>
            </Grid>

            <Grid item xs={4}>
              <Card
                sx={{
                  padding: 1,
                  boxShadow: 'none',
                  border: '1px solid #EEEEEE',
                  borderRadius: '8px',
                  paddingInline: '20px',
                  paddingTop: '15px',
                  height: '27vh',
                }}>
                <Box
                  sx={{
                    borderBottom: '1px solid #DED9E7',
                    py: '15px',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                  <img src={calendarIcon} alt='image' />
                  <Typography
                    sx={{
                      color: '#7C7A80',
                      fontSize: '15px',
                      fontWeight: '600',
                      pl: '5px',
                    }}>
                    Today's Clock-ins
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'end',
                  }}>
                  <Typography variant='h3' fontWeight='bold'>
                    {statistics?.totalClockInsToday}
                  </Typography>
                </Box>
              </Card>
            </Grid>

            <Grid item xs={4}>
              <Card
                sx={{
                  padding: 1,
                  boxShadow: 'none',
                  border: '1px solid #EEEEEE',
                  borderRadius: '8px',
                  paddingInline: '20px',
                  paddingTop: '15px',
                  height: '27vh',
                }}>
                <Box
                  sx={{
                    borderBottom: '1px solid #DED9E7',
                    py: '15px',
                    display: 'flex',
                    alignItems: 'center',
                  }}>
                  <img src={calendarIcon} alt='image' />
                  <Typography
                    sx={{
                      color: '#7C7A80',
                      fontSize: '15px',
                      fontWeight: '600',
                      pl: '5px',
                    }}>
                    Today’s Clock-outs
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <Typography variant='h3' fontWeight='bold'>
                    {statistics.totalClockOutsToday}
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>

          {/* <Grid container spacing={2} alignItems="stretch">
            {userRoles.includes("vtadmin") ? (
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <StyledCard>
                  <CardActionArea component={Link} to="/user-management/new">
                    <CardContent>
                      <Typography variant="h6">
                        Invite Your Team Members!
                      </Typography>
                      <AlignedTypography
                        variant="body1"
                        gutterBottom
                        color="primary"
                      >
                        Add Users <Add sx={{ ml: 2 }} />
                      </AlignedTypography>
                      <AlignedTypography
                        variant="body1"
                        gutterBottom
                        color="primary"
                        alignContent="center"
                      >
                        <img
                          width="300"
                          src={`${process.env.PUBLIC_URL}/workers.jpg`}
                          alt="logo"
                        />
                      </AlignedTypography>
                    </CardContent>
                  </CardActionArea>
                </StyledCard>
              </Grid>
            ) : null}
            {userRoles && userRoles.includes("vtadmin") ? (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <StyledCard>
                  <CardActionArea component={Link} to="/projects/new">
                    <CardContent>
                      <AlignedTypography
                        variant="body1"
                        gutterBottom
                        color="primary"
                      >
                        Add Project <Add sx={{ ml: 2 }} />
                      </AlignedTypography>
                    </CardContent>
                  </CardActionArea>
                </StyledCard>
              </Grid>
            ) : null}
            {userRoles.includes("vtadmin") ||
            userRoles.includes("superintendent") ? (
              <>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <StyledCard>
                    <CardActionArea component={Link} to="/workers">
                      <CardContent>
                        <AlignedTypography
                          variant="body1"
                          gutterBottom
                          color="primary"
                        >
                          View Workers <Group sx={{ ml: 2 }} />
                        </AlignedTypography>
                      </CardContent>
                    </CardActionArea>
                  </StyledCard>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <StyledCard>
                    <CardActionArea onClick={kioskMode.setProjectFirst}>
                      <CardContent>
                        <AlignedTypography
                          variant="body1"
                          gutterBottom
                          color="secondary"
                        >
                          Timesheet Kiosk <ScreenshotMonitor sx={{ ml: 2 }} />
                        </AlignedTypography>
                      </CardContent>
                    </CardActionArea>
                  </StyledCard>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={3}>
                  <StyledCard>
                    <CardActionArea component={Link} to="/settings">
                      <CardContent>
                        <AlignedTypography
                          variant="body1"
                          gutterBottom
                          color="primary"
                        >
                          Settings <Settings sx={{ ml: 2 }} />
                        </AlignedTypography>
                      </CardContent>
                    </CardActionArea>
                  </StyledCard>
                </Grid>
              </>
            ) : null}
            {userRoles.includes("superintendent") && associatedProjectsData ? (
              <Grid item xs={12} sm={12} md={12} lg={6}>
                <StyledCard>
                  <CardContent>
                    <AlignedTypography
                      variant="body1"
                      gutterBottom
                      color="primary"
                    >
                      Start Daily Report For
                    </AlignedTypography>
                    {associatedProjectsData.map((project: any) => {
                      return (
                        <>
                          <Link
                            key={project._id}
                            to={`/projects/${project._id}/daily-reports/new`}
                          >
                            {project.projectName}
                          </Link>
                          <br />
                        </>
                      );
                    })}
                  </CardContent>
                </StyledCard>
              </Grid>
            ) : null}
            <Grid item xs={12} sm={6} md={4} lg={3}>
              <StyledCard>
                <CardContent>
                  <AlignedTypography
                    variant="body1"
                    gutterBottom
                    color="primary"
                  >
                    Your Location <MapRounded sx={{ ml: 2 }} />
                  </AlignedTypography>
                  <Typography component={"span"} variant="body2">
                    <GeoLocation />
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6">Today's Clock-ins</Typography>
                  <Typography variant="h3">
                    {statistics.totalClockInsToday}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6">Today's Clock-outs</Typography>
                  <Typography variant="h3">
                    {statistics.totalClockOutsToday}
                  </Typography>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid> */}
        </Box>
      )}
    </>
  )
}
