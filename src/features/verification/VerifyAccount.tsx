import React from 'react'
import { Button } from '@mui/material'
import { useVerificationAccount } from './hooks'

const VerifyAccount = (props: any) => {
  const { isFetching, error, refetch } = useVerificationAccount(
    'verificationAccount',
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
      <h3>Thank you for verifying your account and email.</h3>
    </>
  )
}

export default VerifyAccount
