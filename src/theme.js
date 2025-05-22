import { createTheme } from '@mui/material/styles'

export const theme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000',
      paper: '#121212',
    },
    primary: {
      main: '#FFA726',
    },
    secondary: {
      main: '#E91E63',
    },
    text: {
      primary: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Press Start 2P", monospace', // facultatif
  },
})
