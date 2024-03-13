import { Button, Chip, IconButton, Tooltip } from "@mui/material";
import { useNavigate } from "react-router";
import StadiumIcon from '../../assets/icon/stadium';
import { countdownFormat } from "../../utils/util";
import "./card.css";

const Card = (props: any) => {
  const { matchDetails } = props;
  const navigate = useNavigate();
  const countDown = countdownFormat(matchDetails.countdownTime);

  return (
    <div className="card">
      <div className="card_header">
        <div className="match_status" style={{ color: `${matchDetails.match_status === "Today Match" && 'lightgreen'}` }}>{matchDetails.match_status}</div>
        <div className="match_number">T20 {matchDetails.match_no} of 60</div>
      </div>
      <div className="card_content">
        <div className="card_left">
          <img className="team_icon" src={matchDetails.team_1_icon} alt="team_logo" style={{ width: 60 }} />
          <div className="team_1">{matchDetails.team_1}</div>
        </div>
        <span className="card_center">
        </span>
        <div className="card_right">
          <div className="team_2">{matchDetails.team_2}</div>
          <img className="team_icon" src={matchDetails.team_2_icon} alt="team_logo" style={{ width: 60 }} />
        </div>
      </div>
      <div className="card_footer">
        <div className="red-text">{countDown}</div>
        <div className="date_section">
          <span>{matchDetails.date}</span>
        </div>
        <div className="place_section">
          <Tooltip title={matchDetails.venue} placement="bottom">
            <IconButton>
              <StadiumIcon width="18px" hanging="18px" />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <div className={`d-flex ${matchDetails.predicted_team ? 'justify-content-space-between' : 'justify-content-end'}`}>
        {matchDetails.predicted_team && <Chip size="small" label={matchDetails.predicted_team} color="success" variant="outlined" />}
        <Button variant="contained" sx={{ fontSize: 10 }} color="success" onClick={() => navigate(`/dashboard/prediction/${matchDetails.id}`)}>Predicted</Button>
      </div>
    </div>
  )
}

export default Card;