import { Box, Grid } from "@mui/material";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import FireIcon from "../../assets/icon/fire";
import Card from "../../components/card/card";
import MatchesDataService from "../../service/matches.service";
import playerLeaderboardDataService from "../../service/player-leaderboard.service";
import "./dashboard.css";

dayjs.extend(utc);

const Dashboard = () => {
  let getData: any = localStorage.getItem('token');
  let userData: any = jwtDecode(getData) as any;
  let user_id = userData.id;
  const [matchListData, setMatchListData] = useState([]);
  const [emptyMessageBanner, setEmptyMessageBanner] = useState(false);
  const [playerLeaderboardList, setPlayerLeaderboardList] = useState([]);

  useEffect(() => {
    getPlayerLeaderboardList();
    MatchesDataService.getDashboard(user_id).then((response: any) => {
      setMatchListData(response.data);
    }).catch((error) => {
      console.error(error)
    })
  }, [user_id])

  const getPlayerLeaderboardList = () => {
    playerLeaderboardDataService.getAll().then((response) => {
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

  return (
    <div className="bottom-section-main wrulf-bg">
      <div>
        <Box className="dashboard_container" sx={{ flexGrow: 1, mt: 23.5, ml: 7, mr: 7 }}>
          {matchListData.length > 0 && <Grid container columns={{ xs: 2, sm: 8, md: 12 }} sx={{ display: "flex", justifyContent: "center" }}>
            {
              matchListData.map((match: any, index: number) => (
                <Grid item xs={2} sm={4} md={4} key={index + 1}>
                  <Card matchDetails={match} />
                </Grid>
              ))
            }
          </Grid>}
          <Grid container columns={{ xs: 2, sm: 8, md: 12 }} sx={{ display: "flex", justifyContent: "center" }}>
            <div className="player-leaderboard-container">
              <table>
                <caption>Player Leaderboard</caption>
                <thead>
                  <tr>
                    <th scope="col">No.</th>
                    <th scope="col">Player Name</th>
                    <th scope="col">Win</th>
                    <th scope="col">Lost</th>
                    <th scope="col">Upcoming</th>
                    <th scope="col">Total</th>
                    <th scope="col">To Pay Money</th>
                  </tr>
                </thead>
                <tbody>
                  {playerLeaderboardList.map((item: any, index: number) => (
                    <tr key={index + 1}>
                      <td data-label="No.">{index + 1}</td>
                      <td data-label="Player Name">{item.full_name}</td>
                      <td className="match-streak" data-label="Win">
                        <span>{item.win_matches}</span>
                        {/* {item.streak === 'Up' && <FireIcon width="16px" height="16px" />} */}
                      </td>
                      <td data-label="Lost">{item.total_lose_matches}</td>
                      <td data-label="Upcoming">{item.upcoming_matches}</td>
                      <td data-label="Total">{item.total_matches}</td>
                      <td data-label="To Pay Money">{item.to_pay_money}</td>
                    </tr>
                  ))}
                  {emptyMessageBanner && (
                    <tr>
                      <td colSpan={7}>
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