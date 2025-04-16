'use client';

import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Link,
  Paper,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useAuth } from '@/hooks/useAuth';
import type { Theme } from '@mui/material/styles';

const StyledPaper = styled(Paper)(({ theme }: { theme: Theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 400,
  width: '100%',
}));

const Logo = styled('div')({
  width: 120,
  height: 120,
  marginBottom: 24,
  background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: 'white',
  fontSize: '2rem',
  fontWeight: 'bold',
});

const TitleText = styled(Typography)({
  color: '#2196F3',
  fontWeight: 'bold',
});

const FormField = styled(Box)({
  marginBottom: '24px',
  width: '100%',
});

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const result = await resetPassword(email);
    if (result.success) {
      setSuccess('Password reset instructions sent to your email');
    } else {
      setError(result.error || 'An error occurred');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <StyledPaper elevation={3}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TitleText variant="h4" gutterBottom>
            Future
          </TitleText>
          <Typography variant="h4" gutterBottom sx={{ color: '#2196F3' }}>
            Konnect
          </Typography>
        </Box>
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
            {success}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
          <FormField>
            <TextField
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
              sx={{
                '& .MuiInputBase-input': {
                  color: '#333333',
                },
                '& .MuiInputLabel-root': {
                  color: '#666666',
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: '#666666',
                  },
                  '&:hover fieldset': {
                    borderColor: '#2196F3',
                  },
                },
              }}
            />
          </FormField>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2, py: 1.5 }}
          >
            Reset Password
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Link href="/" variant="body2" color="primary">
              Back to Sign in
            </Link>
          </Box>
        </Box>
      </StyledPaper>
    </Container>
  );
} 