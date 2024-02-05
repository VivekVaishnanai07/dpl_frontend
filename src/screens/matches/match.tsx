import { Button, Chip, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import DeleteIcon from "../../assets/icon/delete";
import EditIcon from '../../assets/icon/edit';
import ConfirmDialog from '../../components/dialog-box/dialog-box';
import MatchesDataService from "../../service/matches.service";
import './match.css';
import Trophy from "../../assets/icon/trophy";
import WinnerConfirmDialog from "../../components/dialog-box/winner-dialog";

const Match = () => {
  const navigate = useNavigate();
  const [filterValue, setFilterValue] = useState('2024');
  const [filterMatchList, setFilterMatchList] = useState([]);
  const [open, setOpen] = useState(false);
  const [winnerTeamSelectDialog, setWinnerTeamSelectDialog] = useState(false);
  const [emptyMessageBanner, setEmptyMessageBanner] = useState(false);
  const [matchId, setMatchId] = useState<number>(0);
  const [matchDetails, setMatchDetails] = useState();


  useEffect(() => {
    getMatchList();
  }, [])

  const getMatchList = () => {
    MatchesDataService.getAll().then((response) => {
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

  const handlerFilterList = (e: any) => {
    MatchesDataService.filterSeasonYear(e.target.value).then((res) => {
      setFilterMatchList(res.data);
    }).catch((error) => console.error(error))
    setFilterValue(e.target.value)
  }

  const handleWinnerSelect = () => {
    getMatchList();
    setWinnerTeamSelectDialog(false);
  };

  return (
    <div className="bottom-section-main">
      <div className="team-container">
        <div style={{ display: "flex", justifyContent: "end", padding: "10px 0px" }}>
          <FormControl sx={{ minWidth: 160 }}>
            <InputLabel id="demo-simple-select-label">SEASON YEAR</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={filterValue}
              label="SEASON YEAR"
              onChange={handlerFilterList}
            >
              <MenuItem value={2021}>SEASON 2021</MenuItem>
              <MenuItem value={2022}>SEASON 2022</MenuItem>
              <MenuItem value={2023}>SEASON 2023</MenuItem>
              <MenuItem value={2024}>SEASON 2024</MenuItem>
            </Select>
          </FormControl>
        </div>
        <table>
          <thead>
            <tr>
              <th scope="col">No.</th>
              <th scope="col">Match No.</th>
              <th scope="col">Team 1</th>
              <th scope="col">Team 2</th>
              <th scope="col">Venue</th>
              <th scope="col">Date</th>
              <th scope="col">Time</th>
              <th scope="col">Win Team</th>
              <th scope="col"></th>
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
                <td data-label="Date">{dayjs(match.date).format('DD/MM/YYYY')}</td>
                <td data-label="Time">{dayjs(match.date).format('h:mm A')}</td>
                <td data-label="Time">{match.winner_team ? match.winner_team : <Chip label="Coming Soon " />}</td>
                <td className='buttons'>
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
                </td>
              </tr>
            ))}
            <tr>
              {emptyMessageBanner && (
                <td colSpan={9}>
                  <div id="main">
                    <div className="fof">
                      <h1>Data Not Found</h1>
                    </div>
                  </div>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
      {matchDetails && <WinnerConfirmDialog match={matchDetails} open={winnerTeamSelectDialog} setOpen={setWinnerTeamSelectDialog} onWinnerSelect={handleWinnerSelect} />}
      <ConfirmDialog id={matchId} open={open} setOpen={setOpen} handlerDeleteMatch={handlerDeleteMatch} />
    </div>
  )
}

export default Match;