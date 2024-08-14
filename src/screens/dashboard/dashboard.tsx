import { Avatar, Box, FormControl, Grid, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { AxiosResponse } from "axios";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import { jwtDecode } from "jwt-decode";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import FireIcon from "../../assets/icon/fire";
import AvatarImg from '../../assets/img/avatar.jpg';
import Card from "../../components/card/card";
import UserContext from "../../context/user-context";
import MatchService from "../../service/match.service";
import playerLeaderboardService from "../../service/player-leaderboard.service";
import predictionAnalysisService from "../../service/prediction-analysis.service";
import TournamentService from "../../service/tournament.service";
import { JwtTokenDecode } from "../../types/auth";
import { ApiResponse } from "../../types/common";
import { IMatch } from "../../types/match";
import { IPlayerLeaderboard } from "../../types/prediction";
import { biteCodeConvertIntoImg, notificationConfig } from "../../utils/util";
import "./dashboard.css";

dayjs.extend(utc);

const Dashboard = () => {
  const navigate = useNavigate();
  const { setGroupId, setTournamentId } = useContext(UserContext);
  let getData = localStorage.getItem('token') as string;
  let userData = jwtDecode(getData) as JwtTokenDecode;
  let user_id = userData.id;
  const [isOpen, setIsOpen] = useState(false)
  const [matchListData, setMatchListData] = useState([]);
  const [emptyMessageBanner, setEmptyMessageBanner] = useState(false);
  const [playerStreakList, setPlayerStreakList] = useState([]);
  const [playerLeaderboardList, setPlayerLeaderboardList] = useState([]);
  const [width, setWidth] = useState(window.innerWidth);
  const [imgUrl, setImgUrl] = useState<any>(null);
  const [tournamentList, setTournamentList] = useState([]);
  const [tournamentValue, setTournamentValue] = useState<any>(null);
  const [groupsList, setGroupsList] = useState([]);
  const [groupsValue, setGroupsValue] = useState<any>(null);

  useEffect(() => {
    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  useEffect(() => {
    if (getData) {
      getTournament();
    } else {
      navigate('/');
    }
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (tournamentValue && groupsValue) {
      getPlayerLeaderboardList(tournamentValue.id, groupsValue.id);
      checkPlayerStreak(tournamentValue.id, groupsValue.id);
      getMatchListData(user_id);
    }
    // eslint-disable-next-line
  }, [user_id, tournamentValue, groupsValue])

  const getTournament = () => {
    TournamentService.getByUserAll(userData.id).then((res) => {
      if (res.data) {
        let findActiveTournament = res.data.find((item: any) => item.status === 'Active');
        if (findActiveTournament) {
          setTournamentList(findActiveTournament);
          setGroupsList(findActiveTournament.group_details);
          setTournamentValue(findActiveTournament);
          setTournamentId(findActiveTournament.id);
          setGroupsValue(findActiveTournament.group_details[0]);
          setGroupId(findActiveTournament.group_details[0].id)
        } else {
          setTournamentList(res.data[0]);
          setTournamentValue(res.data[0]);
          setTournamentId(res.data[0].id);
          setGroupsList(res.data[0].group_details);
          setGroupsValue(res.data[0].group_details[0]);
          setGroupId(res.data[0].group_details[0].id)
        }
      }
    }).catch((error) => {
      toast.error(error.response.data, notificationConfig);
    })
  }

  const getMatchListData = (userId: number) => {
    MatchService.getDashboard(userId).then((response: AxiosResponse<any, ApiResponse<IMatch[]>>) => {
      setMatchListData(response.data);
    }).catch((error) => {
      console.error(error)
    })
  }

  const getPlayerLeaderboardList = (tournamentId: number, groupId: number) => {
    if (!tournamentId || !groupId) {
      setEmptyMessageBanner(true);
      return;
    }

    playerLeaderboardService.getAll(tournamentId, groupId).then((response) => {
      if (response.data.length === 0) {
        setEmptyMessageBanner(true);
      } else {
        setEmptyMessageBanner(false)
      }
      setPlayerLeaderboardList(response.data)
    }).catch((error) => {
      setEmptyMessageBanner(true);
      console.error(error)
    })
  }

  const checkPlayerStreak = (tournamentId: number, groupId: number) => {
    predictionAnalysisService.getAll(tournamentId, groupId).then((response) => {
      if (response.data) {
        setPlayerStreakList(response.data);
      }
    }).catch((error) => {
      console.error(error);
    });
  }

  const showPlayerStreak = (playerName: string) => {
    let playerStatus = false;

    const sortedPredictionAnalysisData = playerStreakList.map((user: any) => ({
      ...user,
      match_details: user.match_details.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime())
    }));

    sortedPredictionAnalysisData.forEach((user: any) => {
      if (user.full_name === playerName) {
        const lastThreeMatches = user.match_details.slice(-3);
        const statusArray = lastThreeMatches.map((match: any) => match.status === "true");
        const status = statusArray.every((status: any) => status === true);
        playerStatus = status;
      }
    });

    return playerStatus;
  }

  const updateWidth = () => {
    setWidth(window.innerWidth);
  };

  const showModal = (img: any) => {
    setIsOpen(true);
    if (img !== null) {
      const imgUrlData = biteCodeConvertIntoImg(img.data);
      setImgUrl(imgUrlData);
    } else {
      setImgUrl(AvatarImg);
    }
  }

  const calculateTotalPayMoney = (playerList: IPlayerLeaderboard[]) => {
    let totalPayMoney = playerList.reduce((total: any, item: IPlayerLeaderboard) => total + parseFloat(item.pay_money), 0);
    return totalPayMoney;
  }

  const handleSelectionChange = (event: any, type: string) => {
    const value = event.target.value;
    if (type === 'tournament') {
      setTournamentValue(value);
      setTournamentId(value.id);
    } else if (type === 'group') {
      setGroupsValue(value);
      setGroupId(value.id);
    }
  };


  return (
    <div className="bottom-section-main bg content-center">
      <div className="max-width">
        <Box className="dashboard_container" sx={{ flexGrow: 1, ml: 7, mr: 7 }}>
          {tournamentList.length > 1 &&
            <div className='filter-tournament-groups'>
              {tournamentList.length > 1 &&
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-label">Tournaments</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={tournamentValue}
                    label="Tournaments"
                    onChange={(event) => handleSelectionChange(event, 'tournament')}
                  >
                    {tournamentList.map((item: any, index: number) => (
                      <MenuItem value={item.id} key={index + 1}>{item.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              }
              {groupsList.length > 1 &&
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-label">Groups</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={groupsValue}
                    label="Tournaments"
                    onChange={(event) => handleSelectionChange(event, 'group')}
                  >
                    {groupsList.map((item: any, index: number) => (
                      <MenuItem value={item.id} key={index + 1}>{item.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              }
            </div>
          }
          {matchListData.length > 0 && <Grid container columns={{ xs: 2, sm: 8, md: 12 }} sx={{ display: "flex", justifyContent: "center" }}>
            {
              matchListData.map((match: IMatch, index: number) => (
                <Grid item xs={2} sm={4} md={4} key={index + 1}>
                  <Card matchDetails={match} />
                </Grid>
              ))
            }
          </Grid>}
          {isOpen && (
            <div className="modal">
              <span className="close" onClick={() => setIsOpen(false)}>
                &times;
              </span>
              <img className="modal-content" src={imgUrl ? imgUrl : ''} alt="avatar" />
            </div>
          )}
          <Grid container columns={{ xs: 2, sm: 8, md: 12 }} sx={{ display: "flex", justifyContent: "center" }}>
            <div className="player-leaderboard-container">
              <table>
                <caption>Player Leaderboard</caption>
                <thead>
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col" className="text-align-left">Player Name</th>
                    <th scope="col">Win</th>
                    <th scope="col">Lost</th>
                    <th scope="col">To Pay Money</th>
                    <th scope="col">Win Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {playerLeaderboardList.map((item: IPlayerLeaderboard, index: number) => (
                    <tr key={index + 1}>
                      {width > 767 && <td data-label="No.">{index + 1}</td>}
                      <td className="align-center" style={{ backgroundColor: (width < 767) ? parseFloat(item.win_percentage) >= 60 ? '#6cb33e' : '#d14242' : '#ffffff' }}>
                        <Avatar alt='avatar' onClick={() => showModal(item.userImg)} className='profileAvatar avatar-title mr-4' src={item.userImg !== null ? biteCodeConvertIntoImg(item.userImg.data) : AvatarImg} />
                        <Typography className="name-text">{item.full_name}</Typography>
                      </td>
                      <td data-label="Win">
                        <span>{item.win_matches}</span>
                      </td>
                      <td data-label="Lost">{item.lose_matches}</td>
                      <td data-label="To Pay Money">{item.pay_money}</td>
                      <td className={parseFloat(item.win_percentage) >= 60 ? 'green-text' : 'red-text'} data-label="Win Percentage">
                        <span className="match-streak">
                          {item.win_percentage ? parseFloat(item.win_percentage).toFixed(2) : 0}%
                          {showPlayerStreak(item.full_name) &&
                            <FireIcon width="16px" height="16px" />
                          }
                        </span>
                      </td>
                    </tr>
                  ))}
                  {emptyMessageBanner && (
                    <tr>
                      <td colSpan={6}>
                        <div id="main">
                          <div className="fof">
                            <h1>Data Not Found</h1>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
                {playerLeaderboardList && <tfoot>
                  <tr className="table-footer">
                    {(width > 767) && <td colSpan={3}></td>}
                    <td className="fw-600">Total :</td>
                    <td className="fw-600">{calculateTotalPayMoney(playerLeaderboardList)}</td>
                    {(width > 767) && <td></td>}
                  </tr>
                </tfoot>}
              </table>
            </div>
          </Grid>
        </Box>
      </div>
    </div>
  )
}

export default Dashboard;