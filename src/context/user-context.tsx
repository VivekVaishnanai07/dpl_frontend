import { jwtDecode } from 'jwt-decode';
import { createContext, useEffect, useState } from 'react';
import UserService from '../service/users.service';
import { JwtTokenDecode } from '../types/auth';

const UserContext = createContext<any>(null);

export const UserProvider = ({ children }: any) => {
  let isToken = localStorage.getItem('token') as string;
  let jwtTokenDecode = jwtDecode(isToken) as JwtTokenDecode;
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (isToken) {
      getUserData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getUserData = () => {
    UserService.getById(jwtTokenDecode.id).then((res) => {
      setUser(res.data)
    }).catch((error) => {
      console.error(error);
    })
  }

  // Function to update user data
  const updateUser = () => {
    getUserData();
  };

  return (
    <UserContext.Provider value={{ user, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;