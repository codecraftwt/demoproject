import { Box, Typography } from '@mui/material'
import { useState } from 'react'

const Stepper = ({ steps, activeStep ,fillPercentages}: any) => {
  const fillPercentage =
    activeStep === 0
      ? '50%'
      : `${Math.round((activeStep / (steps.length - 1)) * 100)}%`

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          gap: 1,
        }}>
        {steps?.map((item: any, index: any) => (
          <Box
            sx={{
              width: '50%',
              display: 'flex',
              gap: 1,
            }}>
            <Box
              sx={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                border: '1px solid #DBDBDB',
                position: 'relative',
              }}>
              <Typography
                sx={{
                  position: 'absolute',
                  top: '55%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontSize: '14px',
                  color: index <= activeStep ? '#7C7A80' : 'gray',
                }}>
                {'0' + (index + 1)}
              </Typography>
            </Box>
            <Typography
              sx={{
                color: index <= activeStep ? '#2B262C' : 'gray',
                fontSize: '20px',
                fontWeight: '600',
                fontFamily: 'Rza',
              }}>
              {item}
            </Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          width: '100%',
          height: '6px',
          backgroundImage: `linear-gradient(90deg, #F0845D ${fillPercentages ? fillPercentages :fillPercentage}, #F1EFF5 ${fillPercentages ? fillPercentages : fillPercentage})`,
          borderRadius: '10px',
          mt: 2,
        }}></Box>
    </>
  )
}

export default Stepper
