import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material';
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
import { ChangeEvent, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import MatchService from '../../service/matches.service';
import TeamService from '../../service/teams.service';
import { MatchDetailsRequestPayload } from '../../types/match';
import { ITeam } from '../../types/team';
import { notificationConfig } from '../../utils/util';

const defaultTheme = createTheme();

export default function AddMatch() {
  const navigate = useNavigate();
  const { id }: any = useParams();
  const [teamList, setTeamList] = useState([]);
  const [error, setError] = useState(false);
  const [matchData, setMatchData] = useState<MatchDetailsRequestPayload>({
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
      MatchService.get(id).then((res) => {
        const match = res.data[0]
        if (match) {
          setMatchData({
            ...match,
            match_no: match.match_no,
            team_1: match.team_1,
            team_2: match.team_2,
            date: dayjs(match.date),
            venue: match.venue,
            match_price: match.match_price,
            season_year: match.season_year
          })
        }
      }).catch((error) => console.error(error))
    }
  }

  const getTeamList = () => {
    TeamService.getAll().then((res) => {
      setTeamList(res.data)
    }).catch((error) => console.error(error))
  }

  const handleSubmit = () => {
    if (matchData.match_no !== 0 || matchData.team_1 !== 0 || matchData.team_2 !== 0 || matchData.venue !== "" || matchData.match_price !== 0) {
      if (matchData.team_1 !== matchData.team_2) {
        if (matchData.match_no !== 0) {
          if (id !== undefined) {
            let data = { ...matchData, date: matchData.date }
            MatchService.update(id, data).then((res) => {
              navigate('/matches')
            }).catch((error) => {
              toast.error(error.response.data.error, notificationConfig);
            })
          } else {
            let data = { ...matchData, date: matchData.date }
            MatchService.create(data).then((res) => {
              navigate('/matches')
            }).catch((error) => {
              console.error("Error fetching data:", error);
            });
          }
        } else {
          toast.error(`0 Match number is default selected please change match number`, notificationConfig);
        }
      } else {
        toast.error(`You cannot select 2 identical teams.`, notificationConfig);
      }
    } else {
      toast.error(`Enter a valid data`, notificationConfig);
    }
  };

  const handleTeam1Change = (event: SelectChangeEvent<string | number>) => {
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
  const handleTeam2Change = (event: SelectChangeEvent<string | number>) => {
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
    setMatchData({ ...matchData, date: dayjs(newValue) })
  }

  return (
    <div className="bottom-section-main bg">
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" style={{ maxWidth: "650px" }}>
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
                <Grid item xs={12} md={4}>
                  <TextField
                    required
                    fullWidth
                    name="Match No."
                    label="Match No."
                    id="matchNo"
                    type="number"
                    value={matchData.match_no}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMatchData({ ...matchData, match_no: parseInt(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    required
                    fullWidth
                    name="Season Year"
                    label="Season Year"
                    id="season_year"
                    type='text'
                    value={matchData.season_year}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMatchData({ ...matchData, season_year: parseInt(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={12} md={4}>
                  <TextField
                    required
                    fullWidth
                    type='number'
                    name="match_price"
                    label="Match Price"
                    id="match_price"
                    value={matchData.match_price}
                    onChange={(e) => setMatchData({ ...matchData, match_price: parseInt(e.target.value) })}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Team 1</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={matchData.team_1}
                      label="Home Team"
                      onChange={handleTeam1Change}
                      disabled={id ? true : false}
                    >
                      <MenuItem value={0}>
                        <div style={{ display: "flex", alignItems: "center", fontSize: 18 }}>
                          Select a team
                        </div>
                      </MenuItem>
                      {teamList && teamList.map((team: ITeam) => (
                        <MenuItem key={team.id} value={team.id}>
                          <div style={{ display: "flex", alignItems: "center", fontSize: 18 }}>
                            <img
                              loading="lazy"
                              width="40"
                              height="40"
                              src={team.icon}
                              alt="team_1"
                              style={{ paddingRight: "4px" }}
                            />
                            {team.short_name}
                          </div>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Team 2</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={matchData.team_2}
                      label="Team 2"
                      onChange={handleTeam2Change}
                      disabled={id ? true : false}
                    >
                      <MenuItem value={0}>
                        <div style={{ display: "flex", alignItems: "center", fontSize: 18 }}>
                          Select a team
                        </div>
                      </MenuItem>
                      {teamList && teamList.map((team: ITeam) => (
                        <MenuItem key={team.id} value={team.id}>
                          <div style={{ display: "flex", alignItems: "center", fontSize: 18 }}>
                            <img
                              loading="lazy"
                              width="40"
                              height="40"
                              src={team.icon}
                              alt="team_2"
                              style={{ paddingRight: "4px" }}
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
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} md={6}>
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
                <Grid item xs={12} style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button variant="contained" color='inherit' onClick={() => navigate('/matches')}>Back</Button>
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