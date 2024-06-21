import AddIcon from '@mui/icons-material/Add';
import MenuIcon from '@mui/icons-material/Menu';
import { Fab } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { jwtDecode } from 'jwt-decode';
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { NavLink } from 'react-router-dom';
import AvatarImg from '../../assets/img/avatar.jpg';
import UserContext from '../../context/user-context';
import { JwtTokenDecode } from '../../types/auth';
import { adminHeader, biteCodeConvertIntoImg, roles, userHeader } from '../../utils/util';
import './header.css';

function Header({ handleDrawerToggle }: any) {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user } = useContext(UserContext);
  let pathName = pathname.split("/").filter(Boolean);
  const getToken = localStorage.getItem('token') as string;
  let userData = jwtDecode(getToken) as JwtTokenDecode;

  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);


  useEffect(() => {
    if (user !== null && user.userImg && user.userImg.data !== null) {
      biteCodeConvertIntoImg(user.userImg.data);
    }
  }, [user])

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const userProfile = () => {
    setAnchorElUser(null);
    navigate('/user-profile');
  }

  const changePassword = () => {
    setAnchorElUser(null);
    navigate('/change-password');
  }

  const logout = () => {
    localStorage.clear();
    navigate('/');
  }

  const addForms = () => {
    if (pathname === "/tournament/teams") {
      navigate("/tournament/team/add-team")
    } else if (pathname === "/tournament/matches") {
      navigate("/tournament/match/add-match")
    } else if (pathname === "/tournaments") {
      navigate("/tournament/add-tournament")
    } else if (pathname === "/groups") {
      navigate("/group/add-group")
    } else {
      navigate("/user/add-user")
    }
  }

  const getHeaderData = () => {
    if (userData.role === roles.Admin_Role) {
      return adminHeader;
    } else {
      return userHeader;
    }
  }

  const handleNavigation = (path: any) => {
    switch (path) {
      case '/tournament':
        navigate('/tournaments');
        break;
      case '/match':
      case '/team':
        navigate(-1);
        break;
      case '/prediction-analysis':
        navigate('/prediction-analysis');
        break;
      case '/dashboard':
        navigate('/dashboard');
        break;
      case '/user':
        navigate('/users');
        break;
      case '/group':
        navigate('/groups');
        break;
    }
  };

  return (
    <div className='header'>
      <div className='top-header'></div>
      <AppBar position='sticky' className='middle-header'>
        <Toolbar className='middle-header-container' style={{ paddingLeft: "0px !important" }}>
          <Box className="ap-ipl-logo" sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }}>
            <img src={require('../../assets/img/ipl-logo-new-old.png')} alt='dpl-11' style={{ height: "auto", width: "95px" }} />
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleDrawerToggle}
            >
              <MenuIcon style={{ color: "white", height: 36, width: 36 }} />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {
                getHeaderData().map((item, index) => (
                  <MenuItem key={index + 1}>
                    <Typography textAlign="center" onClick={() => {
                      navigate(item.navigateUrl);
                      handleCloseNavMenu();
                    }}>{item.componentName}</Typography>
                  </MenuItem>
                ))
              }
            </Menu>
          </Box>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <img src={require('../../assets/img/ipl-logo-new-old.png')} alt='dpl-11' style={{ height: "50px", width: "100px" }} />
          </Box>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: "center", zIndex: 1 }}>
            {
              getHeaderData().map((item, index) => (
                <React.Fragment key={index + 1}>
                  <NavLink
                    to={item.navigateUrl}
                    className={({ isActive, isPending }) =>
                      isPending ? "pending" : isActive ? "header-title active" : "header-title"
                    }
                  >
                    {item.componentName}
                  </NavLink>
                </React.Fragment>
              ))
            }
          </Box>
          <Box sx={{ flexGrow: 0 }} className="avatar-box">
            <IconButton sx={{ p: 0 }} onClick={handleOpenUserMenu}>
              <Avatar alt='avatar' className='profileAvatar' src={user && user.userImg && user.userImg !== null ? biteCodeConvertIntoImg(user.userImg.data) : AvatarImg} />
              <Typography className='avatar-title'>{user && user.first_name + " " + user.last_name}</Typography>
            </IconButton>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <MenuItem onClick={userProfile}>
                <Typography textAlign="center">Profile</Typography>
              </MenuItem>
              <MenuItem onClick={changePassword}>
                <Typography textAlign="center">Change Password</Typography>
              </MenuItem>
              <MenuItem onClick={logout}>
                <Typography textAlign="center">Logout</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <div className='bottom-header'>
        <div className='container'>
          <span className='font' style={{ paddingRight: '4px' }}>HOME</span>
          {
            pathName.map((item: string, index: number) => (
              <span key={index + 1} onClick={() => handleNavigation(`/${item}`)} className='font cursor-pointer'>{' / '}{item.toLocaleUpperCase()}&nbsp;</span>
            ))
          }
        </div>
      </div>
      <div className='title-header'>
        <div className="title">{pathName[pathName.length - 1].toLocaleUpperCase()}</div>
        {userData.role === 'admin' &&
          (pathname === "/tournament/teams" || pathname === "/tournament/matches" || pathname === "/users" || pathname === "/tournaments" || pathname === "/groups") && (
            <div className="add-icon-box">
              <Fab color="primary" aria-label="add" className='add-button'>
                <AddIcon onClick={addForms} />
              </Fab>
            </div>
          )
        }
      </div>
    </div>
  );
}
export default Header;
