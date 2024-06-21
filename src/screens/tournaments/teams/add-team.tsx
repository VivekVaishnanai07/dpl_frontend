import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import TeamService from '../../../service/team.service';
import TournamentService from '../../../service/tournament.service';
import { JwtTokenDecode } from '../../../types/auth';
import { notificationConfig } from '../../../utils/util';


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function AddTeam() {
  const token = localStorage.getItem('token') as string;
  const userData = jwtDecode(token) as JwtTokenDecode;
  const navigate = useNavigate();
  const { id }: any = useParams();
  const [tournamentList, setTournamentList] = useState([]);
  const [teamData, setTeamData] = useState({
    full_name: "",
    short_name: "",
    icon: "",
    team_color: "#000000",
    tournament_id: 0
  })

  let fieldDisable = !teamData.full_name || !teamData.short_name || !teamData.icon;

  useEffect(() => {
    if (id !== "add-team") {
      TeamService.get(id).then((res) => {
        const team = res.data[0]

        setTeamData({
          full_name: team.full_name,
          short_name: team.short_name,
          icon: team.icon,
          team_color: team.team_color,
          tournament_id: team.tournament_id
        })
      }).catch((error) => console.error(error))
    }
    getTournament()
    // eslint-disable-next-line 
  }, [id])

  const getTournament = () => {
    TournamentService.getAll(userData.id).then((res) => {
      if (res.data) {
        setTournamentList(res.data);
      }
    }).catch((error) => {
      toast.error(error.response.data, notificationConfig);
    })
  }

  const handleTournamentChange = (event: SelectChangeEvent) => {
    setTeamData({ ...teamData, tournament_id: parseInt(event.target.value) });
  };

  const handleSubmit = () => {
    if (id !== "add-team") {
      TeamService.update(id, teamData).then((res) => {
        toast.success(res.data.message, notificationConfig);
        navigate('/tournament/teams')
      }).catch((error) => {
        toast.error(error.response.data.error, notificationConfig);
      })
    } else {
      TeamService.create(teamData).then((res) => {
        toast.success(res.data.message, notificationConfig);
        navigate('/tournament/teams')
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
                    name="teamFullName"
                    required
                    fullWidth
                    id="teamFullName"
                    label="Team Full Name"
                    value={teamData.full_name}
                    onChange={(e) => setTeamData({ ...teamData, full_name: e.target.value })}
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="teamShortName"
                    label="Team Short Name"
                    name="teamShortName"
                    autoComplete="teamShortName"
                    value={teamData.short_name}
                    onChange={(e) => setTeamData({ ...teamData, short_name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="Icon"
                    label="Icon"
                    id="icon"
                    value={teamData.icon}
                    onChange={(e) => setTeamData({ ...teamData, icon: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">Tournaments</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      value={teamData.tournament_id.toString()}
                      label="Tournaments"
                      onChange={handleTournamentChange}
                      disabled={id !== "add-team" ? true : false}
                    >
                      <MenuItem value={0}>
                        <div style={{ display: "flex", alignItems: "center", fontSize: 16 }}>
                          Select a tournament
                        </div>
                      </MenuItem>
                      {tournamentList.map((item: any, index: number) => (
                        <MenuItem value={item.id} key={index + 1}>{item.name}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <label>Team Color</label>
                  <input
                    className='w-100'
                    type="color"
                    value={teamData.team_color}
                    onChange={(e) => setTeamData({ ...teamData, team_color: e.target.value })} />
                </Grid>
                <Grid item xs={12} style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button variant="contained" color='inherit' onClick={() => navigate('/tournament/teams')} >Back</Button>
                  <Button variant="contained" className='btn' onClick={handleSubmit} disabled={fieldDisable}>{id !== 'add-team' ? 'Update' : 'Add'}</Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}