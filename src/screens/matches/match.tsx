import BedtimeIcon from '@mui/icons-material/Bedtime';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LightModeIcon from '@mui/icons-material/LightMode';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import dayjs from "dayjs";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import Trophy from "../../assets/icon/trophy";
import MatchService from "../../service/match.service";
import TournamentService from '../../service/tournament.service';
import { JwtTokenDecode } from "../../types/auth";
import { IMatch } from "../../types/match";
import './match.css';
import { toast } from 'react-toastify';
import { notificationConfig } from '../../utils/util';

const Match = () => {
  const token = localStorage.getItem('token') as string;
  const userData = jwtDecode(token) as JwtTokenDecode;
  const [filterMatchList, setFilterMatchList] = useState([]);
  const [tournamentList, setTournamentList] = useState([]);
  const [emptyMessageBanner, setEmptyMessageBanner] = useState(false);
  const [width, setWidth] = useState(window.innerWidth);
  const [showButton, setShowButton] = useState(false);
  const [filterTournament, setFilterTournament] = useState('');

  // Back to redirect current match
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Adjust responsive ui
  useEffect(() => {
    window.addEventListener('resize', updateWidth);
    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  // Getting data api calls
  useEffect(() => {
    getTournament();
    // eslint-disable-next-line
  }, []);

  // Scrolling current match
  useEffect(() => {
    scrollToToday();
    // eslint-disable-next-line
  }, [filterMatchList]);

  const getMatchList = (id: number) => {
    MatchService.getAll(id).then((response) => {
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

  const getTournament = () => {
    TournamentService.getAll(userData.id).then((res) => {
      if (res.data) {
        setTournamentList(res.data);
        let getActiveTournament = res.data.find((item: any) => item.status === "Active");
        setFilterTournament(getActiveTournament.id);
        getMatchList(getActiveTournament.id);
      }
    }).catch((error) => {
      toast.error(error.response.data, notificationConfig);
    })
  }

  const updateWidth = () => {
    setWidth(window.innerWidth);
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
        setShowButton(false);
      } else {
        setShowButton(true);
      }
    }
  };

  const handleChange = (event: SelectChangeEvent) => {
    setFilterTournament(event.target.value);
    getMatchList(parseInt(event.target.value));
  };

  return (
    <div className="bottom-section-main bg horizontal-align">
      <div className="match-container">
        {tournamentList.length > 1 &&
          <div className='filter-tournament'>
            <FormControl sx={{ m: 1, minWidth: 120 }}>
              <InputLabel id="demo-simple-select-label">Tournaments</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={filterTournament}
                label="Tournaments"
                onChange={handleChange}
              >
                {tournamentList.map((item: any, index: number) => (
                  <MenuItem value={item.id} key={index + 1}>{item.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        }
        <div className="col">
          {filterMatchList.length > 0 &&
            <div className="main-timeline">
              {filterMatchList.map((match: IMatch, index: number) => (
                <div className="timeline" id={`timeline-${index}`} key={index + 1}>
                  <div className="timeline-content w-100">
                    <div className='timeline-user-event'>
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
          <div className='text-algin-center'>
            <h1>Data Not Found</h1>
          </div>
        )}
        <button
          className='back-to-current-match'
          onClick={scrollToToday}
          style={{ display: showButton ? "block" : "none" }}
        >
          <KeyboardArrowUpIcon className='upArrow-icon' />
        </button>
      </div>
    </div >
  )
}

export default Match;