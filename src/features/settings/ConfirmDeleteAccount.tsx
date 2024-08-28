import React, { useState } from 'react'
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from '@mui/material'

export const ConfirmDeleteProfile = (props: any) => {
  const { open, handleActionCallback, handleClose } = props
  const [deleteInput, setDeleteInput] = useState('')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDeleteInput(event.target.value)
  }

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To delete your profile, please type "DELETE" in the box below.
        </DialogContentText>
        <TextField
          autoFocus
          margin='dense'
          id='name'
          label="Type 'DELETE' to confirm"
          type='text'
          fullWidth
          variant='standard'
          onChange={handleInputChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleActionCallback}
          disabled={deleteInput !== 'DELETE'}
          variant='contained'
          color='error'>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
