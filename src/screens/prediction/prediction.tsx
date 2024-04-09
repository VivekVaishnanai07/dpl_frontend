import { Button } from "@mui/material";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";
import StadiumIcon from "../../assets/icon/stadium";
import MatchService from "../../service/matches.service";
import PredictionService from "../../service/prediction.service";
import { JwtTokenDecode } from "../../types/auth";
import { PredictionRequestPayload } from "../../types/prediction";
import { notificationConfig } from "../../utils/util";
import "./prediction.css";

const Prediction = () => {
  let navigate = useNavigate();
  let { id }: any = useParams();
  let getData = localStorage.getItem('token') as string;
  let user = jwtDecode(getData) as JwtTokenDecode;
  let userId = user.id;

  const [predictionId, setPredictionId] = useState('');
  const [matchDetails, setMatchDetails] = useState<any>({});
  const [defaultTeamId, setDefaultTeamId] = useState(0);
  const [selectedTeam, setSelectedTeam] = useState('');
  useEffect(() => {
    getPredictionData(userId, id);
    matchDetailsData(id);
  }, [userId, id])

  const getPredictionData = (userId: number, id: number) => {
    PredictionService.get(userId, id).then((res) => {
      const data = res.data[0];
      if (data !== undefined) {
        let pId: string = JSON.stringify(data.id);
        setPredictionId(pId);
        let id = JSON.stringify(data.team_id);
        setSelectedTeam(id);
        setDefaultTeamId(parseInt(id));
      }
    }).catch((error) => console.error(error));
  }

  const matchDetailsData = (id: number) => {
    MatchService.getPredictionDetailsById(id).then((response) => {
      if (response.data.length > 0) {
        setMatchDetails(response.data[0]);
      }
    }).catch((error) => console.error(error))
  }

  const handlerChange = (e: any) => {
    setSelectedTeam(e.target.value);
  }

  let teamOne = JSON.stringify(matchDetails.team_1_id)
  let teamTwo = JSON.stringify(matchDetails.team_2_id)

  const submitPrediction = () => {
    let predictionData: PredictionRequestPayload = {
      matchId: id,
      userId: userId,
      teamId: parseInt(selectedTeam),
    }
    let teamName = "";
    if (selectedTeam === teamOne) {
      teamName = matchDetails.team_1
    } else {
      teamName = matchDetails.team_2
    }
    if (defaultTeamId !== 0) {
      let predictionData: PredictionRequestPayload = {
        matchId: parseInt(id),
        predictionId: parseInt(predictionId),
        teamId: parseInt(selectedTeam),
      }
      PredictionService.update(predictionData).then((res) => {
        toast.success(`Are you selected ${teamName} and result will be declared after the match`, notificationConfig);
        navigate('/dashboard')
      }).catch((error: Error) => console.error(error))
    } else {
      PredictionService.create(predictionData).then((res) => {
        toast.success(`You selected ${teamName} and result will be declared after the match`, notificationConfig);
        navigate('/dashboard')
      }).catch((error: Error) => console.error(error))
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
              <span className="radio-btn" style={{ float: "right" }}>
                <div className="hobbies-icon">
                  <img className="prediction_icon" src={matchDetails.team_1_icon} alt="team_logo" style={{ width: 80 }} />
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
                  <img className="prediction_icon" src={matchDetails.team_2_icon} alt="team_logo" style={{ width: 80 }} />
                </div>
              </span>
            </label>
          </div>
        </div>
        <div className="prediction_footer">{dayjs.utc(matchDetails.date).local().format('DD/MM/YYYY h:mm A')}</div>
        <div className="prediction_footer">
          <StadiumIcon width="30px" height="30px" style={{ paddingRight: "10px" }} />
          <span style={{ paddingTop: "10px" }}>{matchDetails.venue}</span>
        </div>
      </div>
      <div className="btn-box">
        <Button variant="contained" className="btn" onClick={submitPrediction} disabled={selectedTeam ? false : true}>{defaultTeamId ? 'Update' : 'Submit'}</Button>
      </div>
    </div>
  )
}

export default Prediction;