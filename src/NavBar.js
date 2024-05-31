import React from 'react';
import { useUser } from './UserContext';
import { Link } from 'react-router-dom';

const NavBar = () => {
  const { user } = useUser();

  return (
    <nav>
      <ul>
        <li><Link to="/map">Map</Link></li>
        <li><Link to="/login">Login</Link></li>
        {user && <span style={{ float: 'right' }}>Welcome, {user.name}</span>}
      </ul>
    </nav>
  );
};

export default NavBar;
