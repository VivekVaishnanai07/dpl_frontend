import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import { FormControl, InputLabel, Link, MenuItem, Select } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import AuthService from '../../../service/auth.service';
import { Resignation } from '../../../types/auth';
import { notificationConfig } from '../../../utils/util';

const defaultTheme = createTheme();

export default function Register() {
  const today = dayjs();
  const navigate = useNavigate();
  const [registerData, setRegisterData] = useState<Resignation>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    groupName: '',
    groupDescription: '',
    tournamentName: '',
    year: 2024,
    startDate: dayjs(new Date()),
    endDate: dayjs(new Date()),
    tournamentStatus: '',
  });

  const handleSubmit = () => {
    const {
      firstName,
      lastName,
      email,
      password,
      groupName,
      groupDescription,
      tournamentName,
      year,
      startDate,
      endDate,
      tournamentStatus,
    } = registerData;

    // Check if any of the required fields are empty
    if (
      !firstName.trim() ||
      !lastName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !groupName.trim() ||
      !groupDescription.trim() ||
      !tournamentName.trim() ||
      !year ||
      !startDate ||
      !endDate ||
      !tournamentStatus.trim()
    ) {
      toast.warning('Please fill out required fields.', notificationConfig);
      return;
    }

    // Additional Validations
    if (startDate && startDate.isBefore(dayjs(), 'day')) {
      toast.warning('Start date must be today or a future date.', notificationConfig);
      return;
    }

    if (endDate && (!startDate || endDate.isBefore(startDate, 'day'))) {
      toast.warning('End date must be after the start date.', notificationConfig);
      return;
    }

    if (year < 2024) {
      toast.warning('Year must be 2024 or later.', notificationConfig);
      return;
    }

    // If all validations pass, proceed with registration
    if (registerData) {
      AuthService.registration(registerData)
        .then((res) => {
          if (res.data) {
            toast.success(res.data, notificationConfig);
            navigate('/login');
          }
        })
        .catch((err) => {
          if (err.response.data) {
            toast.error(err.response.data, notificationConfig);
          } else {
            console.error(err);
          }
        });
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <AppRegistrationIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Registration
          </Typography>
          <Box sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  value={registerData.firstName}
                  onChange={(e) => setRegisterData({ ...registerData, firstName: e.target.value })}
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  value={registerData.lastName}
                  onChange={(e) => setRegisterData({ ...registerData, lastName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={registerData.email}
                  onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  value={registerData.password}
                  onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="groupName"
                  required
                  fullWidth
                  id="groupName"
                  label="Group Name"
                  value={registerData.groupName}
                  onChange={(e) => setRegisterData({ ...registerData, groupName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-description"
                  name="groupDescription"
                  required
                  fullWidth
                  id="groupDescription"
                  label="Group Description"
                  value={registerData.groupDescription}
                  onChange={(e) => setRegisterData({ ...registerData, groupDescription: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="tournamentName"
                  required
                  fullWidth
                  id="tournamentName"
                  label="Tournament Name"
                  value={registerData.tournamentName}
                  onChange={(e) => setRegisterData({ ...registerData, tournamentName: e.target.value })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  type='number'
                  id="year"
                  label="Year"
                  name="year"
                  value={registerData.year}
                  onChange={(e) => setRegisterData({ ...registerData, year: parseInt(e.target.value) })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    className='w-100'
                    label="Start Date"
                    value={registerData.startDate}
                    format="DD/MM/YYYY"
                    minDate={today}
                    onChange={(newValue: any) => setRegisterData({ ...registerData, startDate: dayjs(newValue) })}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    className='w-100'
                    label="End Date"
                    value={registerData.endDate}
                    format="DD/MM/YYYY"
                    minDate={registerData.startDate}
                    onChange={(newValue: any) => setRegisterData({ ...registerData, endDate: dayjs(newValue) })}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Tournament Status</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={registerData.tournamentStatus}
                    label="Tournament Status"
                    onChange={(e) => setRegisterData({ ...registerData, tournamentStatus: e.target.value })}
                  >
                    <MenuItem value="">Select Tournament Status</MenuItem>
                    <MenuItem value="Active">Active</MenuItem>
                    <MenuItem value="Coming Soon">Coming Soon</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="button"
              fullWidth
              variant="contained"
              onClick={handleSubmit}
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}