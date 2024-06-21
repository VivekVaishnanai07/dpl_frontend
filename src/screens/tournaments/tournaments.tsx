import { Box, Grid } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import DeleteTeam from '../../assets/icon/delete';
import EditTeamIcon from "../../assets/icon/edit";
import MatchListIcon from "../../assets/icon/match-list";
import TeamIcon from "../../assets/icon/team";
import CricketIcon from "../../assets/img/cricket.png";
import ConfirmDialog from "../../components/dialog-box/confirm/confirm-dialog";
import UserContext from "../../context/user-context";
import TournamentService from "../../service/tournament.service";
import { JwtTokenDecode } from "../../types/auth";
import { biteCodeConvertIntoImg, notificationConfig } from "../../utils/util";
import './tournaments.css';

const Tournaments = () => {
  const token = localStorage.getItem('token') as string;
  const userData = jwtDecode(token) as JwtTokenDecode;
  const navigate = useNavigate();
  const { setTournamentId } = useContext(UserContext);
  const [emptyMessageBanner, setEmptyMessageBanner] = useState(false);
  const [tournamentsList, setTournamentsList] = useState([]);
  const [open, setOpen] = useState(false);
  const [id, setId] = useState<number>(0);

  useEffect(() => {
    getTournamentList()
    // eslint-disable-next-line
  }, [userData.id])

  const getTournamentList = () => {
    TournamentService.getAll(userData.id).then((res) => {
      if (res.data.length === 0) {
        setEmptyMessageBanner(true);
      } else {
        setEmptyMessageBanner(false)
      }
      setTournamentsList(res.data);
    }).catch((error) => {
      setEmptyMessageBanner(true);
      toast.error(error.response.data, notificationConfig);
    });
  }

  const handlerEditMatch = (id: number) => {
    navigate(`/tournament/${id}`)
  }

  const handlerDeleteMatch = (id: number) => {
    TournamentService.delete(id).then((res) => {
      toast.success(res.data.message, notificationConfig);
      getTournamentList()
    }).catch((err) => {
      toast.error(err.response.data.error, notificationConfig);
    })
    setOpen(false)
  }

  const handleClickOpen = (id: number) => {
    setOpen(true);
    setId(id)
  };

  return (
    <div className="tournament-container">
      <div style={{ maxWidth: "1250px", margin: "auto" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container className="justify-content-center" spacing={{ xs: 1 }} columns={{ xs: 4, sm: 6, md: 12 }}>
            {tournamentsList.map((item: any, index: number) => (
              <Grid item xs={2} sm={2} md={3} key={index + 1}>
                <div className="card">
                  <div className="card-info">
                    <img className="card-avatar" src={item.tournamentIcon !== null ? biteCodeConvertIntoImg(item.tournamentIcon.data) : CricketIcon} alt="tournament" />
                    <div className="card-title">{item.name} {item.year}</div>
                  </div>
                  <ul className="card-social">
                    {userData.role === 'admin' &&
                      <>
                        <li className="card-social__item"><EditTeamIcon onClick={() => handlerEditMatch(item.id)} className="edit" /></li>
                        <li className="card-social__item"><DeleteTeam onClick={() => handleClickOpen(item.id)} className="delete" /></li>
                      </>
                    }
                    <li className="card-social__item"><MatchListIcon onClick={() => {
                      navigate('/tournament/matches');
                      setTournamentId(item.id);
                    }} /></li>
                    <li className="card-social__item"><TeamIcon onClick={() => {
                      navigate('/tournament/teams');
                      setTournamentId(item.id);
                    }} /></li>
                  </ul>
                </div>
              </Grid>
            ))}
          </Grid>

          {
            emptyMessageBanner &&
            <div className='data-not-found'>Data Not Found</div>
          }
        </Box>
      </div>
      <ConfirmDialog id={id} open={open} setOpen={setOpen} handlerDeleteMatch={handlerDeleteMatch} />
    </div >
  )
}

export default Tournaments;