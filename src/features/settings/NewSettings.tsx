import {
  Box,
  Button,
  Card,
  CircularProgress,
  FormControl,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import {
  useGetKioskDevices,
  useGetSettingsByUserId,
  useGetTimezones,
  useMutateDeleteKioskDevice,
  useMutateSettings,
} from './hooks'
import { useContext, useEffect, useState } from 'react'
import SnackBarContext from '../../context/SnackBarContext'
import { useNavigate } from 'react-router-dom'
import {
  PlusIcon,
  SettingRemoveIcon,
  SettingVisibleIcon,
  SettingVisibleOffIcon,
  SettingsCopyIcon,
  SettingsLocationIcon,
} from '../../assets/icons/icons'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import HrQuestionsTable from '../Adminquestion/HrQuestionTable'
import SelectTagsComponent from '../projects/uploads/SelectTagsComponent'
import { useAuth0 } from '@auth0/auth0-react'
import { Fetching } from '../../components/Fetching'
import DeleteModal from '../../components/DeleteModal'
import { formattedDate } from '../../lib/time'

export const NewSettings = () => {
  // Navigation
  const navigate = useNavigate()

  //user role
  const [authUser, setAuthUser] = useState<any | undefined>(null)
  const { isLoading, isAuthenticated, user } = useAuth0()
  const [userRoles, setUserRoles] = useState<any[]>([])
  const {
    data: kioskDevices,
    refetch,
    isFetching: isFetchingDevices,
  } = useGetKioskDevices('kiosk-devices')
  // Context
  const snackBarMode = useContext(SnackBarContext)

  // APIs
  const { data: timezones } = useGetTimezones()
  const { data: setting } = useGetSettingsByUserId('setting')
  const { mutate } = useMutateSettings('settings', 123)
  const { mutate: deleteKioskDevice, isLoading: isDeletingDevice } =
    useMutateDeleteKioskDevice('kiosk-devices')

  // Form state
  const [formData, setFormData] = useState({
    timeZone: '',
    hrViolationNotifyEmails: null,
  })

  const [visibleRows, setVisibleRows] = useState<any>([])
  const [violationNotifyEmail, setViolationNotifyEmail] = useState<string[]>([]);
  const [btnLoading, setBtnLoading] = useState(false)
  const [loading, setLoading] = useState<boolean>(true);

  // Effect to initialize form data with fetched settings
  useEffect(() => {
    if (setting) {
      setFormData({
        timeZone: setting.timeZone,
        hrViolationNotifyEmails: setting.hrViolationNotifyEmails || [],
      })
      setViolationNotifyEmail(setting.hrViolationNotifyEmails)
      setLoading(false);
    }
  }, [setting, timezones])

  // Handle form field changes
  const onDataEntry = (event: any) => {
    const { name, value } = event.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  // Handle form submission
  const handleSave = async (event: any) => {
    event.preventDefault()
    setBtnLoading(true)

    // Clean up email list
    const cleanedEmails = (formData.hrViolationNotifyEmails || [])
      ?.map((email: any) => email?.trim())
      .filter((email: any) => email !== '')

    try {
      await mutate({
        ...formData,
        hrViolationNotifyEmails: cleanedEmails,
      })
      snackBarMode.toggleSnackbar('Settings Updated!', 'success')
    } catch (error) {
      snackBarMode.toggleSnackbar('Failed to update settings.', 'error')
      console.error('Save failed:', error)
    }

    setBtnLoading(false)
  }

  useEffect(() => {
    if (user) {
      setAuthUser(user)
      setUserRoles(user[`${process.env.REACT_APP_WEB_URL}/roles`])
    }
  }, [user])

  const deleteItem = async (id: any) => {
    deleteKioskDevice(id, {
      onSuccess: () => {
        refetch()
      },
    })
  }

  return (
    <>
      <Box sx={{ marginTop: 1, marginLeft: 2, marginRight: 2 }}>
        <Box
          marginBottom={3}
          alignItems={'center'}
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'space-between'}>
          <Typography variant='h4'>Settings</Typography>
        </Box>

        <Card
          sx={{
            padding: 4,
            boxShadow: 'none',
            border: '1px solid #EEEEEE',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'space-between',
            gap: 2,
          }}>
          <Grid container spacing={2}>
            <Grid item md={4}>
              <FormControl sx={{ width: '100%' }}>
                <Typography
                  sx={{
                    color: '#5F5C5F',
                    fontSize: '16px',
                  }}>
                  Timezone
                </Typography>
                <Select
                  id='timeZone'
                  name='timeZone'
                  displayEmpty
                  value={formData.timeZone}
                  onChange={onDataEntry}
                  sx={{
                    borderRadius: '8px',
                    padding: '2px 10px',
                    '& .MuiSelect-select': {
                      paddingTop: '8px',
                      paddingBottom: '8px',
                    },
                    border: '1px solid #ccc',
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: 'transparent',
                    },
                  }}>
                  {timezones?.map((timeZone: any) =>
                    timeZone?.show ? (
                      <MenuItem key={timeZone?.tz} value={timeZone?.tz}>
                        {timeZone?.tz}
                      </MenuItem>
                    ) : null
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item md={4}>
              <Typography style={{ color: '#5F5C5F', fontSize: '16px' }}>
                HR Violation Notify Email(s)
              </Typography>
              {violationNotifyEmail.length == 0 &&
              <SelectTagsComponent
                  tags={violationNotifyEmail}
                  setTags={(emails: any) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      hrViolationNotifyEmails: emails,
                    }))
                  }
                />}
              {!loading && (
                <SelectTagsComponent
                  tags={violationNotifyEmail}
                  setTags={(emails:any) =>
                    setFormData((prev: any) => ({
                      ...prev,
                      hrViolationNotifyEmails: emails,
                    }))
                  }
                />
              )}
            </Grid>
            <Grid item md={4}>
              <Button
                variant='contained'
                sx={{
                  color: '#FFF',
                  mt: 3,
                  background: '#F0845D',
                  fontSize: '12px',
                  textTransform: 'none',
                  py: 1.5,
                  borderRadius: '8px',
                  width: '100%',
                  boxShadow: 'none',
                  ':hover': {
                    background: '#F0845D',
                    boxShadow: '1px',
                  },
                }}
                onClick={handleSave}>
                {btnLoading ? (
                  <CircularProgress
                    sx={{ color: 'white', width: 20, height: 20 }}
                    size={22}
                  />
                ) : (
                  'Save'
                )}
              </Button>
            </Grid>
          </Grid>
        </Card>

        <Card
          sx={{
            mt: 4,
            padding: 4,
            boxShadow: 'none',
            border: '1px solid #EEEEEE',
            borderRadius: '10px',
          }}>
          {isFetchingDevices || isDeletingDevice ? (
            <Fetching />
          ) : (
            <Box>
              <Typography
                sx={{
                  color: '#2B262C',
                  fontSize: '20px',
                  fontWeight: 'semibold',
                }}>
                Kiosks View Access
              </Typography>
              <Typography
                sx={{
                  color: '#2B262C',
                  fontSize: '15px',
                  mt: 2,
                }}>
                Accessing Time Kiosk on an Activated Device
              </Typography>

              <Box
                sx={{
                  overflowX: 'auto', // Enable horizontal scrolling
                  mt: 2,
                }}
              >
              <Table
                sx={{
                  minWidth: 650,
                  boxShadow: 'none',
                  borderCollapse: 'separate', 
                  borderSpacing: '0px',
                }}
                aria-label="simple table"
              >
                <TableHead>
                  <TableRow
                    sx={{
                      color: '#5F5C5F',
                      '& th': {
                        backgroundColor: '#DCDAE1',
                        padding: '12px 10px',
                        color: '#5F5C5F',
                        fontWeight: 500,
                        whiteSpace: 'nowrap',
                        borderBottom: 'none',
                      },
                      '& th:first-child': {
                        borderRadius: '8px 0px 0px 8px',
                      },
                      '& th:last-child': {
                        borderRadius: '0px 8px 8px 0px',
                      },
                    }}>
                    <TableCell>NAME</TableCell>
                    <TableCell>LOCATION</TableCell>
                    <TableCell>CODE</TableCell>
                    <TableCell>CREATED ON</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody
                  sx={{
                    '& td': {
                      backgroundColor: 'white',
                      color: '#5F5C5F',
                      fontWeight: 400,
                      whiteSpace: 'nowrap',
                      padding: '15px 10px',
                      fontSize: 14,
                    },
                    '& td:first-child': {
                      borderRadius: '8px 0px 0px 10px',
                    },
                    '& td:last-child': {
                      borderRadius: '0px 8px 10px 0px',
                    },
                  }}>
                  {kioskDevices?.length === 0 && (
                    <TableRow
                      sx={{
                        cursor: 'pointer',
                        '& td, & th': {
                          border: 0,
                          background: 'white',
                          padding: '15px 10px',
                        },
                        '& *': {
                          color: '#5F5C5F',
                        },
                      }}>
                      <TableCell colSpan={5} sx={{ textAlign: 'center' }}>
                        No Kiosk Devices
                      </TableCell>
                    </TableRow>
                  )}
                  {kioskDevices?.map((row: any, index: any) => ( 
                    <>
                    <TableRow
                        key={index}
                        sx={{
                          cursor: 'pointer',
                          '& td, & th': {
                            border: 0,
                            background: index % 2 == 0 ? 'white' : '#F1EFF5',
                            padding: '15px 10px',
                          },
                          '& *': {
                            color: '#5F5C5F',
                          },
                        }}>
                        <TableCell>{row?.name}</TableCell>
                        <TableCell>{row?.location}</TableCell>
                        <TableCell
                          key={row?.id}
                          sx={{
                            display: 'flex',
                            justifyContent: 'start',
                            alignItems: 'center',
                          }}>
                          <Typography
                            variant='body2'
                            sx={{ fontFamily: 'monospace', marginRight: 1 }}>
                            {visibleRows?.includes(index)
                              ? row?.code?.toString()?.toUpperCase()
                              : '••••••••'}
                          </Typography>
                          <IconButton
                            onClick={() => {
                              setVisibleRows((prev: any) => {
                                if (prev?.includes(index)) {
                                  return prev?.filter((i: any) => i !== index)
                                } else {
                                  return [...prev, index]
                                }
                              })
                            }}>
                            {visibleRows?.includes(index) ? (
                              <SettingVisibleOffIcon />
                            ) : (
                              <SettingVisibleIcon />
                            )}
                          </IconButton>
                        </TableCell>
                        <TableCell>{formattedDate(row?.createdAt)}</TableCell>
                        <TableCell>
                          <SettingMenu
                            deleteItem={deleteItem}
                            row={row}
                            snackBarMode={snackBarMode}
                          />
                        </TableCell>
                      </TableRow>
                    </>
                  ))}
                </TableBody>
              </Table>
              </Box>
              <Button
                variant='contained'
                sx={{
                  mt: 2,
                  color: '#FFF',
                  background: '#F0845D',
                  fontSize: '12px',
                  textTransform: 'none',
                  py: 1.9,
                  borderRadius: '8px',
                  width: '100%',
                  boxShadow: 'none',
                  ':hover': {
                    background: '#F0845D',
                    boxShadow: '1px',
                  },
                }}
                onClick={() => navigate('/setup-time-kiosk')}>
                <PlusIcon /> <Box sx={{ width: 10 }} /> Add Kiosk
              </Button>
            </Box>
          )}
        </Card>
        {!userRoles.includes('worker') && (
          <Card
            sx={{
              mt: 4,
              padding: 4,
              boxShadow: 'none',
              border: '1px solid #EEEEEE',
              borderRadius: '10px',
            }}>
            <HrQuestionsTable />
          </Card>
        )}
      </Box>
    </>
  )
}

const SettingMenu = ({ row, snackBarMode, deleteItem }: any) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const open = Boolean(anchorEl)
  const navigate = useNavigate()

  // Handle Close
  const handleClose = () => {
    setAnchorEl(null)
  }

  // Handle Copy Code
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(row?.code?.toString()?.toUpperCase())
      handleClose()
      snackBarMode.toggleSnackbar('Code copied!', 'success')
    } catch (err) {
      handleClose()
      console.error('Failed to copy: ', err)
    }
  }

  const [opens, setOpens] = useState(false);
  const handleOpenModal = () => {
    handleClose()
    setOpens(true)
  }
  const handleDelete = async () => {
      try {
        await deleteItem(row?._id)
        handleClose()
      } catch (error) {
      } finally {
        setOpens(false)
      }
    }

  return (
    <>
      <Box
        sx={{
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
          display: 'flex',
          paddingLeft: 3,
          cursor: 'pointer',
        }}>
        <IconButton
          sx={{ width: 35, height: 35 }}
          onClick={(event: any) => {
            setAnchorEl(event.currentTarget)
          }}>
          <svg
            width='5'
            height='17'
            viewBox='0 0 5 17'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <path
              d='M2.16683 0.167969C1.59219 0.167969 1.04109 0.396242 0.634765 0.802571C0.228436 1.2089 0.000162532 1.76 0.000162507 2.33464C0.000162482 2.90927 0.228436 3.46037 0.634765 3.8667C1.04109 4.27303 1.59219 4.5013 2.16683 4.5013C2.74146 4.5013 3.29256 4.27303 3.69889 3.8667C4.10522 3.46037 4.3335 2.90927 4.3335 2.33464C4.3335 1.76 4.10522 1.2089 3.69889 0.802571C3.29256 0.396242 2.74147 0.167969 2.16683 0.167969Z'
              fill='#A5A2A5'
            />
            <path
              d='M2.16683 6C1.59219 6 1.04109 6.22827 0.634765 6.6346C0.228436 7.04093 0.000162532 7.59203 0.000162507 8.16667C0.000162482 8.7413 0.228436 9.2924 0.634765 9.69873C1.04109 10.1051 1.59219 10.3333 2.16683 10.3333C2.74146 10.3333 3.29256 10.1051 3.69889 9.69873C4.10522 9.2924 4.3335 8.7413 4.3335 8.16667C4.3335 7.59203 4.10522 7.04093 3.69889 6.6346C3.29256 6.22827 2.74147 6 2.16683 6Z'
              fill='#A5A2A5'
            />
            <path
              d='M2.16683 11.8359C1.59219 11.8359 1.04109 12.0642 0.634765 12.4705C0.228436 12.8769 0.000162532 13.428 0.000162507 14.0026C0.000162482 14.5772 0.228436 15.1283 0.634765 15.5347C1.04109 15.941 1.59219 16.1693 2.16683 16.1693C2.74146 16.1693 3.29256 15.941 3.69889 15.5347C4.10522 15.1283 4.3335 14.5772 4.3335 14.0026C4.3335 13.428 4.10522 12.8769 3.69889 12.4705C3.29256 12.0642 2.74147 11.8359 2.16683 11.8359Z'
              fill='#A5A2A5'
            />
          </svg>
        </IconButton>
      </Box>

      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        PaperProps={{
          style: {
            borderRadius: 8,
            boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px',
          },
        }}>
        <MenuItem
          onClick={handleCopyCode}
          sx={{
            gap: 1,
            py: 1,
            fontSize: '14px',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '5%',
              width: '90%',
              borderBottom: '1px solid #DEE2E0',
            },
          }}>
          <SettingsCopyIcon /> Copy Code
        </MenuItem>

        {/* <MenuItem
          onClick={e => {
            handleClose()
          }}
          sx={{
            gap: 1,
            py: 1,
            fontSize: '14px',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '5%',
              width: '90%',
              borderBottom: '1px solid #DEE2E0',
            },
          }}>
          <SettingsLocationIcon /> Edit Location
        </MenuItem> */}

        <MenuItem
          onClick={e => {
            handleOpenModal()
          }}
          sx={{
            gap: 1,
            py: 1,
            fontSize: '14px',
            '&:hover': {
              backgroundColor: '#f0f0f0',
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: '5%',
              width: '90%',
            },
          }}>
          <SettingRemoveIcon /> Remove
        </MenuItem>
      </Menu>
      <DeleteModal
        open={opens}
        setOpen={setOpens}
        deleteAction={handleDelete}
        message = 'Are you sure you want to delete the time Kiosk on an activated device ?'
      />
    </>
  )
}

