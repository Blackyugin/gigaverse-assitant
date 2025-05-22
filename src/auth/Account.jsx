import { useAuth } from './AuthProvider';
import { supabase } from '../supabase/client';
import { Box, Typography, Button, Paper } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

export default function Account() {
  const { user } = useAuth();

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
      <Paper
        elevation={6}
        sx={{
          p: 4,
          bgcolor: '#1e1e1e',
          borderRadius: 3,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          👤 Welcome, {user?.email}
        </Typography>

        <Typography variant="body2" sx={{ mb: 3, color: '#aaa' }}>
          You are logged in to Gigaverse Combat Assistant
        </Typography>

        <Button
          onClick={logout}
          variant="outlined"
          color="secondary"
          startIcon={<LogoutIcon />}
        >
          Logout
        </Button>
      </Paper>
    </Box>
  );
}
