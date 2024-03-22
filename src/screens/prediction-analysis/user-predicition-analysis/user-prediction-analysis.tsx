import { Chip } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import predictionAnalysisDataService from "../../../service/prediction-analysis.service";
import "./user-prediction-analysis.css";

const UserPredictionAnalysis = () => {
  const { id }: any = useParams();
  const location = useLocation();
  const state = location.state;
  const [predictionAnalysisList, setPredictionAnalysisList] = useState([]);
  const [emptyMessageBanner, setEmptyMessageBanner] = useState(false);

  useEffect(() => {
    getPredictionList()
    // eslint-disable-next-line
  }, [])

  const getPredictionList = () => {
    predictionAnalysisDataService.get(id).then((response: any) => {
      if (response.data.length === 0) {
        setEmptyMessageBanner(true);
      } else {
        setEmptyMessageBanner(false)
      }
      setPredictionAnalysisList(response.data);
    }).catch((error) => {
      setEmptyMessageBanner(true)
      console.error(error)
    })
  }

  return (
    <div className="bottom-section-main">
      <div className="team-container">
        <table>
          <caption>{state.name} Prediction Table</caption>
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
              <th id="table_row" scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {predictionAnalysisList.map((item: any, index: number) => (
              <tr key={index + 1}>
                <td id="table_row" data-label="No.">{index + 1}</td>
                <td id="table_row" data-label="Match No.">{item.match_no}</td>
                <td id="table_row" data-label="Team 1">{item.team_1}</td>
                <td id="table_row" data-label="Team 2">{item.team_2}</td>
                <td id="table_row" data-label="Venue">{item.venue}</td>
                <td id="table_row" data-label="Date">{dayjs(item.date).format('DD/MM/YYYY')}</td>
                <td id="table_row" data-label="Time">{dayjs(item.date).format('h:mm A')}</td>
                <td id="table_row" data-label="Predict Team">{item.predict_team ? item.predict_team : '-'}</td>
                <td id="table_row" data-label="Won Team">{item.winner_team ? item.winner_team : <Chip label="Coming Soon " />}</td>
                <td id="table_row" data-label="">
                  {item.status === "true" ?
                    <span className="rf W ih-pt-g">W</span> :
                    <span className="rf L ih-pt-r">L</span>
                  }
                </td>
              </tr>
            ))}
            {emptyMessageBanner && (
              <tr>
                <td colSpan={10}>
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
  )
}

export default UserPredictionAnalysis;