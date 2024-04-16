import BedtimeIcon from '@mui/icons-material/Bedtime';
import LightModeIcon from '@mui/icons-material/LightMode';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Button } from '@mui/material';
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
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
  const [width, setWidth] = useState(window.innerWidth);

  const updateWidth = () => {
    setWidth(window.innerWidth);
  };

  useEffect(() => {
    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  useEffect(() => {
    getMatchList();
  }, []);

  useEffect(() => {
    scrollToToday();
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
      response.data.map((data: IMatch, index: number) => {
        const nthChildValue = response.data.length > 0 && `${response.data.length}n+${index + 1}`;
        const styleElement = document.createElement('style');
        styleElement.innerHTML = `
        .main-timeline .timeline:nth-child(${nthChildValue})::before {
          border-color: ${data.team_2_color};
        }
        
        .main-timeline .timeline:nth-child(${nthChildValue})::after {
          border-color: ${data.team_1_color};
        }
        
        .main-timeline .timeline:nth-child(${nthChildValue}) .timeline-year,
        .main-timeline .timeline:nth-child(${nthChildValue}) .match-title,
        .main-timeline .timeline:nth-child(${nthChildValue}) .winner_team {
          background: -webkit-linear-gradient(${data.team_1_color}, ${data.team_2_color});
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }`;
        document.head.appendChild(styleElement);
        return null;
      });
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

  const scrollToToday = () => {
    const todayIndex = filterMatchList.findIndex((match: any) => {
      const matchDate = dayjs.utc(match.date).local();
      const today = dayjs().startOf('day');
      return matchDate.isSame(today, 'day');
    });

    if (todayIndex !== -1) {
      const todayElement = document.getElementById(`timeline-${todayIndex}`);
      if (todayElement) {
        todayElement.scrollIntoView({ behavior: "smooth", block: "center" });
        const moonIcon = todayElement.querySelector('.moon-icon');
        const sunIcon = todayElement.querySelector('.sun-icon');

        if (moonIcon) {
          moonIcon.classList.add('moonLive');
        }

        if (sunIcon) {
          sunIcon.classList.add('sunLive');
        }
      }
    }
  };

  return (
    <div className="bottom-section-main bg horizontal-align">
      <div className="match-container">
        <div className="col">
          {filterMatchList.length > 0 &&
            <div className="main-timeline">
              {filterMatchList.map((match: IMatch, index: number) => (
                <div className="timeline" id={`timeline-${index}`} key={index + 1}>
                  <div className="timeline-content w-100">
                    <div className={`${userData.role === 'admin' ? 'timeline-event' : 'timeline-user-event'}`}>
                      <div className='timeline-year'>
                        <span>MATCH {match.match_no}</span>
                        <div>{dayjs.utc(match.date).local().format('MMM, ddd D')}</div>
                        <div>{dayjs.utc(match.date).local().format('h:mm a')}</div>
                      </div>
                      <div className="timeline-icon">
                        {dayjs(match.date).format('h:mm') === "3:00" ?
                          <LightModeIcon className='sun-icon' /> :
                          <BedtimeIcon className='moon-icon' />
                        }
                      </div>
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
                    </div>
                    <div className="content" style={{ marginTop: '30px' }}>
                      <h3 className="match-title horizontal-align"><LocationOnIcon className='location-icon' />{match.venue}</h3>
                      <div className="description">
                        <div className="card_content">
                          <div className="card_left">
                            <img className="team_icon" src={match.team_1_icon} alt="team_logo" style={{ width: 60 }} />
                            <div className="team_1">{width < 767 ? match.team_1_short_name : match.team_1}</div>
                          </div>
                          <span className="card_center">
                          </span>
                          <div className="card_right">
                            <div className="team_2">{width < 767 ? match.team_2_short_name : match.team_2}</div>
                            <img className="team_icon" src={match.team_2_icon} alt="team_logo" style={{ width: 60 }} />
                          </div>
                        </div>
                      </div>
                      <div className='match_on_hover'>
                        <div className='winner_team'>{match.winner_team ?
                          <div className='horizontal-align'>
                            <Trophy className='trophy' />
                            <span className='pl-4'>
                              {match.winner_team}
                            </span>
                          </div> : '-'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          }
        </div>
        {emptyMessageBanner && (
          <div>
            <h1>Data Not Found</h1>
          </div>
        )}
        {matchDetails && <WinnerConfirmDialog match={matchDetails} open={winnerTeamSelectDialog} setOpen={setWinnerTeamSelectDialog} onWinnerSelect={handleWinnerSelect} />}
        <ConfirmDialog id={matchId} open={open} setOpen={setOpen} handlerDeleteMatch={handlerDeleteMatch} />
      </div>
    </div >
  )
}

export default Match;