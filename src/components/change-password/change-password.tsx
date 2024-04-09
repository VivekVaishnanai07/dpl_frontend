import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { AxiosResponse } from 'axios';
import { jwtDecode } from 'jwt-decode';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import ChangePasswordIcon from '../../assets/icon/change-password-icon';
import AuthService from '../../service/auth.service';
import { ChangePasswordRequestPayload, IChangePassword, JwtTokenDecode } from '../../types/auth';
import { ApiResponse } from '../../types/common';
import { notificationConfig } from '../../utils/util';

const defaultTheme = createTheme();

export default function ChangePassword() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordMatchError, setNewPasswordMatchError] = useState('');
  const [confirmPasswordMatchError, setConfirmPasswordMatchError] = useState('');

  const token = localStorage.getItem('token') as string;
  const userData: JwtTokenDecode = jwtDecode(token);

  const handleNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setNewPassword(value);
    if (confirmPassword && value !== confirmPassword) {
      setNewPasswordMatchError('Passwords do not match');
    } else {
      setNewPasswordMatchError('');
    }
  };

  const handleConfirmPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setConfirmPassword(value);
    if (newPassword && value !== newPassword) {
      setConfirmPasswordMatchError('Passwords do not match');
    } else {
      setConfirmPasswordMatchError('');
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const oldPassword = data.get('oldPassword');
    const newPassword = data.get('newPassword');
    const confirmPassword = data.get('confirmPassword');

    if (!oldPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword) {
      return;
    }

    const responseData: ChangePasswordRequestPayload = {
      userId: userData.id,
      oldPassword: oldPassword.toString(),
      newPassword: newPassword.toString(),
      confirmPassword: confirmPassword.toString(),
    }

    AuthService.changePassword(responseData).then((response: AxiosResponse<any, ApiResponse<IChangePassword>>) => {
      const responseData: IChangePassword = response.data;
      if (responseData.message) {
        toast.success(responseData.message, notificationConfig);
        setNewPassword('');
        setConfirmPassword('');
        localStorage.clear();
        navigate('/login');
      }
    }).catch((error) => {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      setNewPassword('');
      setConfirmPassword('');
    })
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <ChangePasswordIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Change Password
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="oldPassword"
              label="Old Password"
              type="password"
              id="oldPassword"
              autoComplete="current-password"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="newPassword"
              label="New Password"
              type="password"
              id="newPassword"
              autoComplete="new-password"
              onChange={handleNewPasswordChange}
              error={newPasswordMatchError ? true : false}
              helperText={newPasswordMatchError}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              id="confirmPassword"
              autoComplete="confirm-password"
              onChange={handleConfirmPasswordChange}
              error={confirmPasswordMatchError ? true : false}
              helperText={confirmPasswordMatchError}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
