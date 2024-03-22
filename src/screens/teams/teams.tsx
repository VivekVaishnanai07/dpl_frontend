import { Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DeleteIcon from "../../assets/icon/delete";
import EditIcon from '../../assets/icon/edit';
import ConfirmDialog from '../../components/dialog-box/dialog-box';
import TeamsDataService from "../../service/teams.service";
import "./teams.css";

const Teams = () => {
  const token = localStorage.getItem('token') as any;
  const userData: any = jwtDecode(token);
  const navigate = useNavigate();
  const [emptyMessageBanner, setEmptyMessageBanner] = useState(false);
  const [teamList, setTeamList] = useState([]);
  const [open, setOpen] = useState(false);
  const [teamId, setTeamId] = useState<number>(0);

  useEffect(() => {
    getTeamsList()
  }, [])

  const getTeamsList = () => {
    TeamsDataService.getAll().then((response) => {
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

  const handlerEditMatch = (id: string) => {
    navigate(`/team/${id}`)
  }

  const handlerDeleteMatch = (id: number) => {
    TeamsDataService.delete(id).then((res) => {
      getTeamsList()
    })
    setOpen(false)
  }

  const handleClickOpen = (id: number) => {
    setOpen(true);
    setTeamId(id)
  };

  return (
    <div className="bottom-section-main">
      <div className="team-container">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <table style={{ maxWidth: "1100px" }}>
            <caption>Teams Table</caption>
            <thead>
              <tr>
                <th scope="col">No.</th>
                <th scope="col">Logo</th>
                <th scope="col">Full Name</th>
                <th scope="col">Short Name</th>
                {userData === 'admin' && <th scope="col"></th>}
              </tr>
            </thead>
            <tbody>
              {teamList.map((team: any, index: number) => (
                <tr key={index + 1}>
                  <td data-label="No.">{index + 1}</td>
                  <td data-label="Full Name">
                    <div className="img_box">
                      <img src={team.icon} alt="team_logo" style={{ width: 60 }} />
                    </div>
                  </td>
                  <td data-label="Full Name">{team.full_name}</td>
                  <td data-label="Short Name">{team.short_name}</td>
                  {userData === 'admin' && <td className='buttons'>
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
                  <td colSpan={userData === 'admin' ? 5 : 4}>
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

export default Teams;