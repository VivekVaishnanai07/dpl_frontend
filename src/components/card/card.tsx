import { Button, Chip, IconButton, Tooltip } from "@mui/material";
import dayjs from "dayjs";
import { useNavigate } from "react-router";
import StadiumIcon from '../../assets/icon/stadium';
import useCountdownTimer from "../../hooks/useCountdownTimer";
import "./card.css";

const Card = (props: any) => {
  const { matchDetails } = props;
  const navigate = useNavigate();
  const { days, hours, minutes, seconds } = useCountdownTimer(matchDetails.date);
  
  if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
    window.location.reload();
  }

  return (
    <div className="card">
      <div className="card_header">
        <div className="match_status" style={{ color: `${matchDetails.match_status === "Today Match" && '#1e5b79'} ` }}>{matchDetails.match_status}</div>
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
        <div className="countdown-text">
          <div>{days > 0 && `${days}D,`} {hours > 0 && `${hours}H,`} {minutes}M, {seconds}S</div>
        </div>
        <div className="date_section">
          <span>{dayjs.utc(matchDetails.date).local().format('DD/MM/YYYY h:mm A')}</span>
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
        {matchDetails.predicted_team && <Chip className="chip-text" size="small" label={matchDetails.predicted_team} variant="outlined" />}
        <Button variant="contained" className="btn" sx={{ fontSize: 10 }} onClick={() => navigate(`/dashboard/prediction/${matchDetails.id}`)}>Predicted</Button>
      </div>
    </div>
  )
}

export default Card;