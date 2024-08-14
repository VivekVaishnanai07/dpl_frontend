import { Box, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DuckImg from "../../assets/img/duck.gif";
import IplLogo from "../../assets/img/new-logo.png";
import TeamTrophy from "../../assets/img/teams-trophy.svg";
import TeamService from "../../service/team.service";
import TournamentService from "../../service/tournament.service";
import { JwtTokenDecode } from "../../types/auth";
import { ITeam } from "../../types/team";
import { biteCodeConvertIntoImg, notificationConfig } from "../../utils/util";
import "./teams.css";

const Teams = () => {
  const token = localStorage.getItem('token') as string;
  const userData = jwtDecode(token) as JwtTokenDecode;
  const [emptyMessageBanner, setEmptyMessageBanner] = useState(false);
  const [teamList, setTeamList] = useState([]);
  const [tournamentList, setTournamentList] = useState([]);
  const [filterTournament, setFilterTournament] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    getTournament();
    // eslint-disable-next-line
  }, [])

  const getTeamsList = (id: number) => {
    TeamService.getAll(id).then((response) => {
      if (response.data.length === 0) {
        setEmptyMessageBanner(true);
      } else {
        setEmptyMessageBanner(false)
      }
      setTeamList(response.data)
    }).catch((error) => {
      setEmptyMessageBanner(true);
      console.error(error)
    })
  }

  const getTournament = () => {
    TournamentService.getByUserAll(userData.id).then((res) => {
      if (res.data) {
        setTournamentList(res.data);
        let getActiveTournament = res.data.find((item: any) => item.status === "Active");
        if (!getActiveTournament) {
          setFilterTournament(res.data[0].id);
          getTeamsList(res.data[0].id);
        } else {
          setFilterTournament(getActiveTournament.id);
          getTeamsList(getActiveTournament.id);
        }
      }
    }).catch((error) => {
      toast.error(error.response.data, notificationConfig);
    })
  }

  const handleChange = (event: SelectChangeEvent) => {
    setFilterTournament(event.target.value);
    getTeamsList(parseInt(event.target.value));
  };

  return (
    <div className="team-container-background">
      {tournamentList.length > 1 &&
        <div className='team-header'>
          <FormControl sx={{ m: 1, minWidth: 120 }}>
            <InputLabel id="demo-simple-select-label">Tournaments</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterTournament}
              label="Tournaments"
              onChange={handleChange}
            >
              {tournamentList.map((item: any, index: number) => (
                <MenuItem value={item.id} key={index + 1}>{item.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
      }
      <div className="teams-header-bg">
        <div className="horizontal-align teams-tata-logo">
          <img src={IplLogo} className="ipl_logo" alt="ipl2024" />
        </div>
        <div className="teams-text-img">TEAMS</div>
      </div>
      <div className="team-container">
        <div style={{ display: teamList.length > 4 ? "flex" : "block", justifyContent: teamList.length > 4 ? "center" : "" }}>
          <div style={{ maxWidth: "1250px" }}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container className="justify-content-center" spacing={{ xs: 1 }} columns={{ xs: 4, sm: 6, md: 12 }}>
                {teamList.map((team: ITeam, index: number) => (
                  <Grid item xs={2} sm={2} md={3} key={index}>
                    <div key={team.id} className={`team_${team.short_name.toLowerCase()}`}>
                      <div className="team_container w-100">
                        <div className="d-flex flex-wrap justify-content-center">
                          <div className="team-logo">
                            <img src={biteCodeConvertIntoImg(team.team_img.data)} alt="" />
                          </div>
                          <div className="hover_team_logo_and_name">
                            <img src={biteCodeConvertIntoImg(team.team_img.data)} alt="" />
                            <span>{team.short_name}</span>
                          </div>
                          <div className="team_full_name">
                            <div>{team.full_name}</div>
                          </div>
                        </div>
                        <div className='duck-container'>
                          <img className="duck" src={DuckImg} alt='duck' />
                        </div>
                        <div className="team-on-hover">
                          <img src={TeamTrophy} alt="" />
                          <div className="trophy-text-align">
                            {team.winner_years ? team.winner_years.split(",").sort((a, b) => parseInt(a) - parseInt(b)).join(",").replace(/,/g, ' | ') : ''}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Grid>
                ))}
              </Grid>
            </Box>
            {
              emptyMessageBanner &&
              <div className='data-not-found text-align-center'>Data Not Found</div>
            }
          </div>
        </div>
      </div>
    </div >
  )
}

export default Teams;