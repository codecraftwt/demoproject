import { useAuth0 } from '@auth0/auth0-react'
import { CameraFront } from '@mui/icons-material'
import {
  Alert,
  Box,
  Button,
  CardContent,
  Container,
  Grid,
  IconButton,
  Typography,
} from '@mui/material'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { Fetching } from '../../components/Fetching'
import { BackButton } from '../../components/navigation/BackButton'
import { StyledCard } from '../../components/StyledCard'
import { useSessionStorage } from '../../hooks/useSessionStorage'
import { UserFormNew } from '../user/UserFormNew'
import { useGetUserAccount, useMutateUser } from '../userManagement/hooks'
import { WebcamComponent } from '../video/Webcam'
import { useGetInfo } from './hooks'
import { ChevBackIcon } from '../../assets/icons/icons'
import SnackBarContext from '../../context/SnackBarContext'

const Profile = () => {
  const { user } = useAuth0()
  const navigate = useNavigate()
  const { data: _ } = useGetInfo('profile', user?.sub)
  const { data: userData, isFetching } = useGetUserAccount('user', _?.id)
  const [showWebcam, setShowWebcam] = useState<boolean>(false)
  const [userPhotoRaw, setUserPhotoRaw] = useState<any | undefined>(null)
  const [sessionUser] = useSessionStorage('user', {})
  const [errorUpdatingUser, setErrorUpdatingUser] = useState<boolean>(false)
  const [errorFeedback, setErrorFeedback] = useState<string | undefined>('')
  const { mutateAsync: updateUserAsync, isLoading: isUpdatingUser } =
    useMutateUser('user')
  const { toggleSnackbar } = useContext(SnackBarContext)

  const onImageCaptureHandler = (image: File) => {
    setUserPhotoRaw(image)
  }

  const onSaveHandler = async (user: any) => {
    const formData = new FormData()

    // Append the file if there's a new photo
    if (userPhotoRaw instanceof File) {
      formData.append('file', userPhotoRaw, `${uuidv4()}.jpeg`)
    } else if (userPhotoRaw) {
      // If userPhotoRaw is not a File object but contains image data, convert it to a File
      const blob = await fetch(userPhotoRaw).then(r => r.blob())
      const file = new File([blob], `${uuidv4()}.jpeg`, { type: 'image/jpeg' })
      formData.append('file', file)
    }

    let updatedUser: any = {
      firstName: user.firstName,
      lastName: user.lastName,
      idNumber: user.idNumber,
      type: user.type,
      _id: userData?._id,
      org_id: sessionUser?.accountId?.organizationId,
      companyId: sessionUser?.accountId?.id,
    }
    if (user.email) {
      updatedUser.email = user.email
    }

    // Append the JSON data
    formData.append('workerData', JSON.stringify(updatedUser))
    try {
      await updateUserAsync(formData)
      // navigate('/user-management')
      toggleSnackbar('Profile has been updated!', 'success')
      setErrorUpdatingUser(false)
      setErrorFeedback('')
    } catch (error: any) {
      console.log('🚀 ~ onSaveHandler ~ error:', error)
      setErrorUpdatingUser(true)
      setErrorFeedback(error.message)
    }
  }

  return (
    <Box sx={{ marginTop: 1, marginLeft: 2, marginRight: 2 }}>
      <IconButton
        sx={{
          background: '#24212C12',
          borderRadius: 1.8,
          padding: '6px 10px',
          marginLeft: '10px',
        }}
        onClick={() => navigate(-1)}>
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
      <CardContent>
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            sm={12}
            md={4}
            lg={6}
            sx={{ order: { xs: 2, md: 1 } }}>
            {errorUpdatingUser && (
              <Alert severity='error' sx={{ mt: 1, mb: 1 }}>
                Could not update user: {errorFeedback}
              </Alert>
            )}
            {userData && !isFetching && !isUpdatingUser ? (
              <UserFormNew
                saveUser={onSaveHandler}
                id={userData?.id}
                userData={userData}
                disabled={false}
                userPhotoRaw={userPhotoRaw || userData.idPhoto}
              />
            ) : (
              <Fetching />
            )}
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            sx={{
              alignContent: 'center',
              alignItems: 'center',
              order: { xs: 1, md: 2 },
            }}>
            {!showWebcam && userData && userData.hasOwnProperty('idPhoto') ? (
              <>
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      marginTop: 10 + 'px',
                    }}>
                    <img src={userData.idPhoto} alt='user face' />
                    <Button
                      sx={{ mt: 3 }}
                      onClick={() => setShowWebcam(true)}
                      variant='contained'>
                      Update Photo <CameraFront sx={{ ml: 2 }} />
                    </Button>
                  </Box>
                </Grid>
              </>
            ) : (
              <WebcamComponent onImageCapture={onImageCaptureHandler} />
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Box>
  )
}

export default Profile
