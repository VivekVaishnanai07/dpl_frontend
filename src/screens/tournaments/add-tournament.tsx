import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import { Autocomplete, Checkbox, FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import GroupService from '../../service/group.service';
import TournamentService from '../../service/tournament.service';
import { IGroup } from '../../types/group';
import { notificationConfig } from '../../utils/util';
import dayjs from 'dayjs';

const defaultTheme = createTheme();
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

export default function AddTournament() {
  const navigate = useNavigate();
  const { id }: any = useParams();
  const [groupList, setGroupList] = useState([]);
  const [groupFieldDisable, setGroupFieldDisable] = useState(false);
  const [tournamentData, setTournamentData] = useState({
    name: "",
    year: 2024,
    start_date: dayjs(new Date()),
    end_date: dayjs(new Date()),
    status: "",
    groups: [],
  })

  let fieldDisable = !tournamentData.name || !tournamentData.year;

  useEffect(() => {
    if (id !== "add-tournament" && id !== undefined) {
      TournamentService.get(id).then((res) => {
        const tournament = res.data

        setTournamentData({
          name: tournament.name,
          year: tournament.year,
          start_date: dayjs(tournament.start_date),
          end_date: dayjs(tournament.end_date),
          status: tournament.status,
          groups: tournament.groups
        })
      }).catch((error) => console.error(error))
    }
    getGroupList();
  }, [id])

  const getGroupList = () => {
    GroupService.getAll(null).then((res) => {
      if (res.data.length === 0) {
        setGroupFieldDisable(true);
      } else {
        setGroupFieldDisable(false);
      }
      setGroupList(res.data);
    }).catch((error) => {
      console.error(error);
    })
  }

  const handleSubmit = () => {
    if (id !== "add-tournament" && id !== undefined) {
      TournamentService.update(id, tournamentData).then((res) => {
        toast.success(res.data.message, notificationConfig);
        navigate('/tournaments')
      }).catch((error) => {
        toast.error(error.response.data.error, notificationConfig);
      })
    } else {
      TournamentService.create(tournamentData).then((res) => {
        toast.success(res.data.message, notificationConfig);
        navigate('/tournaments')
      }).catch((error) => {
        toast.error(error.response.data.error, notificationConfig);
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
            <Box component="form" noValidate sx={{ marginTop: "40px !important", marginBottom: "40px !important" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="given-name"
                    name="name"
                    required
                    fullWidth
                    id="name"
                    label="Name"
                    value={tournamentData.name}
                    onChange={(e) => setTournamentData({ ...tournamentData, name: e.target.value })}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    type='number'
                    id="year"
                    label="Year"
                    name="year"
                    autoComplete="year"
                    value={tournamentData.year}
                    onChange={(e) => setTournamentData({ ...tournamentData, year: parseInt(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    className='multi-select-box-width'
                    options={groupList}
                    disableCloseOnSelect
                    onChange={(event: any, values: any) => setTournamentData({ ...tournamentData, groups: values })}
                    value={tournamentData.groups}
                    disabled={groupFieldDisable}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    getOptionLabel={(option: IGroup) => option.name ? option.name : ''}
                    renderOption={(props, option, { selected }) => (
                      <li {...props}>
                        <Checkbox
                          icon={icon}
                          checkedIcon={checkedIcon}
                          style={{ marginRight: 8 }}
                          checked={selected}
                        />
                        {option.name ? option.name : ''}
                      </li>
                    )}
                    renderInput={(params) => (
                      <TextField {...params} label="Groups" placeholder="Groups" />
                    )}
                  />
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Start Date"
                      value={tournamentData.start_date}
                      format="DD/MM/YYYY"
                      onChange={(newValue: any) => setTournamentData({ ...tournamentData, start_date: dayjs(newValue) })}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={6}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="End Date"
                      value={tournamentData.end_date}
                      format="DD/MM/YYYY"
                      onChange={(newValue: any) => setTournamentData({ ...tournamentData, end_date: dayjs(newValue) })}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Tournament Status</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={tournamentData.status}
                      label="Tournament Status"
                      onChange={(e) => setTournamentData({ ...tournamentData, status: e.target.value })}
                    >
                      <MenuItem value="">Select Tournament Status</MenuItem>
                      <MenuItem value="Completed">Completed</MenuItem>
                      <MenuItem value="Active">Active</MenuItem>
                      <MenuItem value="Coming Soon">Coming Soon</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button variant="contained" color='inherit' onClick={() => navigate('/tournaments')} >Back</Button>
                  <Button variant="contained" className='btn' onClick={handleSubmit} disabled={fieldDisable}>{id !== 'add-tournament' ? 'Update' : 'Add'}</Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}