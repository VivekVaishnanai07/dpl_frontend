import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseIcon from '@mui/icons-material/Close';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import GroupsIcon from '@mui/icons-material/Groups';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { jwtDecode } from 'jwt-decode';
import { NavLink, useLocation } from 'react-router-dom';
import MatchIcon from "../../assets/icon/match";
import SideBarTeamIcon from '../../assets/icon/side-bar-team';
import { JwtTokenDecode } from '../../types/auth';
import "./sidebar.css";

const drawerWidth = 140;

interface Props {
  window?: () => Window;
  mobileOpen: any;
  handleDrawerToggle: any;
}


const Sidebar = (props: Props) => {
  const { window, mobileOpen, handleDrawerToggle } = props;
  const token = localStorage.getItem('token') as string;
  const userData = jwtDecode(token) as JwtTokenDecode;
  const location = useLocation();

  const drawerData = [
    {
      title: "Dashboard",
      icon: <DashboardIcon className={`${location.pathname === "/dashboard" ? "common-icon" : "default-icon"}`} />,
    },
    {
      title: "Matches",
      icon: <MatchIcon className={`${location.pathname === "/matches" ? "common-icon" : "default-icon"}`} />,
    },
    {
      title: "Teams",
      icon: <SideBarTeamIcon className={`${location.pathname === "/teams" ? "common-icon" : "default-icon"}`} />,
    },
    {
      title: "Groups",
      icon: <GroupsIcon className={`${location.pathname === "/groups" ? "common-icon" : "default-icon"}`} />,
    },
    {
      title: "Tournaments",
      icon: <EmojiEventsIcon className={`${location.pathname === "/tournament" ? "common-icon" : "default-icon"}`} />,
    },
    userData.role === 'admin' && {
      title: "Users",
      icon: <AccountCircleIcon className={`${location.pathname === "/users" ? "common-icon" : "default-icon"}`} />,
    },
    {
      title: "Prediction Analysis",
      icon: <TroubleshootIcon className={`${location.pathname === "/prediction-analysis" ? "common-icon" : "default-icon"}`} />,
    },
  ].filter(Boolean);

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      aria-label="mailbox folders"
    >
      {/* mobile view drawer */}
      <Drawer
        container={container}
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: "275px",
            background: "var(--secondary-5, #F2F8FE)",
            padding: "0 !important"
          },
        }}
      >
        <div className="mb-sidebar-main-box">
          <div className="sidebar-header">
            <div className="sidebar-header-title">Menu</div>
            <CloseIcon className="header-icon" onClick={handleDrawerToggle} />
          </div>

          {drawerData.map((data: any, index: number) => {
            const isActive = location.pathname === `/${data.title === "Prediction Analysis" ? "prediction-analysis" : data.title.toLowerCase()}` ? '' : 'sidebar-menu-title'
            return (
              <NavLink
                to={`/${data.title === "Prediction Analysis" ? "prediction-analysis" : data.title.toLowerCase()}`}
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "sidebar-first-section remove-nav-tag sidebar-active-section" : "remove-nav-tag sidebar-first-section"
                }
                key={index + 1}
                onClick={handleDrawerToggle}
              >
                {data.icon}
                <div className={isActive}>{data.title}</div>
              </NavLink>
            )
          })}
        </div>
      </Drawer>
    </Box>
  )
}

export default Sidebar;