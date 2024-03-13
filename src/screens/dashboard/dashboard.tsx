import { Box, Grid } from "@mui/material";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import { useEffect, useState } from "react";
import Card from "../../components/card/card";
import MatchesDataService from "../../service/matches.service";
import "./dashboard.css";

dayjs.extend(utc);

const Dashboard = () => {
  let getData: any = localStorage.getItem('isLogin')
  let user = JSON.parse(getData)
  let user_id = JSON.stringify(user.id)
  const [matchListData, setMatchListData] = useState([])

  useEffect(() => {
    MatchesDataService.getDashboard(user_id).then((response: any) => {
      setMatchListData(response.data);
    }).catch((error) => {
      console.error(error)
    })
  }, [])

  return (
    <div className="bottom-section-main">
      <div>
        <Box className="dashboard_container" sx={{ flexGrow: 1, mt: 25, ml: 7, mr: 7 }}>
          <Grid container columns={{ xs: 2, sm: 8, md: 12 }} sx={{ display: "flex", justifyContent: "center" }}>
            {
              matchListData.map((match: any, index: number) => (
                <Grid item xs={2} sm={4} md={4} key={index + 1}>
                  <Card matchDetails={match} />
                </Grid>
              ))
            }
          </Grid>
          {/* <Grid container columns={{ xs: 2, sm: 8, md: 12 }} sx={{ display: "flex", justifyContent: "center" }}>
            {
              futureMatchList.map((match: any, index: number) => (
                <Grid item xs={2} sm={4} md={4} key={index + 1}>
                  <Card matchDetails={match} />
                </Grid>
              ))
            }
          </Grid> */}
        </Box>
      </div>
    </div>
  )
}

export default Dashboard;