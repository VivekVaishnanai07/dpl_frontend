import { FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import MatchesDataService from '../../service/matches.service';
import TeamsDataService from '../../service/teams.service';
import { dateFormateSql, notificationConfig } from '../../utils/util';
import { toast } from 'react-toastify';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function AddMatch() {
  const navigate = useNavigate();
  let localDate: any = new Date();
  const { id }: any = useParams();
  const [teamList, setTeamList] = useState([]);
  const [error, setError] = useState(false);
  const [matchData, setMatchData] = useState<any>({
    match_no: '0',
    date: localDate,
    team_1: "",
    team_2: "",
    venue: "",
    season_year: 2023
  })

  let fieldDisable = !matchData.match_no || !matchData.team_1 || !matchData.team_2 || !matchData.venue;

  useEffect(() => {
    if (id !== undefined) {
      MatchesDataService.get(id).then((res) => {
        const match = res.data[0]
        setMatchData({
          match_no: match.match_no,
          date: match.date,
          team_1: match.team_1,
          team_2: match.team_2,
          venue: match.venue,
          season_year: match.season_year
        })
      }).catch((error) => console.error(error))
    }

    TeamsDataService.getAll().then((res) => {
      setTeamList(res.data)
    }).catch((error) => console.error(error))
  }, [id])

  const handleSubmit = () => {
    if (matchData.match_no !== "0") {
      if (id !== undefined) {
        let data = { ...matchData, date: dateFormateSql(matchData.date) }
        MatchesDataService.update(id, data).then((res: any) => {
          navigate('/matches')
        }).catch((error) => console.error(error))
      } else {
        let data = { ...matchData, date: dateFormateSql(matchData.date) }
        MatchesDataService.create(data).then((res: any) => {
          navigate('/matches')
        }).catch((error) => {
          console.error(error)
        })
      }
    } else {
      toast.error(`0 Match number is default selected please change match number`, notificationConfig);
    }
  };

  const handlerChangeDate = (value: any) => {
    const dateFormate = dateFormateSql(value)

    setMatchData({
      ...matchData,
      date: dateFormate
    });
  }
  const handleChangeTeam1 = (event: any) => {
    setMatchData({
      ...matchData,
      team_1: event.target.value
    });

    if (matchData.team_2 !== "") {
      if (event.target.value === matchData.team_2) {
        setError(true);
      } else {
        setError(false);
      }
    }
  };
  const handleChangeTeam2 = (event: any) => {
    setMatchData({
      ...matchData,
      team_2: event.target.value
    });
    if (matchData.team_1 !== "") {
      if (event.target.value === matchData.team_1) {
        setError(true);
      } else {
        setError(false);
      }
    }
  };

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
                    type='number'
                    value={matchData.match_no}
                    onChange={(e: any) => setMatchData({ ...matchData, match_no: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="Season Year"
                    label="Season Year"
                    id="season_year"
                    type='number'
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
                      onChange={handleChangeTeam1}
                    >
                      {
                        teamList.map((team: any) => (
                          <MenuItem key={team.id} value={team.id}>
                            <div key={team.id} style={{ display: "flex", alignItems: "center", fontSize: 18 }}>
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
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Team 2</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={matchData.team_2}
                      label="Team 2"
                      onChange={handleChangeTeam2}
                    >
                      {
                        teamList.map((team: any) => (
                          <MenuItem key={team.id} value={team.id}>
                            <div key={team.id} style={{ display: "flex", alignItems: "center", fontSize: 18 }}>
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
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DemoContainer components={['DateTimePicker']}>
                      <DateTimePicker label="Date" defaultValue={matchData.date} onChange={handlerChangeDate} />
                    </DemoContainer>
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                  <Button variant="contained" onClick={handleSubmit} disabled={fieldDisable}>{id !== undefined ? 'Update' : 'Add'}</Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}