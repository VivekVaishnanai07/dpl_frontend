import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import MatchesDataService from '../../service/matches.service';
import TeamsDataService from '../../service/teams.service';
import { notificationConfig } from '../../utils/util';

const defaultTheme = createTheme();

export default function AddMatch() {
  const navigate = useNavigate();
  const { id }: any = useParams();
  const [teamList, setTeamList] = useState([]);
  const [error, setError] = useState(false);
  const [matchData, setMatchData] = useState<any>({
    match_no: 0,
    date: dayjs(new Date()),
    team_1: 0,
    team_2: 0,
    venue: "",
    match_price: 10,
    season_year: 2024
  })

  useEffect(() => {
    getMatchData();
    getTeamList();
    // eslint-disable-next-line
  }, [])

  const getMatchData = () => {
    if (id !== undefined) {
      MatchesDataService.get(id).then((res) => {
        const match = res.data[0]
        if (match) {
          setMatchData({
            ...match,
            match_no: match.match_no,
            date: dayjs(match.date),
            team_1: match.team_1,
            team_2: match.team_2,
            venue: match.venue,
            match_price: match.match_price,
            season_year: match.season_year
          })
        }
      }).catch((error) => console.error(error))
    }
  }

  const getTeamList = () => {
    TeamsDataService.getAll().then((res) => {
      setTeamList(res.data)
    }).catch((error) => console.error(error))
  }

  const handleSubmit = () => {
    if (matchData.match_no !== 0 || matchData.team_1 !== 0 || matchData.team_2 !== 0 || matchData.venue !== "" || matchData.match_price !== 0) {
      if (matchData.match_no !== 0) {
        if (id !== undefined) {
          let data = { ...matchData, date: matchData.date }
          MatchesDataService.update(id, data).then((res: any) => {
            navigate('/matches')
          }).catch((error) => console.error(error))
        } else {
          let data = { ...matchData, date: matchData.date }
          MatchesDataService.create(data).then((res: any) => {
            navigate('/matches')
          }).catch((error) => {
            console.error("Error fetching data:", error);
          });
        }
      } else {
        toast.error(`0 Match number is default selected please change match number`, notificationConfig);
      }
    } else {
      toast.error(`Enter a valid data`, notificationConfig);
    }
  };

  const handleTeam1Change = (event: any) => {
    setMatchData({
      ...matchData,
      team_1: event.target.value
    });

    if (matchData.team_2 !== 0) {
      if (event.target.value === matchData.team_2) {
        setError(true);
      } else {
        setError(false);
      }
    }
  };
  const handleTeam2Change = (event: any) => {
    setMatchData({
      ...matchData,
      team_2: event.target.value
    });
    if (matchData.team_1 !== 0) {
      if (event.target.value === matchData.team_1) {
        setError(true);
      } else {
        setError(false);
      }
    }
  };
  const handleDateTimeChange = (newValue: any) => {
    setMatchData({ ...matchData, date: dayjs.utc(newValue) })
  }

  return (
    <div className="bottom-section-main">
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
            <Box component="form" noValidate sx={{ marginTop: "40px !important", marginBottom: "40px !important" }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="Match No."
                    label="Match No."
                    id="matchNo"
                    type="number"
                    value={matchData.match_no}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMatchData({ ...matchData, match_no: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="Season Year"
                    label="Season Year"
                    id="season_year"
                    type='text'
                    value={matchData.season_year}
                    onChange={(e: any) => setMatchData({ ...matchData, season_year: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Team 1</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={matchData.team_1}
                      label="Home Team"
                      onChange={handleTeam1Change}
                    >
                      <MenuItem value={0}>
                        <div style={{ display: "flex", alignItems: "center", fontSize: 18 }}>
                          Select a team
                        </div>
                      </MenuItem>
                      {teamList && teamList.map((team: any) => (
                        <MenuItem key={team.id} value={team.id}>
                          <div style={{ display: "flex", alignItems: "center", fontSize: 18 }}>
                            <img
                              loading="lazy"
                              width="40"
                              height="40"
                              src={team.icon}
                              alt=""
                            />
                            {team.short_name}
                          </div>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Team 2</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={matchData.team_2}
                      label="Team 2"
                      onChange={handleTeam2Change}
                    >
                      <MenuItem value={0}>
                        <div style={{ display: "flex", alignItems: "center", fontSize: 18 }}>
                          Select a team
                        </div>
                      </MenuItem>
                      {teamList && teamList.map((team: any) => (
                        <MenuItem key={team.id} value={team.id}>
                          <div style={{ display: "flex", alignItems: "center", fontSize: 18 }}>
                            <img
                              loading="lazy"
                              width="40"
                              height="40"
                              src={team.icon}
                              alt=""
                            />
                            {team.short_name}
                          </div>
                        </MenuItem>
                      ))
                      }
                    </Select>
                  </FormControl>
                  {error && (
                    <Typography variant="caption" color="error">
                      Error: Values cannot be the same.
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="Venue"
                    label="Venue"
                    id="venue"
                    value={matchData.venue}
                    onChange={(e) => setMatchData({ ...matchData, venue: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    type='number'
                    name="match_price"
                    label="Match Price"
                    id="match_price"
                    value={matchData.match_price}
                    onChange={(e) => setMatchData({ ...matchData, match_price: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DateTimePicker
                      label="Date"
                      value={matchData.date}
                      onChange={handleDateTimeChange}
                      format='DD/MM/YYYY h:mm A'
                      sx={{ width: "100%" }}
                      disabled={id ? true : false}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                  <Button variant="contained" className='btn' onClick={handleSubmit}>{id !== undefined ? 'Update' : 'Add'}</Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div >
  );
}