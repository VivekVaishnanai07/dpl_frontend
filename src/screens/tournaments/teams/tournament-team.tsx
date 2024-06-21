import { Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import DeleteIcon from "../../../assets/icon/delete";
import EditIcon from '../../../assets/icon/edit';
import ConfirmDialog from '../../../components/dialog-box/confirm/confirm-dialog';
import UserContext from "../../../context/user-context";
import TeamService from "../../../service/team.service";
import { JwtTokenDecode } from "../../../types/auth";
import { ITeam } from "../../../types/team";
import { notificationConfig } from "../../../utils/util";
import "../../teams/teams.css";

const TournamentTeams = () => {
  const navigate = useNavigate();
  const { tournamentId } = useContext(UserContext);
  const token = localStorage.getItem('token') as string;
  const userData = jwtDecode(token) as JwtTokenDecode;
  const [emptyMessageBanner, setEmptyMessageBanner] = useState(false);
  const [teamList, setTeamList] = useState([]);
  const [open, setOpen] = useState(false);
  const [teamId, setTeamId] = useState<number>(0);

  useEffect(() => {
    getTeamsList();
    // eslint-disable-next-line
  }, [])

  const getTeamsList = () => {
    TeamService.getAll(tournamentId).then((response) => {
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
    navigate(`/tournament/team/${id}`)
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
    <div className="bottom-section-main bg">
      <div className="team-container">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <table style={{ maxWidth: "1100px" }}>
            <caption>Tournament Table</caption>
            <thead>
              <tr>
                <th scope="col">No.</th>
                <th scope="col">Logo</th>
                <th scope="col">Full Name</th>
                <th scope="col">Short Name</th>
                {userData.role === 'admin' && <th scope="col"></th>}
              </tr>
            </thead>
            <tbody>
              {teamList.map((team: ITeam, index: number) => (
                <tr key={index + 1}>
                  <td data-label="No.">{index + 1}</td>
                  <td data-label="Full Name">
                    <div className="img_box">
                      <img src={team.icon} alt="team_logo" style={{ width: 60 }} />
                    </div>
                  </td>
                  <td data-label="Full Name">{team.full_name}</td>
                  <td data-label="Short Name">{team.short_name}</td>
                  {userData.role === 'admin' &&
                    <td className='horizontal-align'>
                      <div id='edit' data-label="">
                        <Button onClick={() => handlerEditMatch(team.id)}>
                          <EditIcon />
                        </Button>
                      </div>
                      <div id='delete' data-label="">
                        <Button onClick={() => handleClickOpen(team.id)}>
                          <DeleteIcon />
                        </Button>
                      </div>
                    </td>}
                </tr>
              ))}
              {emptyMessageBanner && (
                <tr>
                  <td colSpan={userData.role === 'admin' ? 5 : 4}>
                    <div id="main">
                      <div className="fof">
                        <h1>Data Not Found</h1>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <ConfirmDialog id={teamId} open={open} setOpen={setOpen} handlerDeleteMatch={handlerDeleteMatch} />
    </div >
  )
}

export default TournamentTeams;