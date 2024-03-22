import { Button, Chip } from "@mui/material";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DeleteIcon from "../../assets/icon/delete";
import EditIcon from '../../assets/icon/edit';
import Trophy from "../../assets/icon/trophy";
import ConfirmDialog from '../../components/dialog-box/dialog-box';
import WinnerConfirmDialog from "../../components/dialog-box/winner-dialog";
import MatchesDataService from "../../service/matches.service";
import './match.css';

const Match = () => {
  const token = localStorage.getItem('token') as any;
  const userData: any = jwtDecode(token);
  const navigate = useNavigate();
  const [filterMatchList, setFilterMatchList] = useState([]);
  const [open, setOpen] = useState(false);
  const [winnerTeamSelectDialog, setWinnerTeamSelectDialog] = useState(false);
  const [emptyMessageBanner, setEmptyMessageBanner] = useState(false);
  const [matchId, setMatchId] = useState<number>(0);
  const [matchDetails, setMatchDetails] = useState<any>();


  useEffect(() => {
    getMatchList();

  }, [])

  const getMatchList = () => {
    const data = null;
    MatchesDataService.getAll(data).then((response) => {
      if (response.data.length === 0) {
        setEmptyMessageBanner(true);
      } else {
        setEmptyMessageBanner(false)
      }
      setFilterMatchList(response.data)
    }).catch((error) => {
      setEmptyMessageBanner(true)
      console.error(error)
    })
  }

  const handlerEditMatch = (id: string) => {
    navigate(`/match/${id}`)
  }

  const handlerDeleteMatch = (id: number) => {
    MatchesDataService.delete(id).then((res) => {
      getMatchList()
    })
    setOpen(false)
  }

  const handleClickOpen = (id: number) => {
    setOpen(true);
    setMatchId(id);
  };

  const handlerSelectWinnerTeam = (match: any) => {
    setWinnerTeamSelectDialog(true);
    setMatchDetails(match);
  }

  const handleWinnerSelect = () => {
    getMatchList();
    setWinnerTeamSelectDialog(false);
  };

  return (
    <div className="bottom-section-main">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="team-container">
          <table style={{ maxWidth: "1500px" }}>
            <caption>Matches Table</caption>
            <thead>
              <tr>
                <th scope="col">No.</th>
                <th scope="col">Match No.</th>
                <th scope="col">Team 1</th>
                <th scope="col">Team 2</th>
                <th scope="col">Venue</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Match Price</th>
                <th scope="col">Win Team</th>
                {userData.role === 'admin' && <th scope="col"></th>}
              </tr>
            </thead>
            <tbody>
              {filterMatchList.map((match: any, index: number) => (
                <tr key={index + 1}>
                  <td data-label="No.">{index + 1}</td>
                  <td data-label="Match No.">{match.match_no}</td>
                  <td data-label="Team 1">{match.team_1}</td>
                  <td data-label="Team 2">{match.team_2}</td>
                  <td data-label="Venue">{match.venue}</td>
                  <td data-label="Date">{dayjs.utc(match.date).local().format('DD/MM/YYYY')}</td>
                  <td data-label="Time">{dayjs.utc(match.date).local().format('h:mm A')}</td>
                  <td data-label="Match Price">{match.match_price}</td>
                  <td data-label="Win Team">{match.winner_team ? match.winner_team : <Chip label="Coming Soon " />}</td>
                  {userData.role === 'admin' && <td className='buttons'>
                    <div id='match_edit' data-label="Buttons">
                      <Button onClick={() => handlerEditMatch(match.id)}>
                        <EditIcon />
                      </Button>
                    </div>
                    <div id='winner_trophy' data-label="">
                      <Button onClick={() => handlerSelectWinnerTeam(match)}>
                        <Trophy />
                      </Button>
                    </div>
                    <div id='match_delete' data-label="">
                      <Button onClick={() => handleClickOpen(match.id)}>
                        <DeleteIcon />
                      </Button>
                    </div>
                  </td>}
                </tr>
              ))}
              {emptyMessageBanner && (
                <tr>
                  <td colSpan={userData.role === 'admin' ? 10 : 9}>
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
          {matchDetails && <WinnerConfirmDialog match={matchDetails} open={winnerTeamSelectDialog} setOpen={setWinnerTeamSelectDialog} onWinnerSelect={handleWinnerSelect} />}
          <ConfirmDialog id={matchId} open={open} setOpen={setOpen} handlerDeleteMatch={handlerDeleteMatch} />
        </div>
      </div>
    </div>
  )
}

export default Match;