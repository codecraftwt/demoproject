import { ExpandMoreOutlined } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  Card,
  Grid,
  IconButton,
  Input,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@mui/material'
import { useContext, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevBackIcon,
  EmailIcon,
  KioskCopyCodeIcon,
} from '../../assets/icons/icons'
import Project from '../../types/Project'
import { useGetProjectsAll } from '../projects/hooks'
import Stepper from './Stepper'
import { useMutateCreateKioskDevice } from './hooks'
import { Fetching } from '../../components/Fetching'
import SnackBarContext from '../../context/SnackBarContext'

const steps = ['Choose kiosk name', 'Activate Time Kiosk']
const SetupTimeKiosk = () => {
  // Use Ref
  const locationFieldRef: any = useRef()
  const snackBarMode = useContext(SnackBarContext)
  const { data: projects, isFetching: isFetchingProjects } =
    useGetProjectsAll('projects')
  const [project, setProject] = useState('')
  const [location, setLocation] = useState('')
  const { data, mutateAsync, isLoading, isError, error } =
    useMutateCreateKioskDevice('kiosk-devices')

  const handleChangeProject = (event: any) => {
    setProject(event.target.value as string)
    setLocation('')
  }

  // Theme
  const theme = useTheme()

  // Navigation
  const navigate = useNavigate()

  // Use States
  const [activeStep, setActiveStep] = useState(0)
  const [kioskName, setKioskName] = useState('')
  const [kioskError, setKioskError] = useState('')

  const [lat, setLat] = useState<any>(null)
  const [lng, setLng] = useState<any>(null)

  const [selectedOption, setSelectedOption] = useState(null)

  // Handle Next
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(prevActiveStep => prevActiveStep + 1)
    }
  }
  // Handle Back
  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(prevActiveStep => prevActiveStep - 1)
    }
  }

  // Location address change
  const onAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault()
    setLocation(event.target.value)
  }

  function generateCode(length = 8) {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let result = ''
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length)
      result += characters[randomIndex]
    }
    return result
  }

  const onSubmitKioskDevice = async (e: any) => {
    e.preventDefault()
    try {
      if ((kioskName).trim() === '') {
        setKioskError("Name should not be empty.")
        setKioskName("")
      } else {
        const kioskData = {
          name: kioskName,
          project: project,
          location: location,
          code: generateCode(),
        }
        await mutateAsync(kioskData)
        handleNext()
      }
    } catch (err) {
    } finally {
    }
  }

  if (isLoading) {
    return <Fetching />
  }

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(data?.code?.toString()?.toUpperCase())
      snackBarMode.toggleSnackbar('Code copied!', 'success')
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  return (
    <>
      <Box
        sx={{
          paddingInline: 3,
        }}>
        <IconButton
          sx={{
            background: '#24212C12',
            borderRadius: 1.8,
            padding: '6px 10px',
          }}
          onClick={() => navigate('/settings')}>
          <ChevBackIcon />{' '}
          <p
            style={{
              fontSize: 12,
              paddingTop: 0,
              paddingRight: 0,
              paddingBottom: 0,
              margin: 0,
              paddingLeft: 7,
            }}>
            Go Back
          </p>
        </IconButton>

        <Typography
          sx={{
            color: '#2B262C',
            fontSize: '36px',
            fontWeight: 600,
            fontFamily: 'Rza',
            mt: 1,
          }}>
          Set up a Time Kiosk
        </Typography>
        <Box display='flex'>
          <Grid container spacing={2} mt={1}>
            <Grid item md={8}>
              <Card
                sx={{
                  padding: 3,
                  boxShadow: 'none',
                  border: '1px solid #EEEEEE',
                  borderRadius: '10px',
                  gap: 2,
                }}>
                <Stepper steps={steps} activeStep={activeStep} />
                {(isError || kioskError) && (
                  <Alert sx={{ mt: 1 }} severity='error'>
                    {error ? error
                      ?.toString()
                      ?.replace('Error: Bad Response: ', '')
                      ?.toString() : kioskError ? kioskError : null}
                  </Alert>
                )}
                {activeStep <= 0 ? (
                  <form onSubmit={onSubmitKioskDevice}>
                    <Typography
                      fontSize={'14px'}
                      color='#2B262C'
                      paddingBottom={0.5}
                      fontWeight='bold'
                      mt={2}>
                      Select Project
                    </Typography>

                    <Box
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        border: '1px solid #DBDBDB',
                      }}
                      display={'flex'}
                      alignItems={'center'}
                      justifyContent={'center'}>
                      <Select
                        displayEmpty // This prop makes the first empty `MenuItem` visible as a placeholder
                        id='demo-simple-select'
                        value={project}
                        onChange={handleChangeProject}
                        IconComponent={ExpandMoreOutlined}
                        required
                        sx={{
                          width: '100%',
                          border: 'none',
                          boxShadow: 'none',
                          padding: theme.spacing(0.8, 1.6, 0.8, 1.6),
                          '& .MuiSelect-select': {
                            padding: theme.spacing(0.8, 0, 0.8, 0),
                          },
                          '&:hover, & fieldset, & fieldset:hover': {
                            border: 'none',
                            // padding: 0,
                            margin: 0,
                            boxShadow: 'none',
                          },
                        }}>
                        <MenuItem disabled value=''>
                          Select Project
                        </MenuItem>
                        {projects?.map((item: Project) => {
                          return (
                            <MenuItem
                              value={item.id.toString()}
                              sx={{ fontFamily: 'Buenos Aires' }}>
                              {item.projectName}
                            </MenuItem>
                          )
                        })}
                      </Select>
                    </Box>

                    <Typography
                      fontSize={'14px'}
                      color='#2B262C'
                      paddingBottom={0.5}
                      fontWeight='bold'
                      mt={2}>
                      Kiosk Name
                    </Typography>
                    <Typography
                      sx={{
                        color: '#7C7A80',
                        fontSize: '14px',
                        mb: 1,
                      }}>
                      Employees will see this name when using this kiosk.
                    </Typography>
                    <Box
                      sx={{
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        border: '1px solid #DBDBDB',
                        padding: theme.spacing(0.8, 1.6, 0.8, 1.6),
                      }}
                      display={'flex'}
                      alignItems={'center'}
                      justifyContent={'center'}>
                      <Input
                        disableUnderline
                        sx={{
                          width: '100%',
                          fontSize: '17px',
                          '& input::placeholder': {
                            fontSize: '15px',
                          },
                        }}
                        name={'kioskName'}
                        type='text'
                        placeholder='e.g. Main reception'
                        fullWidth={true}
                        onChange={e => setKioskName(e.target.value)}
                        value={kioskName}
                        required={true}
                        disabled={false}
                      />
                    </Box>

                    <Box>
                      <Typography
                        fontSize={'14px'}
                        color='#2B262C'
                        paddingBottom={0.5}
                        fontWeight='bold'
                        mt={2}>
                        Location
                      </Typography>

                      <Box
                        sx={{
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: '1px solid #DBDBDB',
                        }}
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}>
                        <Select
                          displayEmpty // This prop makes the first empty `MenuItem` visible as a placeholder
                          id='demo-simple-select'
                          required={true}
                          value={location}
                          onChange={e => setLocation(e.target.value)}
                          IconComponent={ExpandMoreOutlined}
                          sx={{
                            width: '100%',
                            border: 'none',
                            boxShadow: 'none',
                            padding: theme.spacing(0.8, 1.6, 0.8, 1.6),
                            '& .MuiSelect-select': {
                              padding: theme.spacing(0.8, 0, 0.8, 0),
                            },
                            '&:hover, & fieldset, & fieldset:hover': {
                              border: 'none',
                              // padding: 0,
                              margin: 0,
                              boxShadow: 'none',
                            },
                          }}>
                          <MenuItem disabled value=''>
                            Select Location
                          </MenuItem>
                          {(
                            projects?.find((item: any) => item?._id == project)
                              ?.locations || []
                          )?.map((item: any) => {
                            return (
                              <MenuItem
                                value={item?.address}
                                sx={{ fontFamily: 'Buenos Aires' }}>
                                {item?.address}
                              </MenuItem>
                            )
                          })}
                        </Select>
                      </Box>
                    </Box>

                    <Box
                      sx={{
                        mt: 4,
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                      }}>
                      <Button
                        variant='contained'
                        sx={{
                          color: '#24212C',
                          background: '#DCDAE1',
                          fontSize: '13px',
                          textTransform: 'none',
                          py: 1.8,
                          width: '22%',
                          boxShadow: 'none',
                          ':hover': {
                            background: '#DCDAE1',
                          },
                          borderRadius: 1.8,
                          mr: 3,
                        }}
                        onClick={
                          activeStep <= 0
                            ? () => navigate('/settings')
                            : handleBack
                        }>
                        Cancel
                      </Button>
                      <Button
                        variant='contained'
                        sx={{
                          color: '#FFF',
                          background: '#F0845D',
                          fontSize: '13px',
                          textTransform: 'none',
                          py: 1.8,
                          width: '73%',
                          boxShadow: 'none',
                          ':hover': {
                            background: '#F0845D',
                          },
                          borderRadius: 1.8,
                        }}
                        type='submit'>
                        Activate and Finish
                      </Button>
                    </Box>
                  </form>
                ) : (
                  <Box>
                    <Typography
                      sx={{
                        color: '#7C7A80',
                        fontSize: '14px',
                        mt: 3,
                        fontWeight: '550',
                        borderBottom: '1px solid #DBDBDB',
                        pb: 2.5,
                      }}>
                      Download the Bynaus Kiosk App and enter the code displayed
                      on the screen.
                    </Typography>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        mt: 3,
                        gap: 1,
                        justifyContent: 'space-between',
                      }}>
                      <Box
                        sx={{
                          alignItems: 'center',
                          display: 'flex',
                        }}>
                        <Box
                          sx={{
                            borderRadius: '8px',
                            padding: 1,
                            letterSpacing: '1px',
                            border: '1px solid #DBDBDB',
                            marginRight: 1.5,
                          }}>
                          <Typography
                            sx={{
                              color: '#24212C',
                              fontSize: '22px',
                              px: 1,
                            }}>
                            {(data?.code || '')?.toString()?.toUpperCase()}
                          </Typography>
                        </Box>
                        <Typography
                          sx={{
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            padding: '10px',
                            borderRadius: '10px', 
                            "&:hover": {
                              backgroundColor: "#f0f0f0", 
                            },
                          }}
                          onClick={handleCopyCode}>
                          <KioskCopyCodeIcon />
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <a
                          style={{ textDecoration: 'none' }}
                          href={`mailto:?subject=Kiosk Mode Code&body=Dear Recipient,%0D%0A%0D%0AHere is the kiosk mode code for your device: ${data?.code
                            ?.toString()
                            ?.toUpperCase()}.%0D%0A%0D%0AName: ${kioskName}%0D%0ALocation: ${location} %0D%0A%0D%0APlease use this code to access the kiosk device. Let us know if you encounter any issues.%0D%0A%0D%0AThank you,%0D%0ABynaus`}>
                          <Button
                            variant='contained'
                            sx={{
                              color: 'rgba(95, 92, 95, 1)',
                              background: 'rgba(238, 238, 238, 1)',
                              fontSize: '13px',
                              textTransform: 'none',
                              py: 1.1,
                              boxShadow: 'none',
                              ':hover': {
                                boxShadow: 'none',
                                background: 'rgba(238, 238, 238, 1)',
                              },
                              borderRadius: 1.8,
                              alignItems: 'center',
                              justifyContent: 'center',
                              display: 'flex',
                            }}
                            onClick={() => { }}>
                            <Box
                              sx={{
                                paddingTop: 0.6,
                                paddingRight: 1,
                              }}>
                              <EmailIcon />
                            </Box>
                            Send to email
                          </Button>
                        </a>
                        {/* <Button
                          variant='contained'
                          sx={{
                            marginLeft: 2,
                            color: 'rgba(95, 92, 95, 1)',
                            background: 'rgba(238, 238, 238, 1)',
                            fontSize: '13px',
                            textTransform: 'none',
                            py: 1.1,
                            boxShadow: 'none',
                            ':hover': {
                              boxShadow: 'none',
                              background: 'rgba(238, 238, 238, 1)',
                            },
                            borderRadius: 1.8,
                            alignItems: 'center',
                            justifyContent: 'center',
                            display: 'flex',
                          }}
                          onClick={() => {}}>
                          <Box
                            sx={{
                              paddingTop: 0.6,
                              paddingRight: 1,
                            }}>
                            <MessageIcon />
                          </Box>
                          Send via text message
                        </Button> */}
                      </Box>
                    </Box>
                  </Box>
                )}
              </Card>
            </Grid>

            <Grid item md={4}>
              <Card
                sx={{
                  padding: 3,
                  boxShadow: 'none',
                  border: '1px solid #EEEEEE',
                  borderRadius: '10px',
                  gap: 2,
                  height: activeStep <= 0 ? '100%' : 'auto',
                }}>
                <Box>
                  <Typography
                    sx={{
                      color: '#2B262C',
                      fontSize: '20px',
                      fontWeight: 600,
                      fontFamily: 'Rza',
                    }}>
                    How it works?
                  </Typography>
                  <Typography
                    sx={{
                      color: '#7C7A80',
                      fontSize: '14px',
                      mt: 1.5,
                    }}>
                    This setup does not need to be done on the kiosk device
                    itself. The name will help you identify the kiosk and it
                    will appear:
                  </Typography>

                  <ul style={{ paddingLeft: '20px', marginBlock: '5px' }}>
                    {[
                      'On the kiosk device',
                      'On employee timesheets as the clock in/out location',
                      'In your list of kiosks',
                    ]?.map(item => (
                      <li style={{ color: '#7C7A80', fontSize: '14px' }}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Box>
                {activeStep == 0 && (
                  <>
                    <Typography
                      sx={{
                        color: '#2B262C',
                        fontSize: '20px',
                        fontWeight: 600,
                        fontFamily: 'Rza',
                        borderTop: '1px solid #DBDBDB',
                        pt: 3,
                        mt: 3,
                      }}>
                      {' '}
                      Naming tips{' '}
                    </Typography>

                    <ul style={{ paddingLeft: '20px', marginBlock: '5px' }}>
                      {[
                        'If you have multiple kiosks, use a different name for each to help distinguish them.',
                        'Including the physical location can help with identifying a kiosk.',
                      ]?.map(item => (
                        <li style={{ color: '#7C7A80', fontSize: '14px' }}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default SetupTimeKiosk
