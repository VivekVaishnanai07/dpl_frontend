import { LockOutlined } from '@mui/icons-material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import UserDataService from '../../service/users.service';
import { capitalizeAndChangeColor, notificationConfig } from '../../utils/util';

const defaultTheme = createTheme();

function SingIn() {
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
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlined />
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
              label="Email Address"
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
      </Container>
    </ThemeProvider>
  );
}

export default SingIn;