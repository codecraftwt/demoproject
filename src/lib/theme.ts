import { createTheme } from '@mui/material'

const themesConfig = (mode: any) =>
  createTheme({
    ...getComponentOverrides(),
    ...getDesignTokens(mode),
  })

const getDesignTokens = (mode: any) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
        primary: {
          main: '#F0845D',
          light: 'rgba(240, 132, 93, 0.15)',
          dark: '#d87653',
          contrastText: '#FFF',
        },
        secondary: {
          main: '#F50057',
          light: '#F73378',
          dark: '#AB003C',
          contrastText: '#fff',
        },
        background: {
          default: '#F1EFF5',
          paper: '#fff',
        },
        text: {
          primary: '#333',
          secondary: '#696969', // pć
        },
      }
      : {
        primary: {
          main: '#3f51b5',
          light: '#fff',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#f50057',
          light: '#F73378',
          dark: '#AB003C',
          contrastText: '#ffffff',
        },
        /*info: {
        main: '#2196f3'
      },
      background: {
        default: '#303030',
        paper: '#424242',
      },
      */
        text: {
          primary: '#333',
          secondary: 'red',
          success: 'green',
        },
      }),
  },
  typography: {
    fontFamily: 'Open Sans, Montserrat, sans-serif',
    fontWeightBold: 'bold',
    fontWeightRegular: 500,
    fontWeightMedium: 700,
  },
})

const getComponentOverrides = () => ({
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontWeight: 'bold',
        },
      },
    },
  },
})

export default themesConfig
