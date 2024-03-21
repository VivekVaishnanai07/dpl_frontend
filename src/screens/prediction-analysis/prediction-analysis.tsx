import { IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import ViewMoreIcon from "../../assets/icon/view-more";
import predictionAnalysisDataService from "../../service/prediction-analysis.service";
import "./prediction-analysis.css";

const PredictionAnalysis = () => {
  const navigate = useNavigate();
  const [usersPredictionAnalysisList, setUsersPredictionAnalysisList] = useState([]);
  const [emptyMessageBanner, setEmptyMessageBanner] = useState(false);

  useEffect(() => {
    getUsersPredictionList()
    // eslint-disable-next-line
  }, [])

  const getUsersPredictionList = () => {
    predictionAnalysisDataService.getAll().then((response: any) => {
      if (response.data.length === 0) {
        setEmptyMessageBanner(true);
      } else {
        setEmptyMessageBanner(false)
      }
      setUsersPredictionAnalysisList(response.data);
    }).catch((error) => {
      setEmptyMessageBanner(true)
      console.error(error)
    })
  }

  return (
    <div className="bottom-section-main">
      <div className="team-container">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <table style={{ maxWidth: "1000px" }}>
            <caption>Player Prediction Analysis</caption>
            <thead>
              <tr>
                <th scope="col">No.</th>
                <th scope="col">Players</th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {usersPredictionAnalysisList && usersPredictionAnalysisList.map((item: any, index: number) => (
                <tr key={index + 1}>
                  <td data-label="No.">{index + 1}</td>
                  <td data-label="Match No.">{item.full_name}</td>
                  <td data-label="">
                    <div className="d-flex justify-content-center">
                      {item.match_details && item.match_details.map((data: any, i: number) => (
                        <div key={i + 1}>
                          {data.status === "true" ?
                            <span className="rf W ih-pt-g">W</span> :
                            <span className="rf L ih-pt-r">L</span>}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="d-flex justify-content-center align-items-center" data-label="">
                    <IconButton onClick={() => navigate(`/prediction-analysis/${item.user_id}`)}>
                      <ViewMoreIcon />
                    </IconButton>
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
    </div>
  )
}

export default PredictionAnalysis;