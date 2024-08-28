import { Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

export const Copyright = (props: any) => {
  return (
    <>
      <Typography
        variant='body2'
        color='text.secondary'
        align='center'
        {...props}>
        {'Copyright © '}
        {new Date().getFullYear()}
        {'.'}{' '}
        <Link color='inherit' target='_blank' to='https://app.bynaus.ai/'>
          Byanus.com
        </Link>
      </Typography>
    </>
  )
}
