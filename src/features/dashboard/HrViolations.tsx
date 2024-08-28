import {
  Box,
  Button,
  Card,
  Grid,
  Typography,
  useTheme,
  IconButton,
  Input,
  TextField,
  FormControl,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material'
import dayjs, { Dayjs } from 'dayjs'
import { useEffect, useState } from 'react'
import { Close, ExpandMoreOutlined } from '@mui/icons-material'
import shiftIcon from '../../assets/icons/Dashboard/shift.svg'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import peopleIcon from '../../assets/icons/Dashboard/people.svg'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import {
  FilterIconDark,
  CalendarIcon,
  SearchIconSM,
} from '../../assets/icons/icons'
import { useGetProjectsAll } from '../projects/hooks'
import { useGetHrViolations } from './hooks'
import moment from 'moment'
import { Fetching } from '../../components/Fetching'
import { useNavigate } from 'react-router-dom'

const HrViolations = () => {
  const theme = useTheme()

  const navigate = useNavigate()

  // Use States
  const [isOpenFilterModal, setIsOpenFilterModal] = useState(false)

  // Calculate default start and end dates
  const today: Dayjs = dayjs()

  const Today: Dayjs = today

  const [tempSearch, setTempSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [startDate, setStartDate] = useState<Dayjs | null>(null)
  const [endDate, setEndDate] = useState<Dayjs | null>(null)
  const [selectedProjects, setSelectedProjects] = useState('')

  const [btnLoading, setBtnLoading] = useState(false)

  const [filterObj, setFilterObj] = useState<any>({})

  const { data: allProjects } = useGetProjectsAll('projects')

  const { data: hrViolations, isFetching: isFetchingHrViolations } =
    useGetHrViolations('hr-violations', filterObj)

  // Check if there is any filter
  const hasFilter = () => {
    return (
      selectedCategory != '' ||
      selectedProjects != '' ||
      startDate != null ||
      endDate != null
    )
  }

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory('')
    setSelectedProjects('')
    setBtnLoading(false)
    setStartDate(null)
    setEndDate(null)

    setFilterObj({
      startDate: startDate?.startOf('day')?.toDate().toISOString(),
      endDate: endDate?.endOf('day')?.toDate().toISOString(),
    })
    setIsOpenFilterModal(false)
  }

  // Handle Close Filter Modal
  const handleClose = () => {
    setIsOpenFilterModal(false)
  }

  // Handle Filter
  const handleFilter = () => {
    setBtnLoading(true)

    setFilterObj({
      projectId: selectedProjects,
      startDate: startDate?.startOf('day')?.toDate().toISOString(),
      endDate: endDate?.endOf('day')?.toDate().toISOString(),
    })

    setBtnLoading(false)
    setIsOpenFilterModal(false)
  }

  // HR Violations
  const getHrViolations = (questions: any) => {
    var mainText = ''
    questions?.map((question: any, index: number) => {
      let additionalText = ''
      if (['multipleChoice', 'Yes/No']?.includes(question?.questionType)) {
        if (
          question.questionId
            ?.questions![0]?.correctAnswer?.toString()
            ?.toLowerCase() !==
          (
            question?.answerText &&
            question?.answerText?.toLowerCase() === 'yes'
          ).toString()
        ) {
          additionalText =
            question?.question +
            `${!question?.question?.toString()?.endsWith('?') ? '? ' : ' '}` +
            `<span style="color: red">${question?.answerText}</span> \n`
        }
      }

      mainText += additionalText
    })

    return mainText
  }

  const filteredItems = hrViolations?.filter((item: any) => {
    const fullName = item?.user?.firstName + ' ' + item?.user?.lastName
    const hrViolationsText = getHrViolations(item?.clockOutAnswers)
    const searchLowerCase = tempSearch.toLowerCase()
    return (
      fullName.toLowerCase().includes(searchLowerCase) ||
      hrViolationsText.toLowerCase().includes(searchLowerCase)
    )
  })

  // Use Effects
  // useEffect(() => {
  //   setFilterObj({
  //     startDate: startDate?.startOf('day')?.toDate().toISOString(),
  //     endDate: endDate?.endOf('day')?.toDate().toISOString(),
  //   })
  // }, [])

  if (isFetchingHrViolations) {
    return <Fetching />
  }

  return (
    <>
      <Box sx={{ marginTop: 1, marginLeft: 5, marginRight: 5 }}>
        <Typography
          gutterBottom
          sx={{
            fontWeight: 'semibold',
            color: '#2B262C',
            fontSize: '2.5rem',
            fontFamily: 'Rza',
          }}>
          HR Violations
        </Typography>

        <Card
          sx={{
            padding: 1,
            boxShadow: 'none',
            border: '1px solid #EEEEEE',
            borderRadius: '8px',
            paddingInline: '20px',
            paddingTop: '15px',
            height: '68vh',
            width: '100%',
          }}>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              // justifyContent: "start",
              height: '10%',
            }}>
            <Box
              sx={{
                border: '2px solid #D7D4DE',
                padding: '0px 10px',
                borderRadius: '10px',
                alignItems: 'center',
                justifyContent: 'center',
                display: 'flex',
                mr: 2,
              }}>
              <SearchIconSM />
              <TextField
                id='standard-basic'
                label=''
                variant='standard'
                placeholder='Search...'
                value={tempSearch}
                onChange={(e: any) => setTempSearch(e.target.value)}
                sx={{
                  paddingLeft: 1,
                  border: 'none !important',
                  width: '30vw',
                  outline: 'none',
                  '& input': {
                    fontSize: '16px',
                  },
                  '& div::after, & div::before, div:hover:not(.Mui-disabled, .Mui-error):before':
                    {
                      borderBottom: '0px solid black',
                    },
                }}
              />
            </Box>
            <Button
              variant='contained'
              sx={{
                padding: theme.spacing(1, 2, 1, 2),
                borderRadius: '10px',
                textTransform: 'capitalize',
                width: 120,
                fontSize: '13px',
                backgroundColor: isOpenFilterModal ? 'white' : '#EEEEEE',
                boxShadow: 'none',
                color: '#5F5C5F',
                zIndex: isOpenFilterModal ? 88 : 1,
                '&:hover': {
                  boxShadow: 'none',
                  backgroundColor: isOpenFilterModal ? 'white' : '#EEEEEE',
                },
                position: 'relative',
              }}
              onClick={() => {
                setIsOpenFilterModal(true)
              }}>
              <FilterIconDark /> <Box sx={{ width: 10 }} /> Filter
              {/* {hasFilter() && (
                <Box
                  sx={{
                    backgroundColor: "#F0845D",
                    width: "8px",
                    height: "8px",
                    position: "absolute",
                    right: 28,
                    top: 11,
                    borderRadius: 99,
                  }}
                />
              )} */}
            </Button>

            {isOpenFilterModal && (
              <Box
                sx={{
                  backgroundColor: 'red',
                }}>
                <Box
                  sx={{
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    width: '100vw',
                    height: '100vh',
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: 79,
                  }}
                  onClick={() => {
                    setIsOpenFilterModal(false)
                    // handleClose();
                  }}
                />
                <Box
                  sx={{
                    ...style,
                    zIndex: 79,
                    width: 470,
                    maxHeight: '95vh',
                    overflow: 'scroll',
                    '::-webkit-scrollbar': {
                      display: 'none',
                    },
                  }}>
                  <Box
                    display='flex'
                    alignItems={'center'}
                    justifyContent={'space-between'}>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 2,
                      }}>
                      {hasFilter() && (
                        <>
                          <Typography
                            sx={{
                              fontSize: 14,
                              color: '#5A525B',
                              cursor: 'pointer',
                            }}
                            onClick={() => resetFilters()}>
                            Clear Filters
                          </Typography>
                        </>
                      )}
                    </Box>
                    <IconButton onClick={() => handleClose()}>
                      <Close
                        sx={{
                          fontSize: '28px',
                        }}
                      />
                    </IconButton>
                  </Box>
                  <Grid
                    container
                    sx={{
                      width: '100%',
                    }}
                    spacing={2}>
                    {/* <Grid item xs={12}>
                      <Typography
                        fontSize={"14px"}
                        color="#5A525B"
                        paddingBottom={0.5}
                        fontWeight="bold"
                      >
                        Category
                      </Typography>
                      <FormControl
                        sx={{
                          width: "100%",
                          fontSize: "13px",
                          color: "#ACB9B5",
                        }}
                      >
                        <Box
                          sx={{
                            backgroundColor: "white",
                            borderRadius: "8px",
                            border: "1px solid #DBDBDB",
                          }}
                          display={"flex"}
                          alignItems={"center"}
                          justifyContent={"center"}
                        >
                          <Select
                            id="demo-simple-select"
                            value={selectedCategory}
                            onChange={(e) => {
                              setSelectedCategory(e.target.value);
                            }}
                            IconComponent={ExpandMoreOutlined}
                            sx={{
                              width: "100%",
                              border: "none",
                              boxShadow: "none",
                              padding: theme.spacing(0.8, 1.6, 0.8, 1.6),
                              "& .MuiSelect-select": {
                                padding: theme.spacing(0.8, 0, 0.8, 0),
                              },
                              "&:hover, & fieldset, & fieldset:hover": {
                                border: "none",

                                margin: 0,
                                boxShadow: "none",
                              },
                            }}
                            displayEmpty
                          >
                            <MenuItem value="Gusto">Discrimination</MenuItem>
                          </Select>
                        </Box>
                      </FormControl>
                    </Grid> */}
                    <Grid item xs={6}>
                      <Typography
                        fontSize={'14px'}
                        color='#5A525B'
                        paddingBottom={0.5}
                        fontWeight='bold'>
                        Added Date
                      </Typography>

                      <Box
                        sx={{
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: '1px solid #DBDBDB',
                          padding: theme.spacing(0.8, 1.6, 0.8, 1.6),
                          zIndex: '88',
                        }}
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            value={startDate}
                            onChange={(e: any) => setStartDate(e)}
                            inputFormat='MMM DD, YYYY'
                            renderInput={(params: any) => {
                              return (
                                <TextField
                                  {...params}
                                  variant='standard'
                                  name='projectDueDate'
                                  label=''
                                  required
                                  value={
                                    startDate
                                      ? dayjs(startDate).format('MM/DD/YYYY')
                                      : ''
                                  }
                                  placeholder='Select  date'
                                  type={params.inputProps.type}
                                  onChange={params.inputProps.onChange}
                                  className={params.className}
                                  inputProps={{
                                    ...params,
                                    readOnly: true,
                                  }}
                                  onClick={(event: any) => {
                                    // @ts-ignore
                                    params.InputProps.endAdornment.props.children.props.onClick()
                                  }}
                                  InputProps={{
                                    ...params?.InputProps,
                                    endAdornment: null,

                                    startAdornment: (
                                      // @ts-ignore
                                      <IconButton
                                        {...params?.InputProps}
                                        onClick={event => {
                                          // @ts-ignore
                                          params?.InputProps?.endAdornment?.props?.children?.props?.onClick()
                                        }}>
                                        <CalendarIcon />
                                      </IconButton>
                                    ),
                                  }}
                                  sx={{
                                    width: '100%',

                                    '& .MuiInput-underline:before': {
                                      display: 'none',
                                    },
                                    '& .MuiInput-underline:hover:not(.Mui-disabled):before':
                                      {
                                        display: 'none',
                                      },
                                    '& .MuiInput-underline:after': {
                                      display: 'none',
                                    },
                                    '& .MuiInputBase-input': {
                                      color: '#5F5C5F',
                                      padding: 0,
                                    },
                                  }}
                                />
                              )
                            }}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography // Don't remove it
                        fontSize={'14px'}
                        color='#5A525B'
                        paddingBottom={0.5}
                        fontWeight='bold'
                        visibility='hidden'>
                        Date
                      </Typography>

                      <Box
                        sx={{
                          backgroundColor: 'white',
                          borderRadius: '8px',
                          border: '1px solid #DBDBDB',
                          padding: theme.spacing(0.8, 1.6, 0.8, 1.6),
                          zIndex: '88',
                        }}
                        display={'flex'}
                        alignItems={'center'}
                        justifyContent={'center'}>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                          <DatePicker
                            value={endDate}
                            onChange={(e: any) => setEndDate(e)}
                            inputFormat='MMM DD, YYYY'
                            minDate={startDate}
                            renderInput={(params: any) => {
                              return (
                                <TextField
                                  {...params}
                                  variant='standard'
                                  name='projectDueDate'
                                  label=''
                                  required
                                  value={
                                    endDate
                                      ? dayjs(endDate).format('MM/DD/YYYY')
                                      : ''
                                  }
                                  placeholder='Select  date'
                                  type={params.inputProps.type}
                                  onChange={params.inputProps.onChange}
                                  className={params.className}
                                  inputProps={{
                                    ...params,
                                    readOnly: true,
                                  }}
                                  onClick={(event: any) => {
                                    // @ts-ignore
                                    params.InputProps.endAdornment.props.children.props.onClick()
                                  }}
                                  InputProps={{
                                    ...params?.InputProps,
                                    endAdornment: null,

                                    startAdornment: (
                                      // @ts-ignore
                                      <IconButton
                                        {...params?.InputProps}
                                        onClick={event => {
                                          // @ts-ignore
                                          params?.InputProps?.endAdornment?.props?.children?.props?.onClick()
                                        }}>
                                        <CalendarIcon />
                                      </IconButton>
                                    ),
                                  }}
                                  sx={{
                                    width: '100%',

                                    '& .MuiInput-underline:before': {
                                      display: 'none',
                                    },
                                    '& .MuiInput-underline:hover:not(.Mui-disabled):before':
                                      {
                                        display: 'none',
                                      },
                                    '& .MuiInput-underline:after': {
                                      display: 'none',
                                    },
                                    '& .MuiInputBase-input': {
                                      color: '#5F5C5F',
                                      padding: 0,
                                    },
                                  }}
                                />
                              )
                            }}
                          />
                        </LocalizationProvider>
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography
                        fontSize={'14px'}
                        color='#5A525B'
                        paddingBottom={0.5}
                        fontWeight='bold'>
                        Project
                      </Typography>
                      <FormControl
                        sx={{
                          width: '100%',
                          fontSize: '13px',
                          color: '#ACB9B5',
                        }}>
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
                            id='demo-simple-select'
                            value={selectedProjects}
                            onChange={e => {
                              setSelectedProjects(e.target.value)
                            }}
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

                                margin: 0,
                                boxShadow: 'none',
                              },
                            }}
                            displayEmpty>
                            {/* <MenuItem value="" disabled>
                              Select project(s)
                            </MenuItem> */}
                            {allProjects?.map((item: any, index: number) => (
                              <MenuItem value={item?.id}>
                                {item?.projectName}
                              </MenuItem>
                            ))}
                          </Select>
                        </Box>
                      </FormControl>
                    </Grid>

                    <Grid item xs={12}>
                      <Button
                        variant='contained'
                        sx={{
                          borderRadius: '7px',
                          color: '#FFF',
                          background: '#F0845D',
                          textTransform: 'none',
                          py: 1.5,
                          width: '100%',
                          boxShadow: 'none',
                          ':hover': {
                            background: '#F0845D',
                            boxShadow: 'none',
                          },
                        }}
                        onClick={() => handleFilter()}>
                        {btnLoading ? (
                          <CircularProgress
                            sx={{ color: 'white', width: 20, height: 20 }}
                            size={22}
                          />
                        ) : (
                          'Filter'
                        )}
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}
          </Box>

          <Box
            sx={{
              overflowY: 'auto',
              height: '90%',
              mt: 2,
            }}>
            {filteredItems?.length === 0 ? (
              <Typography
                sx={{
                  color: '#7C7A80',
                  fontSize: '17px',
                  pl: '10px',
                }}>
                No results found
              </Typography>
            ) : (
              filteredItems?.map((item: any, index: number) => (
                <Box
                  sx={{
                    borderBottom: '1px solid #DED9E7',
                    py: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mr: 2,
                  }}>
                  <Box
                    sx={{
                      display: 'flex',
                    }}>
                    <img
                      src={shiftIcon}
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
                        whiteSpace: 'pre-wrap',
                      }}>
                      <span
                        style={{
                          textDecoration: 'underline',
                          cursor: 'pointer',
                        }}
                        onClick={() => navigate(`/workers/${item?.user?.id}`)}>
                        {item?.user?.firstName + ' ' + item?.user?.lastName}
                      </span>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: getHrViolations(item?.clockOutAnswers),
                        }}></div>
                    </Typography>
                  </Box>
                  <Box sx={{ width: '100%', maxWidth: '100px' }}>
                    <Typography
                      sx={{
                        color: '#7C7A80',
                        fontSize: '15px',
                        pl: '10px',
                        textAlign: 'right',
                        display: 'block',
                      }}>
                      {moment(item?.endTimeStamp).format('h:mm a')}
                    </Typography>
                  </Box>
                </Box>
              ))
            )}
          </Box>
        </Card>
      </Box>
    </>
  )
}

export default HrViolations
const style = {
  position: 'absolute' as 'absolute',
  top: 60,
  right: '50%',
  // top: "50%",
  // left: "50%",
  // transform: "translate(-50%, -50%)",
  bgcolor: 'background.paper',
  borderRadius: '7px',
  boxShadow: `
      0px 4px 10px 0px rgba(36, 33, 44, 0.05),
      0px 18px 18px 0px rgba(36, 33, 44, 0.04),
      0px 40px 24px 0px rgba(36, 33, 44, 0.03),
      0px 71px 29px 0px rgba(36, 33, 44, 0.03),
      0px 111px 31px 0px rgba(36, 33, 44, 0.00)
    `,
  pl: 3,
  pb: 3,

  overlay: {
    background: '#FFFF00',
  },
}
