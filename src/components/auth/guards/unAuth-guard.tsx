import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UnAuthGuard = ({ component }: any) => {
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
        localStorage.removeItem("isLogin")
      } else {
        navigate(`/dashboard`);
      }
      setStatus(true);
    } catch (error) {
      navigate(`/dashboard`);
    }
  }

  return status ? <React.Fragment>{component}</React.Fragment> : <React.Fragment></React.Fragment>;
}

export default UnAuthGuard;