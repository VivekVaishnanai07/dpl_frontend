import { Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DeleteIcon from "../../assets/icon/delete";
import EditIcon from '../../assets/icon/edit';
import ConfirmDialog from '../../components/dialog-box/confirm/confirm-dialog';
import UserService from "../../service/users.service";
import { JwtTokenDecode } from "../../types/auth";
import { IUser } from "../../types/user";
import "./users.css";

const Users = () => {
  const navigate = useNavigate();
  const [emptyMessageBanner, setEmptyMessageBanner] = useState(false);
  const [userList, setUserList] = useState([]);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState<number>(0);
  const token = localStorage.getItem('token') as string;
  const userData: JwtTokenDecode = jwtDecode(token);


  useEffect(() => {
    getUsersList()
  }, [])

  const getUsersList = () => {
    UserService.getAll().then((response) => {
      if (response.data.length === 0) {
        setEmptyMessageBanner(true);
      } else {
        setEmptyMessageBanner(false)
      }
      setUserList(response.data)
    }).catch((error) => {
      setEmptyMessageBanner(true)
      console.error(error)
    })
  }

  const handlerEditMatch = (id: number) => {
    navigate(`/user/${id}`)
  }

  const handlerDeleteMatch = (id: number) => {
    UserService.delete(id).then((res) => {
      if (userData.id === id) {
        getUsersList();
        localStorage.clear();
        navigate('/login');
      }
    })
    setOpen(false)
  }

  const handleClickOpen = (id: number) => {
    setOpen(true);
    setUserId(id)
  };

  return (
    <div className="bottom-section-main bg">
      <div className="user-container">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <table style={{ maxWidth: "1100px" }}>
            <caption>Users Table</caption>
            <thead>
              <tr>
                <th scope="col">No.</th>
                <th scope="col">First Name</th>
                <th scope="col">Last Name</th>
                <th scope="col">Email</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user: IUser, index: number) => (
                <tr key={index + 1}>
                  <td data-label="ID">{index + 1}</td>
                  <td data-label="First Name">{user.first_name}</td>
                  <td data-label="Last Name">{user.last_name}</td>
                  <td data-label="Email">{user.email}</td>
                  <td className='buttons'>
                    <div id='edit' data-label="">
                      <Button onClick={() => handlerEditMatch(user.id)}>
                        <EditIcon />
                      </Button>
                    </div>
                    <div id='delete' data-label="">
                      <Button onClick={() => handleClickOpen(user.id)}>
                        <DeleteIcon />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
              {emptyMessageBanner && (
                <tr>
                  <td colSpan={5}>
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
      <ConfirmDialog id={userId} open={open} setOpen={setOpen} handlerDeleteMatch={handlerDeleteMatch} />
    </div>
  )
}

export default Users;