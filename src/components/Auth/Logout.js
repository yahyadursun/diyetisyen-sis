import React, { useContext } from 'react';
import { Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
const Logout = () => {
  const { logout} = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Perform any logout operations like clearing user data from state or local storage
    message.success('Logout successful');
    logout(); // Set the auth state to false
    localStorage.removeItem('username');
    navigate('/login');
  };

  return (
    <Button type="primary" onClick={handleLogout}>
      Logout
    </Button>
  );
};

export default Logout;
