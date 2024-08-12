import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { AxiosResponse } from 'axios';
import { KeyboardEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import cricketImg from '../../assets/img/cricket.gif';
import AuthService from '../../service/auth.service';
import { notificationConfig } from '../../utils/util';
import './sign-in.css';

const defaultTheme = createTheme();

export default function SingIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = () => {
    const requestPayload = {
      email: email,
      password: password
    }
    AuthService.login(requestPayload).then((response) => {
      const responseData = response.data;
      if (responseData.token) {
        toast.success('You are successfully logged in', notificationConfig);
        localStorage.setItem("token", responseData.token)
        navigate('/dashboard');
      } else {
        toast.error(response.data, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        setEmail("");
        setPassword("");
      }
    }).catch((error) => {
      if (error.response.data) {
        toast.warning(error.response.data.message, notificationConfig);
      }
      toast.error(error.response.data, notificationConfig);
    })
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>) => {
    if (email && password) {
      if (event.key === 'Enter') {
        handleSubmit();
      }
    }
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid className='login-container' container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        {/* Adjust Grid item layout based on screen size */}
        <Grid className='login-left-section' item xs={12} sm={12} md={8} lg={8} xl={8}>
          <Typography component="h1" variant="h5" sx={{ padding: '24px !important', fontFamily: 'cursive !important' }}>
            Login and try your luck
          </Typography>
          <div className='img-container'>
            <img className='login-img' src={cricketImg} alt="Cricket" />
          </div>
        </Grid>
        <Grid className='login-right-section' item xs={12} sm={12} md={4} lg={4} xl={4} component={Paper} elevation={6} square>
          <Box className="login-field-box">
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box component="form" noValidate sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={handleKeyPress}
                label="Email"
                name="email"
                autoComplete="off"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyPress}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="off"
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                onClick={() => handleSubmit()}
                disabled={!email || !password}
              >
                Sign In
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}