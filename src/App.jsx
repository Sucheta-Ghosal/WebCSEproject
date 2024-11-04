import React, { useEffect, useState } from 'react';
import Weather from './components/Weather.jsx';
import Navbar from './components/Navbar.jsx';
import './App.css'; // Ensure to import the CSS file

const App = () => {
  const [recentCities, setRecentCities] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const data = window.localStorage.getItem("recent");
    const recent = data === null ? [] : JSON.parse(data);
    setRecentCities(recent);
  }, []);

  return (
    <div className="app">
      <Navbar 
        recentCities={recentCities} 
        toggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)} 
        isDropdownOpen={isDropdownOpen} 
      />
      <Weather recentCities={recentCities} addDataToRecent={setRecentCities} />
    </div>
  );
};

export default App;


