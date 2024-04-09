import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import StadiumIcon from '../../../assets/icon/stadium';
import MatchService from '../../../service/matches.service';
import { notificationConfig } from '../../../utils/util';
import "./winner-dialog.css";

export default function WinnerConfirmDialog(props: any) {
  const { open, setOpen, match, onWinnerSelect } = props;
  const [teamDetails, setTeamDetails] = useState<any>({});
  const [selectedTeam, setSelectedTeam] = useState<string>('')

  useEffect(() => {
    MatchService.get(match.id).then((res) => {
      setTeamDetails(res.data[0]);
    }).catch((err) => {
      console.error(err)
    })

    if (teamDetails.winner_team !== null) {
      const winTeam = JSON.stringify(teamDetails.winner_team)
      setSelectedTeam(winTeam);
    }
  }, [match.id, teamDetails.winner_team])

  const handlerChange = (e: any) => {
    setSelectedTeam(e.target.value);
  }

  const teamOne = JSON.stringify(teamDetails.team_1);
  const teamTwo = JSON.stringify(teamDetails.team_2);

  const submitPrediction = () => {
    const team = JSON.parse(selectedTeam)
    MatchService.addWinnerTeam(match.id, team).then((res) => {
      let winTeamName = "";
      if (selectedTeam === teamOne) {
        winTeamName = match.team_1;
      } else {
        winTeamName = match.team_2;
      }
      onWinnerSelect(winTeamName);
      toast.success(`${winTeamName} won this match`, notificationConfig);
      setOpen(false);
    }).catch((err) => {
      toast.error(err.response.data.message, notificationConfig);
      setOpen(false);
    })
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <Dialog
      fullWidth
      maxWidth="lg"
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
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
                    <img className="prediction_icon" src={match.team_1_icon} alt="team_logo" style={{ width: 90 }} />
                    <div className="prediction_team" style={{ paddingLeft: 8 }}>{match.team_1}</div>
                  </div>
                </span>
              </label>
            </div>
            <div className="box_center_section">
              <div className="prediction_match">Match {match.match_no}</div>
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
                    <div className="prediction_team" style={{ paddingRight: 8 }}>{match.team_2}</div>
                    <img className="prediction_icon" src={match.team_2_icon} alt="team_logo" style={{ width: 90 }} />
                  </div>
                </span>
              </label>
            </div>
          </div>
          <div className="prediction_footer">{match.date}</div>
          <div className="prediction_footer">
            <StadiumIcon width="30px" height="30px" style={{ paddingRight: "10px" }} />
            <span style={{ paddingTop: "10px" }}>{match.venue}</span>
          </div>
        </div>
        <div className="btn-box">
          <Button variant="contained" color='inherit' sx={{ mr: 4 }} onClick={handleClose}>Cancel</Button>
          <Button variant="contained" className="btn" onClick={() => submitPrediction()} disabled={selectedTeam ? false : true}>Submit</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}