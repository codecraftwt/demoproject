import React from 'react'
import {
  Grid,
  CssBaseline,
  Paper,
  Box,
  Avatar,
  Typography,
} from '@mui/material'
import { Outlet } from 'react-router-dom'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Copyright } from '../features/auth/Copyright'

export const PublicLayout = () => {
  return (
    <>
      <Grid container component='main' sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/loginpicture.jpg)`,
            backgroundRepeat: 'no-repeat',
            backgroundColor: t =>
              t.palette.mode === 'light'
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            height: '100vh',
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
        <Box
            sx={{
              my: 1,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
            <Typography variant='body1'>
              <img src={`${process.env.PUBLIC_URL}/logo.png`} alt='logo' />
            </Typography>
            <Typography component='h1' variant='h5' gutterBottom>
              Welcome!
            </Typography>
            <Typography variant='body1'>
              <img
                width='300'
                src={`${process.env.PUBLIC_URL}/workers.jpg`}
                alt='logo'
              />
            </Typography>
            <Box sx={{ mt: 1, width: '100%', justifyContent: 'center' }}>
              <Outlet />
              <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Copyright
                  sx={{ mt: 'auto', position: 'fixed', bottom: '1px' }}
                />
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </>
  )
}
