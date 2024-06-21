import { AxiosResponse } from "axios";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router";
import predictionAnalysisService from "../../../service/prediction-analysis.service";
import { ApiResponse } from "../../../types/common";
import { IPredictionAnalysis } from "../../../types/prediction";
import "./user-prediction-analysis.css";

const UserPredictionAnalysis = () => {
  const { userId, groupId }: any = useParams();
  const location = useLocation();
  const state = location.state;
  const [predictionAnalysisList, setPredictionAnalysisList] = useState([]);
  const [emptyMessageBanner, setEmptyMessageBanner] = useState(false);
  const tableRef = useRef<any>(null);

  useEffect(() => {
    getPredictionList()
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    scrollToDate();
    // eslint-disable-next-line
  }, [predictionAnalysisList]);

  const getPredictionList = () => {
    predictionAnalysisService.get(userId, groupId).then((response: AxiosResponse<any, ApiResponse<IPredictionAnalysis[]>>) => {
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

  const scrollToDate = () => {
    const today = dayjs().format('DD/MM/YYYY');
    const todayRowIndex = predictionAnalysisList.findIndex((item: any) => dayjs(item.date).format('DD/MM/YYYY') === today);
    if (todayRowIndex !== -1) {
      const rowElement = tableRef.current.querySelector(`tbody tr:nth-child(${todayRowIndex + 1})`);
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="bottom-section-main bg">
      <div className="team-container horizontal-align">
        <table ref={tableRef} style={{ maxWidth: '1100px' }}>
          <caption>{state.name} Prediction Table</caption>
          <thead>
            <tr>
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
                <td id="table_row" data-label="Match No.">{item.match_no}</td>
                <td id="table_row" data-label="Team 1">{item.team_1}</td>
                <td id="table_row" data-label="Team 2">{item.team_2}</td>
                <td id="table_row" data-label="Venue">{item.venue}</td>
                <td id="table_row" data-label="Date">{dayjs(item.date).format('DD/MM/YYYY')}</td>
                <td id="table_row" data-label="Time">{dayjs(item.date).format('h:mm A')}</td>
                <td id="table_row" data-label="Predict Team">{item.predict_team ? item.predict_team : '-'}</td>
                <td id="table_row" data-label="Won Team">{item.winner_team ? item.winner_team : '-'}</td>
                <td id="table_row" data-label="">
                  {item.status === "true" && <span className="winner_lost_pending_farm winner">W</span>}
                  {(item.status === "false" && item.winner_team !== null) && <span className="winner_lost_pending_farm lost">L</span>}
                  {(item.status === "false" && item.winner_team === null) && <span className="winner_lost_pending_farm pending">-</span>}
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