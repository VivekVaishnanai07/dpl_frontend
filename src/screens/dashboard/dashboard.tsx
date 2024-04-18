import { Avatar, Box, Grid, Typography } from "@mui/material";
import { AxiosResponse } from "axios";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import FireIcon from "../../assets/icon/fire";
import AvatarImg from '../../assets/img/avatar.jpg';
import Card from "../../components/card/card";
import MatchService from "../../service/matches.service";
import playerLeaderboardService from "../../service/player-leaderboard.service";
import predictionAnalysisService from "../../service/prediction-analysis.service";
import { JwtTokenDecode } from "../../types/auth";
import { ApiResponse } from "../../types/common";
import { IMatch } from "../../types/match";
import { IPlayerLeaderboard } from "../../types/prediction";
import { biteCodeConvertIntoImg } from "../../utils/util";
import "./dashboard.css";

dayjs.extend(utc);

const Dashboard = () => {
  const navigate = useNavigate();
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

  useEffect(() => {
    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  useEffect(() => {
    if (getData) {
      getPlayerLeaderboardList();
      getMatchListData();
      checkPlayerStreak();
    } else {
      navigate('/');
    }
    // eslint-disable-next-line
  }, [])

  const getMatchListData = () => {
    MatchService.getDashboard(user_id).then((response: AxiosResponse<any, ApiResponse<IMatch[]>>) => {
      setMatchListData(response.data);
    }).catch((error) => {
      console.error(error)
    })
  }

  const getPlayerLeaderboardList = () => {
    playerLeaderboardService.getAll().then((response) => {
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

  const checkPlayerStreak = () => {
    predictionAnalysisService.getAll().then((response) => {
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

  return (
    <div className="bottom-section-main bg content-center">
      <div className="max-width">
        <Box className="dashboard_container" sx={{ flexGrow: 1, ml: 7, mr: 7 }}>
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
                          {parseFloat(item.win_percentage).toFixed(2)}%
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
              </table>
            </div>
          </Grid>
        </Box>
      </div>
    </div>
  )
}

export default Dashboard;