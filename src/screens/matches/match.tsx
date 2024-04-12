import { Button } from "@mui/material";
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import DeleteIcon from "../../assets/icon/delete";
import EditIcon from '../../assets/icon/edit';
import Trophy from "../../assets/icon/trophy";
import ConfirmDialog from '../../components/dialog-box/confirm/confirm-dialog';
import WinnerConfirmDialog from "../../components/dialog-box/winner/winner-dialog";
import MatchService from "../../service/matches.service";
import { JwtTokenDecode } from "../../types/auth";
import { IMatch } from "../../types/match";
import { notificationConfig } from "../../utils/util";
import './match.css';

const Match = () => {
  const token = localStorage.getItem('token') as string;
  const userData = jwtDecode(token) as JwtTokenDecode;
  const navigate = useNavigate();
  const [filterMatchList, setFilterMatchList] = useState([]);
  const [open, setOpen] = useState(false);
  const [winnerTeamSelectDialog, setWinnerTeamSelectDialog] = useState(false);
  const [emptyMessageBanner, setEmptyMessageBanner] = useState(false);
  const [matchId, setMatchId] = useState<number>(0);
  const [matchDetails, setMatchDetails] = useState<IMatch>();
  const tableRef = useRef<any>(null);

  useEffect(() => {
    getMatchList();
  }, []);

  useEffect(() => {
    scrollToDate();
    // eslint-disable-next-line
  }, [filterMatchList]);

  const getMatchList = () => {
    MatchService.getAll().then((response) => {
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

  const handlerEditMatch = (id: number) => {
    navigate(`/match/${id}`)
  }

  const handlerDeleteMatch = (id: number) => {
    MatchService.delete(id).then((res) => {
      getMatchList()
    }).catch((err) => {
      toast.error(err.response.data.error, notificationConfig);
    })
    setOpen(false)
  }

  const handleClickOpen = (id: number) => {
    setOpen(true);
    setMatchId(id);
  };

  const handlerSelectWinnerTeam = (match: IMatch) => {
    setWinnerTeamSelectDialog(true);
    setMatchDetails(match);
  }

  const handleWinnerSelect = () => {
    getMatchList();
    setWinnerTeamSelectDialog(false);
  };

  const scrollToDate = () => {
    const today = dayjs().format('DD/MM/YYYY');
    const todayRowIndex = filterMatchList.findIndex((item: any) => dayjs(item.date).format('DD/MM/YYYY') === today);
    if (todayRowIndex !== -1) {
      const rowElement = tableRef.current.querySelector(`tbody tr:nth-child(${todayRowIndex + 1})`);
      if (rowElement) {
        rowElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  return (
    <div className="bottom-section-main bg">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="team-container">
          <table ref={tableRef} style={{ maxWidth: "1300px" }}>
            <caption>Matches Table</caption>
            <thead>
              <tr>
                <th scope="col">No.</th>
                <th scope="col" colSpan={2}>Team 1</th>
                <th scope="col" colSpan={2}>Team 2</th>
                <th scope="col">Venue</th>
                <th scope="col">Date</th>
                <th scope="col">Time</th>
                <th scope="col">Price</th>
                <th scope="col" colSpan={2}>Win Team</th>
                {userData.role === 'admin' && <th scope="col" colSpan={2}>Action</th>}
              </tr>
            </thead>
            <tbody>
              {filterMatchList.map((match: IMatch, index: number) => (
                <tr key={index + 1}>
                  <td data-label="No.">{index + 1}</td>
                  <td data-label="Team 1" colSpan={2}>{match.team_1}</td>
                  <td data-label="Team 2" colSpan={2}>{match.team_2}</td>
                  <td data-label="Venue">{match.venue}</td>
                  <td data-label="Date">{dayjs.utc(match.date).local().format('DD/MM/YYYY')}</td>
                  <td data-label="Time">{dayjs.utc(match.date).local().format('h:mm A')}</td>
                  <td data-label="Price">{match.match_price}</td>
                  <td data-label="Win Team" colSpan={2}>{match.winner_team ? match.winner_team : '-'}</td>
                  {userData.role === 'admin' && <td data-label="Action" colSpan={2}>
                    <div className='buttons'>
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