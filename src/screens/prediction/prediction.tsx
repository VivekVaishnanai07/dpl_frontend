import { Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import StadiumIcon from "../../assets/icon/stadium";
import MatchesDataService from "../../service/matches.service";
import PredictionDataService from "../../service/prediction.service";
import { notificationConfig } from "../../utils/util";
import "./prediction.css";

const Prediction = () => {
  let navigate = useNavigate();
  let { id }: any = useParams();
  let getData: any = localStorage.getItem('token');
  let user: any = jwtDecode(getData) as any;
  let user_id = user.id;

  const [predictionId, setPredictionId] = useState('');
  const [matchDetails, setMatchDetails] = useState<any>({});
  const [defaultTeamId, setDefaultTeamId] = useState<any>(0);
  const [selectedTeam, setSelectedTeam] = useState<string>('')

  useEffect(() => {
    getPredictionData(user_id, id);
    matchDetailsData(id);
  }, [user_id, id])

  const getPredictionData = (user_id: any, id: any) => {
    PredictionDataService.get(user_id, id).then((res) => {
      const data = res.data[0];
      if (data !== undefined) {
        let pId: string = JSON.stringify(data.id);
        setPredictionId(pId);
        let id = JSON.stringify(data.team_id);
        setSelectedTeam(id);
        setDefaultTeamId(id);
      }
    }).catch((error) => console.error(error));
  }

  const matchDetailsData = (id: any) => {
    MatchesDataService.getPredictionDetailsById(id).then((response) => {
      setMatchDetails(response.data[0]);
    }).catch((error) => console.error(error))
  }

  const handlerChange = (e: any) => {
    setSelectedTeam(e.target.value);
  }

  let teamOne = JSON.stringify(matchDetails.team_1_id)
  let teamTwo = JSON.stringify(matchDetails.team_2_id)

  const submitPrediction = () => {
    let prediction_data = {
      "match_id": id,
      "user_id": user_id,
      "team_id": selectedTeam,
    }
    let teamName = "";
    if (selectedTeam === teamOne) {
      teamName = matchDetails.team_1
    } else {
      teamName = matchDetails.team_2
    }
    if (defaultTeamId !== 0) {
      console.log();
      PredictionDataService.update(selectedTeam, predictionId, id).then((res) => {
        toast.success(`Are you selected ${teamName} and result will be declared after the match`, notificationConfig);
        navigate('/dashboard')
      }).catch((error: any) => console.error(error))
    } else {
      PredictionDataService.create(prediction_data).then((res) => {
        toast.success(`You selected ${teamName} and result will be declared after the match`, notificationConfig);
        navigate('/dashboard')
        console.log(res)
      }).catch((error: any) => console.error(error))
    }
  }

  return (
    <div className="bottom-section-main">
      <div className="prediction_container">
        <div className="prediction_header">
          <div className="box_left_section">
            <label className="custom-radio">
              <input
                type="radio"
                name="radio"
                value={teamOne}
                checked={selectedTeam === teamOne}
                onChange={handlerChange} />
              <span className="radio-btn">
                <div className="hobbies-icon">
                  <img className="prediction_icon" src={matchDetails.team_1_icon} alt="team_logo" style={{ width: 90 }} />
                  <div className="prediction_team" style={{ paddingLeft: 8 }}>{matchDetails.team_1}</div>
                </div>
              </span>
            </label>
          </div>
          <div className="box_center_section">
            <div className="prediction_match">Match {matchDetails.match_no}</div>
          </div>
          <div className="box_right_section">
            <label className="custom-radio">
              <input
                type="radio"
                name="radio"
                value={teamTwo}
                checked={selectedTeam === teamTwo}
                onChange={handlerChange} />
              <span className="radio-btn">
                <div className="hobbies-icon">
                  <div className="prediction_team" style={{ paddingRight: 8 }}>{matchDetails.team_2}</div>
                  <img className="prediction_icon" src={matchDetails.team_2_icon} alt="team_logo" style={{ width: 90 }} />
                </div>
              </span>
            </label>
          </div>
        </div>
        <div className="prediction_footer">{matchDetails.date}</div>
        <div className="prediction_footer">
          <StadiumIcon width="30px" height="30px" />
          <span style={{ paddingTop: "10px" }}>{matchDetails.venue}</span>
        </div>
      </div>
      <div className="btn-box">
        <Button variant="contained" color="success" onClick={submitPrediction} disabled={selectedTeam ? false : true}>{defaultTeamId ? 'Update' : 'Submit'}</Button>
      </div>
    </div>
  )
}

export default Prediction;