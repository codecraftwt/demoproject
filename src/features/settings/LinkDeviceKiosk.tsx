import { Box, Card, Grid, Typography } from '@mui/material'
import { KioskCopyCodeIcon, KioskScreenLogo } from '../../assets/icons/icons'
import { useContext, useEffect, useState } from 'react'
import SnackBarContext from '../../context/SnackBarContext'
// @ts-ignore
import Lottie from 'react-lottie'
import successAnimation from '../../assets/lotties/success_lottie.json'
import { useNavigate } from 'react-router-dom'

import KioskSideBanner from '../../assets/icons/kiosk-side-banner.svg'
import moment from 'moment'

const LinkDeviceKiosk = () => {
  // Context
  const snackBarMode = useContext(SnackBarContext)

  // Navigation
  const navigate = useNavigate()

  // Use States
  const [code, setCode] = useState('R90SLISW')
  const [isLottie, setIsLottie] = useState(false)
  const [time, setTime] = useState(moment().format('hh:mm'))
  const [date, setDate] = useState(moment().format('ddd MMM DD'))

  // Handle Copy Code
  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(code)

      snackBarMode.toggleSnackbar('Code copied!', 'success')
      setTimeout(() => {
        setIsLottie(true)
      }, 1000)

      setTimeout(() => {
        setIsLottie(false)
        navigate('/ready-to-use-kiosk')
      }, 3000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(moment().format('hh:mm:a'))
      setDate(moment().format('ddd MMM DD'))
    }, 1000) // Update time every second

    return () => clearInterval(timer) // Cleanup the interval on component unmount
  }, [])

  // Lottie
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: successAnimation,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  }
  return (
    <Box sx={{}}>
      {isLottie ? (
        <Box
          sx={{
            minHeight: '70vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Lottie options={defaultOptions} height={400} width={400} />
        </Box>
      ) : (
        <Grid container sx={{ height: '100%' }}>
          <Grid
            item
            md={6}
            sx={{
              position: 'relative',
              padding: '25px 0',
            }}>
            <Box
              sx={{
                ml: 12,
              }}>
              <KioskScreenLogo />
            </Box>
            <Box
              sx={{
                position: 'absolute',
                top: '30%',
                left: '10%',
                width: '60%',
              }}>
              <Typography
                sx={{
                  fontSize: '2rem',
                  color: '#24212C',
                  fontWeight: '600',
                  fontFamily: 'Rza',
                }}>
                Link this device to your Time Kiosk
              </Typography>

              <Typography
                sx={{
                  color: '#8C8A90',
                  fontSize: '14px',
                  borderBottom: '1px solid #DBDBDB',
                  pb: 1,
                }}>
                Go to your Bynaus account and enter the code below to link this
                device to your kiosk.
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mt: 4,
                  gap: 1,
                }}>
                <Box
                  sx={{
                    borderRadius: '8px',
                    padding: 1,
                    letterSpacing: '1px',
                    border: '1px solid #DBDBDB',
                  }}>
                  <Typography
                    sx={{
                      color: '#24212C',
                      fontSize: '22px',
                    }}>
                    {code}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    cursor: 'pointer',
                  }}
                  onClick={handleCopyCode}>
                  <KioskCopyCodeIcon />
                </Typography>
              </Box>

              <Typography
                sx={{
                  color: '#8C8A90',
                  fontSize: '14px',
                  mt: 1,
                }}>
                Stay on this screen while you confirm the activation code on
                your Admin account.
              </Typography>
            </Box>
          </Grid>
          <Grid
            item
            md={6}
            sx={{
              height: '100vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              position: 'relative',
            }}>
            <img
              src={KioskSideBanner}
              alt='banner'
              style={{
                height: '100%',
              }}
            />

            <Box
              sx={{
                position: 'absolute',
                bottom: 20,
                right: '6rem',
              }}>
              <Typography
                sx={{
                  color: '#24212C',
                  fontSize: '28px',
                  fontWeight: 500,
                  fontFamily: 'Rza',
                }}>
                {date}
              </Typography>
              <Typography
                sx={{
                  color: '#24212C',
                  fontSize: '3rem',
                  fontWeight: 600,
                  fontFamily: 'Rza',
                }}>
                {time}{' '}
                <span
                  style={{
                    color: '#24212C',
                    fontFamily: 'Rza',
                    fontSize: '28px',
                    fontWeight: 500,
                  }}></span>
              </Typography>
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  )
}

export default LinkDeviceKiosk
