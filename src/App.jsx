import React, { useState } from "react";
import {
  CssBaseline,
  Container,
  Box,
  Typography,
  Paper,
  Button,
} from "@mui/material";
import { AuthProvider, useAuth } from './auth/AuthProvider';
import SignIn from './auth/SignIn';
import SignUp from './auth/SignUp';
import Account from './auth/Account';
import CombatAssistant from './CombatAssistant';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// 🌑 Dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#000000',
      paper: '#121212',
    },
    primary: {
      main: '#f9a825',
    },
    secondary: {
      main: '#d32f2f',
    },
  },
  typography: {
    fontFamily: 'monospace',
  }
});

function MainApp() {
  const { user } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);

  if (!user) {
    return (
      <Box sx={{ bgcolor: '#121212', minHeight: '100vh', color: '#fff' }}>
        {/* Bannière */}
        <Box component="img"
          src="/src/assets/gigaverse-banner.gif"
          alt="Gigaverse Banner"
          sx={{ width: '100%', maxHeight: 450, objectFit: 'cover' }}
        />

        {/* Formulaire */}
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Paper elevation={4} sx={{ p: 4, bgcolor: '#1e1e1e' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h5" fontWeight="bold">
                {isSignUp ? 'Create an account' : 'Welcome back'}
              </Typography>
              <Button
                onClick={() => setIsSignUp(!isSignUp)}
                variant="text"
                sx={{ color: '#90caf9', fontWeight: 'bold' }}
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Button>
            </Box>

            {isSignUp ? <SignUp /> : <SignIn />}
          </Paper>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: '#121212', minHeight: '100vh', color: '#fff', p: 2 }}>
      <Account />
      <CombatAssistant />
    </Box>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <MainApp />
        <Box
          component="footer"
          sx={{
            mt: 6,
            py: 2,
            textAlign: 'center',
            fontSize: '0.9rem',
            color: '#ccc'
          }}
        >
          <Typography variant="body2">
            ❤️ If you enjoy this tool, you can support my work with crypto donations 🙏 :
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            ETH: <code style={{ color: '#f9a825' }}>0xa403c3cbe7f703a1ed8c8ae20dfb0efc7dc5a6dc</code>
          </Typography>
        </Box>
      </AuthProvider>
    </ThemeProvider>
  );
}
