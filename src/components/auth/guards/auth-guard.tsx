
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../../layout/header/header';

const AuthGuard = ({ component, allowedRole }: any) => {
  const [status, setStatus] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    checkToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [component]);

  const checkToken = async () => {
    try {
      let isLogin = localStorage.getItem('isLogin')
      if (!isLogin) {
        navigate(`/login`);
      }

      // Assuming you have stored the user's role in localStorage or obtained it from an API
      let userRole;

      if (isLogin) {
        userRole = JSON.parse(isLogin.toString()); // Adjust this based on your actual implementation
      }

      // Check if the user's role is in the allowed roles
      if (!allowedRole.includes(userRole.role)) {
        navigate(`/login`); // Redirect to an unauthorized access page
        return;
      }
      setStatus(true);
      return;
    } catch (error) {

      navigate(`/login`);
    }
  }

  return status ?
    <>
      <Header />
      {component}
    </> :
    <React.Fragment></React.Fragment>;
}

export default AuthGuard;