import { useState } from 'react';
import { supabase } from '../supabase/client';
import { TextField, Button, Typography, Box } from '@mui/material';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMsg('');

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMsg(error.message);
    } else {
      setMsg('✅ Check your email to confirm your account');
    }
  };

  return (
    <Box component="form" onSubmit={handleSignUp} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <TextField
        label="Email"
        type="email"
        value={email}
        fullWidth
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <TextField
        label="Password"
        type="password"
        value={password}
        fullWidth
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <Button type="submit" variant="contained" color="primary">
        Sign Up
      </Button>
      {msg && <Typography variant="body2" color="error">{msg}</Typography>}
    </Box>
  );
}
