import React from 'react';
import './Navbar.css';

const Navbar = ({ recentCities, toggleDropdown, isDropdownOpen }) => {
  return (
    <div className='navbar'>
      <div className='logo'>
        <h2>Weather Dashboard</h2>
      </div>
      <div className='options'>
        <button className='nav-button' onClick={toggleDropdown}>
          Favorite Cities
        </button>
        {isDropdownOpen && (
          <div className="dropdown">
            {recentCities.length > 0 ? (
              <ul>
                {recentCities.map((city, index) => (
                  <li key={index}>{city}</li>
                ))}
              </ul>
            ) : (
              <p>No Favorite cities added yet.</p>
            )}
          </div>
        )}
        <a href="https://edition.cnn.com/weather" className='nav-button'>Weather News</a>
      </div>
    </div>
  );
}

export default Navbar;

