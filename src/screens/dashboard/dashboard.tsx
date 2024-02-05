import { Box, Grid } from "@mui/material";
import "./dashboard.css";
import Card from "../../components/card/card";
import { useEffect, useState } from "react";
import MatchesDataService from "../../service/matches.service";

const Dashboard = () => {
  const todayDateFormate = new Date().toISOString().split('T')[0];
  const [todayMatchList, setTodayMatchList] = useState([])
  const [futureMatchList, setFutureMatchList] = useState([])

  useEffect(() => {
    MatchesDataService.getAll().then((response: any) => {
      const filterTodayMatch = response.data.filter((item: any) => {
        const getDate = item.date.split('T')[0];
        return getDate === todayDateFormate;
      })
      setTodayMatchList(filterTodayMatch);
      const filterFutureMatch = response.data.filter((item: any) => {
        const futureDate = item.date.split('T')[0];
        return futureDate > todayDateFormate;
      });
      setFutureMatchList(filterFutureMatch);
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
              todayMatchList.map((match: any, index: number) => (
                <Grid item xs={2} sm={4} md={4} key={index + 1}>
                  <Card matchDetails={match} />
                </Grid>
              ))
            }
          </Grid>
          <Grid container columns={{ xs: 2, sm: 8, md: 12 }} sx={{ display: "flex", justifyContent: "center" }}>
            {
              futureMatchList.map((match: any, index: number) => (
                <Grid item xs={2} sm={4} md={4} key={index + 1}>
                  <Card matchDetails={match} />
                </Grid>
              ))
            }
          </Grid>
        </Box>
      </div>
    </div>
  )
}

export default Dashboard;