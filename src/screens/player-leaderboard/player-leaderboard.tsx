import { useEffect, useState } from "react";
import playerLeaderboardDataService from "../../service/player-leaderboard.service";
import "./player-leaderboard.css";

const PlayerLeaderboard = () => {
  const [emptyMessageBanner, setEmptyMessageBanner] = useState(false);
  const [playerLeaderboardList, setPlayerLeaderboardList] = useState([]);

  useEffect(() => {
    getPlayerLeaderboardList()
  }, [])

  const getPlayerLeaderboardList = () => {
    playerLeaderboardDataService.getAll().then((response) => {
      if (response.data.length === 0) {
        setEmptyMessageBanner(true);
      } else {
        setEmptyMessageBanner(false)
      }
      setPlayerLeaderboardList(response.data)
    }).catch((error) => {
      setEmptyMessageBanner(true);
      console.error(error)
    })
  }

  return (
    <div className="bottom-section-main">
      <div className="player-leaderboard-container">
        <table>
          <caption>Player Leaderboard</caption>
          <thead>
            <tr>
              <th scope="col">No.</th>
              <th scope="col">Player Name</th>
              <th scope="col">Win Matches</th>
              <th scope="col">Lost Matches</th>
              <th scope="col">Miss Matches</th>
              <th scope="col">Total Matches</th>
              <th scope="col">To Pay Money</th>
            </tr>
          </thead>
          <tbody>
            {playerLeaderboardList.map((item: any, index: number) => (
              <tr key={index + 1}>
                <td data-label="No.">{index + 1}</td>
                <td data-label="Player Name">{item.userName}</td>
                <td data-label="Win Matches">{item.won_matches}</td>
                <td data-label="Lost Matches">{item.lost_matches}</td>
                <td data-label="Miss Matches">{item.not_predicted_matches}</td>
                <td data-label="Total Matches">{item.total_matches}</td>
                <td data-label="To Pay Money">{item.user_points}</td>
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
    </div>
  )
}

export default PlayerLeaderboard;