import React, { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import UserContext from '../../context/user-context';
import PredictionService from '../../service/prediction.service';
import { IMatch } from '../../types/match';
import { IPredictedUser } from '../../types/user';
import './match-progress-bar.css';

const MatchProgressBar: React.FC<{ matchDetails: IMatch }> = ({ matchDetails }) => {
  const { groupId, tournamentId } = useContext(UserContext);
  const [team1SelectedUser, setTeam1SelectedUser] = useState([]);
  const [team2SelectedUser, setTeam2SelectedUser] = useState([]);
  const [winPercentage1, setWinPercentage1] = useState(0);
  const [winPercentage2, setWinPercentage2] = useState(0);
  const [showProgressBar, setShowProgressBar] = useState(false);

  useEffect(() => {
    const socket = io('https://dpl-backend-3pdy.onrender.com');
    const fetchData = () => {
      if (tournamentId !== null && groupId !== null) {
        getPredictionMatchUserData(matchDetails.id, groupId, tournamentId);
      }
    };

    fetchData();

    socket.on('connect', () => console.log(socket.id))

    socket.on("prediction_updated", () => {
      fetchData();
    });

    socket.on("prediction_added", () => {
      fetchData();
    });

    return () => {
      socket.disconnect(); // Disconnect Socket.IO connection
    };

    // eslint-disable-next-line
  }, [matchDetails.id, tournamentId, groupId])

  const getPredictionMatchUserData = (predictionMatchId: number, predictionGroupId: number, predictionTournamentId: number) => {
    let team1SelectedUser = [];
    let team2SelectedUser = [];
    setTeam1SelectedUser([]);
    setTeam2SelectedUser([]);
    setWinPercentage1(0);
    setWinPercentage2(0);
    setShowProgressBar(false);
    let data = {
      tournamentId: predictionTournamentId,
      groupId: predictionGroupId
    }
    PredictionService.predictedMatchUser(predictionMatchId, data).then((res) => {
      if (res.data) {
        team1SelectedUser = res.data.filter((item: IPredictedUser) => item.predicted_team_id === matchDetails.team_1_id);
        team2SelectedUser = res.data.filter((item: IPredictedUser) => item.predicted_team_id === matchDetails.team_2_id);
        const totalUserSelected = (team1SelectedUser.length + team2SelectedUser.length);
        if (team1SelectedUser.length > 0) {
          setTeam1SelectedUser(team1SelectedUser);
          const formateTeam1Percentage = parseInt((team1SelectedUser.length / totalUserSelected * 100).toFixed());
          setWinPercentage1(formateTeam1Percentage);
        }
        if (team2SelectedUser.length > 0) {
          setTeam2SelectedUser(team2SelectedUser);
          const formateTeam2Percentage = parseInt((team2SelectedUser.length / totalUserSelected * 100).toFixed());
          setWinPercentage2(formateTeam2Percentage);
        }
        if (team1SelectedUser.length === 0 && team2SelectedUser.length === 0) {
          setShowProgressBar(true);
        } else {
          setShowProgressBar(false);
        }
        // if (totalUserSelected !== 0) {
        //   const team1Percentage = (team1SelectedUser.length + (totalUserSelected / 2)) / 10 * 100;
        //   const formateTeam1Percentage = team1Percentage.toFixed();
        //   setWinPercentage1(parseInt(formateTeam1Percentage));
        //   const team2Percentage = (team2SelectedUser.length + (totalUserSelected / 2)) / 10 * 100;
        //   const formateTeam2Percentage = team2Percentage.toFixed();
        //   setWinPercentage2(parseInt(formateTeam2Percentage));
        // }
      }
    }).catch((err) => {
      console.error(err);
    })
  }
  return (
    <div className="progress-bar-container">
      <div className="text-details">
        <div className="d-flex">
          <div className="team1">{matchDetails.team_1}</div>
          <div className="team2">{matchDetails.team_2}</div>
        </div>
        <div className="d-flex">
          <div className="team1" style={{ color: matchDetails.team_1_color }}>{winPercentage1}%</div>
          <div className="team2" style={{ color: matchDetails.team_2_color }}>{winPercentage2}%</div>
        </div>
      </div>
      <div className="d-flex gap-1">
        <div className='tooltip' style={{ height: '8px', backgroundColor: showProgressBar ? '#9d9d9d' : matchDetails.team_1_color, transition: 'width 0.3s', width: `${showProgressBar ? 50 : winPercentage1}%` }}>
          {team1SelectedUser.length > 0 && <span className="tooltiptext leftSide">
            {team1SelectedUser.map((item: IPredictedUser, index: number) => (
              <div key={index + 1}>{item.first_name + ' ' + item.last_name}</div>
            ))}
          </span>}
        </div>
        <div className='tooltip' style={{ height: '8px', backgroundColor: showProgressBar ? '#9d9d9d' : matchDetails.team_2_color, transition: 'width 0.3s', width: `${showProgressBar ? 50 : winPercentage2}%` }}>
          {team2SelectedUser.length > 0 && <span className="tooltiptext rightSide">
            {team2SelectedUser.map((item: IPredictedUser, index: number) => (
              <div key={index + 1}>{item.first_name + ' ' + item.last_name}</div>
            ))}
          </span>}
        </div>
      </div>
    </div>
  );
};

export default MatchProgressBar;
