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
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import cricketImg from '../../assets/img/cricket.gif';
import UserDataService from '../../service/users.service';
import { capitalizeAndChangeColor, notificationConfig } from '../../utils/util';

const defaultTheme = createTheme();

export default function SingIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = () => {
    UserDataService.get(email).then((response: any) => {
      if (response.data.length !== 0) {
        const user = response.data[0]
        if (user.password === password) {
          // setAuth(user.role)
          toast.success('You are successfully logged in', notificationConfig);
          const profileAvatar: any = capitalizeAndChangeColor(user.first_name, user.last_name)
          let profileAvatarString = JSON.stringify(profileAvatar)
          localStorage.setItem("avatarProfile", profileAvatarString)
          let string = JSON.stringify(user)
          localStorage.setItem("isLogin", string)
          navigate('/dashboard');
        } else {
          toast.warn('incorrect your password pleas try again', notificationConfig);
          setEmail("")
          setPassword("")
        }
      } else {
        toast.error('Error Your Email is not exits', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    }).catch((error: Error) => {
      console.error(error)
    })
  };
  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={8}
          sx={{
            backgroundImage: `url(${cricketImg})`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
          }}
        >
          <Typography component="h1" variant="h5" sx={{ padding: '24px !important', fontFamily: 'cursive !important' }}>
            Login and try your luck
          </Typography>
        </Grid>
        <Grid item xs={12} sm={8} md={4} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginTop: '180px !important'
            }}
          >
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