import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { toast } from 'react-toastify';
import TeamService from '../../service/teams.service';
import { notificationConfig } from '../../utils/util';


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function AddTeam() {
  const navigate = useNavigate();
  const { id }: any = useParams();
  const [teamData, setTeamData] = useState({
    full_name: "",
    short_name: "",
    icon: "",
    team_color: ""
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
          team_color: team.team_color
        })
      }).catch((error) => console.error(error))
    }
  }, [id])

  const handleSubmit = () => {
    if (id !== "add-team") {
      TeamService.update(id, teamData).then((res) => {
        toast.success(res.data.message, notificationConfig);
        navigate('/teams')
      }).catch((error) => {
        toast.error(error.response.data.error, notificationConfig);
      })
    } else {
      TeamService.create(teamData).then((res) => {
        toast.success(res.data.message, notificationConfig);
        navigate('/teams')
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
                  <label>Team Color</label>
                  <input
                    className='w-100'
                    type="color"
                    value={teamData.team_color}
                    onChange={(e) => setTeamData({ ...teamData, team_color: e.target.value })} />
                </Grid>
                <Grid item xs={12} style={{ display: "flex", justifyContent: "space-between" }}>
                  <Button variant="contained" color='inherit' onClick={() => navigate('/teams')} >Back</Button>
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