import dayjs from "dayjs";
import { useEffect, useState } from "react";
import statusDataService from "../../service/status.service";
import "./status.css";
import { Chip } from "@mui/material";

const Status = () => {
  let getData: any = localStorage.getItem('isLogin')
  let user = JSON.parse(getData)
  const [statusList, setstatusList] = useState([]);
  const [emptyMessageBanner, setEmptyMessageBanner] = useState(false);

  useEffect(() => {
    getPredictionList()
    // eslint-disable-next-line
  }, [])

  const getPredictionList = () => {
    statusDataService.get(user.id).then((response: any) => {
      if (response.data.length === 0) {
        setEmptyMessageBanner(true);
      } else {
        setEmptyMessageBanner(false)
      }
      setstatusList(response.data);
    }).catch((error) => {
      setEmptyMessageBanner(true)
      console.error(error)
    })
  }

  return (
    <div className="bottom-section-main">
      <div className="team-container">
        <table>
          <caption>Status Table</caption>
          <thead>
            <tr>
              <th id="table_row" scope="col">No.</th>
              <th id="table_row" scope="col">Match No.</th>
              <th id="table_row" scope="col">Team 1</th>
              <th id="table_row" scope="col">Team 2</th>
              <th id="table_row" scope="col">Venue</th>
              <th id="table_row" scope="col">Date</th>
              <th id="table_row" scope="col">Time</th>
              <th id="table_row" scope="col">Predict Team</th>
              <th id="table_row" scope="col">Win Team</th>
            </tr>
          </thead>
          <tbody>
            {statusList.map((stack: any, index: number) => (
              <tr key={index + 1}>
                <td id="table_row" data-label="No.">{index + 1}</td>
                <td id="table_row" data-label="Match No.">{stack.match_no}</td>
                <td id="table_row" data-label="Team 1">{stack.team_1}</td>
                <td id="table_row" data-label="Team 2">{stack.team_2}</td>
                <td id="table_row" data-label="Venue">{stack.venue}</td>
                <td id="table_row" data-label="Date">{dayjs(stack.date).format('DD/MM/YYYY')}</td>
                <td id="table_row" data-label="Time">{dayjs(stack.date).format('h:mm A')}</td>
                <td id="table_row" data-label="Predict Team">{stack.predict_team}</td>
                <td id="table_row" data-label="Won Team">{stack.winner_team ? stack.winner_team : <Chip label="Coming Soon " />}</td>
              </tr>
            ))}
            <tr>
              {emptyMessageBanner && (
                <td colSpan={9}>
                  <div id="main">
                    <div className="fof">
                      <h1>Data Not Found</h1>
                    </div>
                  </div>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Status;