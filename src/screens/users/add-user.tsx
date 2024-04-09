import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import UserService from '../../service/users.service';
import { UserRequestPayload } from '../../types/user';


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function AddUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [userData, setUserData] = useState<UserRequestPayload>({
    first_name: "",
    last_name: "",
    email: "",
    role: ""
  })

  let fieldDisable = !userData.first_name || !userData.last_name || !userData.email;

  useEffect(() => {
    if (id !== undefined) {
      UserService.getById(parseInt(id)).then((res) => {
        const user = res.data;
        setUserData({
          first_name: user.first_name,
          last_name: user.last_name,
          email: user.email,
          role: user.role
        })
      }).catch((error) => console.error(error))
    }
  }, [id])

  const handleSubmit = () => {
    if (id !== undefined) {
      UserService.update(parseInt(id), userData).then((res) => {
        navigate('/users')
      }).catch((error) => console.error(error))
    } else {
      UserService.create(userData).then((res) => {
        navigate('/users')
      }).catch((error) => {
        console.error(error)
      })
    }
  };

  return (
    <div className="bottom-section-main bg">
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
            <Box component="form" noValidate sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    value={userData.first_name}
                    onChange={(e) => setUserData({ ...userData, first_name: e.target.value })}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="lastName"
                    value={userData.last_name}
                    onChange={(e) => setUserData({ ...userData, last_name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="email"
                    label="Email"
                    id="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">User Role</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={userData.role}
                      label="Home Team"
                      onChange={(e) => setUserData({ ...userData, role: e.target.value })}
                    >
                      <MenuItem value="admin">Admin</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button variant="contained" color="inherit" onClick={() => navigate('/users')}>Back</Button>
                  <Button variant="contained" className='btn' onClick={handleSubmit} disabled={fieldDisable}>{id !== undefined ? 'Update' : 'Add'}</Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}