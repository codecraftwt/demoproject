import React, { useEffect, useState } from 'react'
import { useMutateCreateOrganization } from './hooks'
import { Form } from '../../components/Form'
import { Fetching } from '../../components/Fetching'
import { Box, Typography } from '@mui/material'

const defaultFormData = {
  companyName: '',
  displayName: '',
  adminEmail: '',
}

const tempAccountForm = {
  formName: 'Account Name',
  fields: [
    {
      fieldType: 'text',
      name: 'companyName',
      label: 'Company Name',
      errorMessage: 'Oops, looks like your account does not have a name',
      isRequired: true,
      options: [],
      rules: null,
    },
    {
      fieldType: 'email',
      name: 'adminEmail',
      label: 'Your Email',
      errorMessage: 'Oops, looks like your email is invalid',
      isRequired: true,
      options: [],
      rules: null,
    },
  ],
}

export const CreateOrganization = () => {
  const [formData, setFormData] = useState<any>(defaultFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [organizationCreated, setOrganizationCreated] = useState(false)
  const {
    mutateAsync,
    isError,
    isLoading: isLoadingOrganization,
    isSuccess,
  } = useMutateCreateOrganization('organization')
  const [isFormSubmitted, setIsFormSubmitted] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [formError, setFormError] = useState('')
  const [formIsValid, setFormIsValid] = useState(false)

  //const { data: accountForm, refetch, isFetching, error: formError } = useGetEntityFormByType('account', 'account')
  //const { user, isLoading, logout }: any = useAuth0()

  const accountForm = tempAccountForm

  const validateEmail = (email: any) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(String(email).toLowerCase())
  }

  const submitHandler = async (accountData: any) => {
    try {
      const payload = {
        account: formData,
      }
      setErrorMessage('')
      setIsSubmitting(true)
      const result = await mutateAsync(payload)
      if (result.error) {
        setIsSubmitting(false)
        setErrorMessage(result.error.message)
      } else {
        setIsSubmitting(false)
        setIsFormSubmitted(true)
      }
    } catch (error) {
      console.log('errors', error)
    }
  }

  const handleCompanyNameChange = (data: any) => {
    const emailField = data.adminEmail
    const companyName = data.companyName
    if (companyName.startsWith(' ')) {
      setFormError('Company name cannot start with a space')
      setFormIsValid(true)
      return
    }
    const validNameRegex = /^[a-zA-Z0-9 '-]+$/

    if (!validNameRegex.test(companyName)) {
      setFormError('Company name should not contain special characters')
      setFormIsValid(false)
      return
    }

    if (emailField && !validateEmail(emailField)) {
      setFormError('Enter valid email address')
      setFormIsValid(true)
      return
    }
    setFormError('')
    setFormIsValid(false)
    setFormData({
      ...formData,
      companyName: data.companyName,
      displayName: data.companyName,
      adminEmail: data.adminEmail,
    })
  }

  useEffect(() => {
    //console.log('accountForm', accountForm)
    if (!accountForm) {
      //console.log('refetching')
      //refetch()
    }
  }, [accountForm])

  useEffect(() => {
    if (isSuccess && isFormSubmitted) {
      localStorage.clear()
      sessionStorage.clear()
      setOrganizationCreated(true)
      setIsSubmitting(false)
    }
  }, [isSuccess, isFormSubmitted])

  if (errorMessage || isError) {
    return errorMessage ? (
      <div>{errorMessage}</div>
    ) : (
      <div>Oops something went wrong!</div>
    )
  }

  if (isLoadingOrganization || isSubmitting) {
    return <Fetching />
  }

  if (isSuccess && isFormSubmitted) {
    return (
      <Typography variant='h4'>
        Check your email to active your account!
      </Typography>
    )
  }

  return (
    <>
      {accountForm && !organizationCreated ? (
        <Form
          fields={accountForm.fields}
          onFormDataChange={handleCompanyNameChange}
          onSubmit={submitHandler}
          formError={formError}
          record={formData}
          formIsValid={formIsValid}
        />
      ) : (
        <Fetching />
      )}
    </>
  )
}
