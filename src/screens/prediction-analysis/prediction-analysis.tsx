import { FormControl, IconButton, InputLabel, MenuItem, Select } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import ViewMoreIcon from "../../assets/icon/view-more";
import predictionAnalysisService from "../../service/prediction-analysis.service";
import TournamentService from "../../service/tournament.service";
import { JwtTokenDecode } from "../../types/auth";
import { notificationConfig } from "../../utils/util";
import "./prediction-analysis.css";

const PredictionAnalysis = () => {
  const token = localStorage.getItem('token') as string;
  const userData = jwtDecode(token) as JwtTokenDecode;
  const navigate = useNavigate();
  const [usersPredictionAnalysisList, setUsersPredictionAnalysisList] = useState([]);
  const [tournamentList, setTournamentList] = useState([]);
  const [tournamentValue, setTournamentValue] = useState<any>(null);
  const [groupsList, setGroupsList] = useState([]);
  const [groupsValue, setGroupsValue] = useState<any>(null);
  const [emptyMessageBanner, setEmptyMessageBanner] = useState(false);

  useEffect(() => {
    getTournament();
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (tournamentValue !== 0 && groupsValue !== 0) {
      getUsersPredictionList(tournamentValue, groupsValue);
    }
  }, [tournamentValue, groupsValue])

  const getUsersPredictionList = (tournament: any, groups: any) => {
    if (!tournament || !groups) {
      setEmptyMessageBanner(true);
      return;
    }

    predictionAnalysisService.getAll(tournament.id, groups.id).then((response: any) => {
      if (response.data.length === 0) {
        setEmptyMessageBanner(true);
      } else {
        setEmptyMessageBanner(false)
      }
      setUsersPredictionAnalysisList(response.data);
    }).catch((error) => {
      setEmptyMessageBanner(true)
      console.error(error)
    })
  }

  const getTournament = () => {
    TournamentService.getAll(userData.id).then((res) => {
      if (res.data) {
        setTournamentList(res.data);
        let findActiveTournament = res.data.find((item: any) => item.status === 'Active')
        if (findActiveTournament) {
          setTournamentValue(findActiveTournament);
          setGroupsList(findActiveTournament.group_details);
          setGroupsValue(findActiveTournament.group_details[0]);
        } else {
          setTournamentValue(res.data[0]);
          setGroupsList(res.data[0].group_details);
          setGroupsValue(res.data[0].group_details[0]);
        }
      }
    }).catch((error) => {
      toast.error(error.response.data, notificationConfig);
    })
  }

  const handleSelectionChange = (event: any, type: string) => {
    const value = event.target.value;
    if (type === 'tournament') {
      setTournamentValue(value);
      setGroupsList(value.group_details)
      setGroupsValue(value.group_details[0]);
    } else if (type === 'group') {
      setGroupsValue(value);
    }
  };

  return (
    <div className="bottom-section-main bg">
      <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="team-container">
          {(tournamentList.length > 1 || groupsList.length > 1) &&
            <div className='filter-tournament-groups'>
              {tournamentList.length > 1 &&
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-label">Tournaments</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={tournamentValue}
                    label="Tournaments"
                    onChange={(event) => handleSelectionChange(event, 'tournament')}
                  >
                    {tournamentList.map((item: any, index: number) => (
                      <MenuItem value={item} key={index + 1}>{item.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              }
              {groupsList.length > 1 &&
                <FormControl sx={{ m: 1, minWidth: 120 }}>
                  <InputLabel id="demo-simple-select-label">Groups</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={groupsValue}
                    label="Tournaments"
                    onChange={(event) => handleSelectionChange(event, 'group')}
                  >
                    {groupsList.map((item: any, index: number) => (
                      <MenuItem value={item} key={index + 1}>{item.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              }
            </div>
          }
          <table style={{ maxWidth: "1100px" }}>
            <caption>Player Prediction Analysis</caption>
            <thead>
              <tr>
                <th scope="col">No.</th>
                <th scope="col">Players</th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {usersPredictionAnalysisList && usersPredictionAnalysisList.map((item: any, index: number) => (
                <tr key={index + 1}>
                  <td data-label="No.">{index + 1}</td>
                  <td data-label="Player Name">{item.full_name}</td>
                  <td data-label="">
                    <div className="d-flex justify-content-center">
                      {item.match_details && item.match_details.sort((a: { date: string }, b: { date: string }) => {
                        return new Date(a.date).getTime() - new Date(b.date).getTime();
                      }).map((data: any, i: number) => (
                        <div key={i + 1}>
                          {data.status && data.status === "true" ?
                            <span className="rf W ih-pt-g">W</span> :
                            <span className="rf L ih-pt-r">L</span>}
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="d-flex justify-content-center align-items-center" data-label="">
                    <IconButton onClick={() => navigate(`/prediction-analysis/${item.user_id}/${groupsValue.id}/${tournamentValue.id}`, { state: { name: item.full_name } })}>
                      <ViewMoreIcon />
                    </IconButton>
                  </td>
                </tr>
              ))}
              {emptyMessageBanner && (
                <tr>
                  <td colSpan={4}>
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
        </div>
      </div>
    </div>
  )
}

export default PredictionAnalysis;