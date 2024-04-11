import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { Box, Grid } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import EditTeamIcon from "../../assets/icon/edit-team-icon";
import IplLogo from "../../assets/img/new-logo.png";
import TeamTrophy from "../../assets/img/teams-trophy.svg";
import ConfirmDialog from '../../components/dialog-box/confirm/confirm-dialog';
import TeamService from "../../service/teams.service";
import { JwtTokenDecode } from "../../types/auth";
import { ITeam } from "../../types/team";
import { biteCodeConvertIntoImg, notificationConfig } from "../../utils/util";
import "./teams.css";

const Teams = () => {
  const token = localStorage.getItem('token') as string;
  const userData = jwtDecode(token) as JwtTokenDecode;
  const navigate = useNavigate();
  const [emptyMessageBanner, setEmptyMessageBanner] = useState(false);
  const [teamList, setTeamList] = useState([]);
  const [open, setOpen] = useState(false);
  const [teamId, setTeamId] = useState<number>(0);

  useEffect(() => {
    getTeamsList()
    // eslint-disable-next-line
  }, [])

  const getTeamsList = () => {
    TeamService.getAll().then((response) => {
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

  const handlerEditMatch = (id: number) => {
    navigate(`/team/${id}`)
  }

  const handlerDeleteMatch = (id: number) => {
    TeamService.delete(id).then((res) => {
      getTeamsList()
    }).catch((err) => {
      toast.error(err.response.data.error, notificationConfig);
    })
    setOpen(false)
  }

  const handleClickOpen = (id: number) => {
    setOpen(true);
    setTeamId(id)
  };

  return (
    <div className="team-container-background">
      <div className="horizontal-align">
        <img src={IplLogo} className="ipl_logo" alt="ipl2024" />
      </div>
      <div className="team-container">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div style={{ maxWidth: "1250px" }}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container className="justify-content-center" spacing={{ xs: 1 }} columns={{ xs: 4, sm: 6, md: 12 }}>
                {teamList.map((team: ITeam, index: number) => (
                  <Grid item xs={2} sm={2} md={3} key={index}>
                    <div key={team.id} className={`team_${team.short_name.toLowerCase()}`}>
                      <a className="w-100">
                        <div className="d-flex flex-wrap justify-content-center">
                          <div className="team-logo">
                            <img src={biteCodeConvertIntoImg(team.team_img.data)} alt="" />
                          </div>
                          <div className="hover_team_logo_and_name">
                            <img src={biteCodeConvertIntoImg(team.team_img.data)} alt="" />
                            <span>{team.short_name}</span>
                          </div>
                          {userData.role === 'admin' && <div className="edit-icon" onClick={() => handlerEditMatch(team.id)}><EditTeamIcon /></div>}
                          {userData.role === 'admin' && <div className="delete-icon" onClick={() => handleClickOpen(team.id)}><DeleteOutlineOutlinedIcon className="delete" /></div>}
                          <div className="team_full_name">
                            <div>{team.full_name}</div>
                          </div>
                        </div>
                        <div className="team-on-hover">
                          <img src={TeamTrophy} alt="" />
                          <div className="trophy-text-align">
                            {team.winner_years ? team.winner_years.replace(/,/g, ' | ') : ''}
                          </div>
                        </div>
                      </a>
                    </div>
                  </Grid>
                ))}
              </Grid>
            </Box>
            {
              emptyMessageBanner &&
              <div className='data-not-found'>Data Not Found</div>
            }
          </div>
        </div>
      </div>
      <ConfirmDialog id={teamId} open={open} setOpen={setOpen} handlerDeleteMatch={handlerDeleteMatch} />
    </div >
  )
}

export default Teams;