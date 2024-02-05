import dayjs from "dayjs";
import "./card.css"
import { getTodayOrUpcoming } from "../../utils/util";
import Countdown from "../../hooks/useCountdiwn";
import { useNavigate } from "react-router";
import { Button } from "@mui/material";

const Card = (props: any) => {
  const { matchDetails } = props;
  const navigate = useNavigate();
  const countDown = Countdown(matchDetails.date)
  const status = getTodayOrUpcoming(matchDetails.date)
  return (
    <div className="card">
      <div className="card_header">
        <div className="match_status"><span dangerouslySetInnerHTML={{ __html: status }} /></div>
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
        <div className="time_countdown">{countDown === "Live" ? countDown : `${countDown.hours}H ${countDown.minutes}M`}</div>
        <div className="date_section">
          <span>{dayjs(matchDetails.date).format('D MMM, YYYY')}</span> &nbsp;&nbsp;
          <span>{dayjs(matchDetails.date).format('h:mm A')}</span>
        </div>
        <div className="place_section">{matchDetails.venue}</div>
      </div>
      <div className="footer_btn">
        <Button variant="contained" sx={{ fontSize: 10 }} color="success" onClick={() => navigate(`/dashboard/prediction/${matchDetails.id}`)}>Predicted</Button>
      </div>
    </div>
  )
}

export default Card;