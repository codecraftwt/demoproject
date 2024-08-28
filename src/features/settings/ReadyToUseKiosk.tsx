import { Box, Button, Card, Typography } from '@mui/material'
import {
  KioskAccessIcon,
  KioskEmplyoeeSyncIcon,
  KioskSaveIcon,
} from '../../assets/icons/icons'

const ReadyToUseKiosk = () => {
  return (
    <>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          mt: 5,
        }}>
        <Card
          sx={{
            paddingInline: 5,
            paddingTop: 5,
            paddingBottom: 2,
            boxShadow: 'none',
            border: '1px solid #EEEEEE',
            borderRadius: '10px',
            gap: 2,
            width: '50%',
          }}>
          <Typography
            sx={{
              color: '#2B262C',
              fontSize: '2rem',
              fontFamily: 'Rza',
              fontWeight: '600',
            }}>
            New Kiosk is Ready to Use!
          </Typography>

          <Box
            sx={{
              mt: 3,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'start',
              gap: 1,
              pb: 1,
              borderBottom: '1px solid #DBDBDB',
            }}>
            <Box>
              <KioskEmplyoeeSyncIcon />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: '17px',
                  color: '#2B262C',
                  fontFamily: 'Rza',
                  fontWeight: '600',
                }}>
                Employee Sync
              </Typography>
              <Typography
                sx={{
                  color: '#7C7A80',
                  fontSize: '14px',
                }}>
                All employees with time tracking in Byanus are automatically
                synced to this kiosk.
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 3,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'start',
              gap: 1,
              pb: 1,
              borderBottom: '1px solid #DBDBDB',
            }}>
            <Box>
              <KioskAccessIcon />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: '17px',
                  color: '#2B262C',
                  fontFamily: 'Rza',
                  fontWeight: '600',
                }}>
                Access the Kiosk
              </Typography>
              <Typography
                sx={{
                  color: '#7C7A80',
                  fontSize: '14px',
                }}>
                Gusto Time Kiosk is a web app. Use the following URL to access
                your kiosk anytime on this browser: kiosk.bynaus.ai
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              mt: 3,
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'start',
              gap: 1,
              pb: 1,
            }}>
            <Box>
              <KioskSaveIcon />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: '17px',
                  color: '#2B262C',
                  fontFamily: 'Rza',
                  fontWeight: '600',
                }}>
                Save for Easy Access
              </Typography>
              <Typography
                sx={{
                  color: '#7C7A80',
                  fontSize: '14px',
                }}>
                Bookmark this page for quick access. On tablets,{' '}
                <span
                  style={{
                    textDecoration: 'underline',
                    color: '#F0845D',
                    cursor: 'pointer',
                  }}>
                  {' '}
                  save it as an icon on your home screen.{' '}
                </span>
              </Typography>
            </Box>
          </Box>

          <Box
            sx={{
              width: '80%',
              margin: '20px auto',
            }}>
            <Button
              variant='contained'
              sx={{
                color: '#FFF',
                background: '#F0845D',
                fontSize: '12px',
                textTransform: 'none',
                py: 1.9,
                borderRadius: '8px',
                width: '100%',
                boxShadow: 'none',
                ':hover': {
                  background: '#F0845D',
                  boxShadow: '1px',
                },
              }}
              // onClick={() => navigate('/setup-time-kiosk')}
            >
              Start Using Kiosk
            </Button>
          </Box>
        </Card>
      </Box>
    </>
  )
}

export default ReadyToUseKiosk
