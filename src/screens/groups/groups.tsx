import { Box, Grid } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import DeleteTeam from '../../assets/icon/delete';
import EditTeamIcon from "../../assets/icon/edit";
import GroupsIcon from "../../assets/img/groups.png";
import ConfirmDialog from "../../components/dialog-box/confirm/confirm-dialog";
import GroupService from "../../service/group.service";
import { JwtTokenDecode } from "../../types/auth";
import { notificationConfig } from "../../utils/util";
import "./groups.css";

const Groups = () => {
  const token = localStorage.getItem('token') as string;
  const userData = jwtDecode(token) as JwtTokenDecode;
  const navigate = useNavigate();
  const [emptyMessageBanner, setEmptyMessageBanner] = useState(false);
  const [groupsList, setGroupsList] = useState([]);
  const [open, setOpen] = useState(false);
  const [groupId, setGroupId] = useState<number>(0);

  useEffect(() => {
    getGroupList()
    // eslint-disable-next-line
  }, [])

  const getGroupList = () => {
    GroupService.getAll(userData.id).then((res) => {
      if (res.data.length === 0) {
        setEmptyMessageBanner(true);
      } else {
        setEmptyMessageBanner(false)
      }
      setGroupsList(res.data);
    }).catch((error) => {
      setEmptyMessageBanner(true);
      console.error(error)
    });
  }

  const handlerDeleteMatch = (id: number) => {
    GroupService.delete(id).then((res) => {
      toast.success(res.data.message, notificationConfig);
      getGroupList()
    }).catch((err) => {
      toast.error(err.response.data.error, notificationConfig);
    })
    setOpen(false)
  }

  const handleClickOpen = (id: number) => {
    setOpen(true);
    setGroupId(id)
  };

  return (
    <div className="tournament-container">
      <div style={{ maxWidth: "1250px", margin: "auto" }}>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container className="justify-content-center" spacing={{ xs: 1 }} columns={{ xs: 4, sm: 6, md: 12 }}>
            {groupsList.map((item: any, index: number) => (
              <Grid item xs={2} sm={2} md={3} key={index + 1}>
                <div className="card">
                  <div className="card-info">
                    <img className="card-avatar outline-4" src={GroupsIcon} alt="groups" />
                    <div className="card-title">{item.name}</div>
                  </div>
                  {userData.role === 'admin' &&
                    <ul className="card-social">
                      <li className="card-social__item"><EditTeamIcon onClick={() => navigate(`/group/${item.id}`)} className="edit" /></li>
                      <li className="card-social__item"><DeleteTeam onClick={() => handleClickOpen(item.id)} className="delete" /></li>
                    </ul>
                  }
                </div>
              </Grid>
            ))}
          </Grid>
          {
            emptyMessageBanner &&
            <div className='not-found'>Data Not Found</div>
          }
        </Box>
      </div>
      <ConfirmDialog id={groupId} open={open} setOpen={setOpen} handlerDeleteMatch={handlerDeleteMatch} />
    </div>
  )
}

export default Groups;