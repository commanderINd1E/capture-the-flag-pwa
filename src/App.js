// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import NavBar from './NavBar';
import MapView from './MapView'
import Logout from './Logout';
import MapEdit from './MapEdit';
import { UserProvider } from './UserContext';

const App = () => {
   return (
    <UserProvider>
     <Router>
      <NavBar />
      <Routes>
        <Route path="/map" element={<MapView />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/edit" element={<MapEdit />} />
      </Routes>
     </Router>
    </UserProvider>
  );
};

export default App;
