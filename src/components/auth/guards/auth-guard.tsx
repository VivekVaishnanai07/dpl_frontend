
import { jwtDecode } from 'jwt-decode';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserProvider } from '../../../context/user-context';
import Header from '../../../layout/header/header';
import Sidebar from '../../../layout/sidebar/sidebar';
import { JwtTokenDecode } from '../../../types/auth';

const AuthGuard = ({ component, allowedRole }: { component: any, allowedRole: string[] }) => {
  const [status, setStatus] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component]);

  const checkToken = async () => {
    try {
      let isToken = localStorage.getItem('token');
      if (!isToken) {
        navigate(`/login`);
      }

      // Assuming you have stored the user's role in localStorage or obtained it from an API
      let userRole;

      if (isToken) {
        let token = jwtDecode(isToken) as JwtTokenDecode;
        userRole = token.role;
      }

      // Check if the user's role is in the allowed roles
      if (userRole && !allowedRole.includes(userRole)) {
        navigate(`/login`); // Redirect to an unauthorized access page
        return;
      }
      setStatus(true);
      return;
    } catch (error) {
      navigate(`/login`);
    }
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return status ?
    <>
      <UserProvider>
        <Header handleDrawerToggle={handleDrawerToggle} />
        <Sidebar mobileOpen={mobileOpen} handleDrawerToggle={handleDrawerToggle} />
        {component}
      </UserProvider>
    </> :
    <React.Fragment></React.Fragment>;
}

export default AuthGuard;