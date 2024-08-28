import React from 'react'
import { Button } from '@mui/material'
import { useVerification } from './hooks'

const Verify = (props: any) => {
  const { isFetching, error, refetch } = useVerification(
    'verification',
    props.id
  )

  if (isFetching) {
    return <>Fetching...</>
  }

  if (error) {
    return (
      <>
        Oops, Can't load data
        <Button color='secondary' variant='contained' onClick={() => refetch()}>
          Retry?
        </Button>
      </>
    )
  }
  return (
    <>
      <h3>Thank you for verifying your email.</h3>
    </>
  )
}

export default Verify
