import React, { useEffect, useRef, useState } from 'react';
import './Weather.css';
import search_icon from '../assets/search_icon.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import humidity_icon from '../assets/humidity.png';
import sunnyVideo from '../assets/sunny_video.mp4';
import rainyVideo from '../assets/rain_video.mp4';
import drizzleVideo from '../assets/drizzle_video.mp4';
import cloudyVideo from '../assets/cloudy_video.mp4';
import snowyVideo from '../assets/snowy_video.mp4';
import empty_star from '../assets/fav1.png';
import filled_star from '../assets/fav2.png';

const Weather = ({ recentCities, addDataToRecent }) => {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const [forecastData, setForecastData] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false); // New state for favorite status

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const videoMap = {
    "Clear": sunnyVideo,
    "Rain": rainyVideo,
    "Clouds": cloudyVideo,
    "Snow": snowyVideo,
    "Drizzle": drizzleVideo,
  };

  const search = async (city) => {
    if (city === "") {
      alert("Enter City Name");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      const icon = allIcons[data.weather[0].icon] || clear_icon;

      setWeatherData({
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
        condition: data.weather[0].main,
      });

      // Check if the city is already in favorites
      setIsFavorite(recentCities.includes(data.name));

      // Fetch forecast data
      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${import.meta.env.VITE_API5_ID}`;
      const forecastResponse = await fetch(forecastUrl);
      const forecastData = await forecastResponse.json();

      if (!forecastResponse.ok) {
        alert(forecastData.message);
        return;
      }

      const dailyForecast = [];
      for (let i = 0; i < forecastData.list.length; i += 8) {
        const dayData = forecastData.list[i];
        dailyForecast.push({
          temperature: Math.floor(dayData.main.temp),
          wind: dayData.wind.speed,
          humidity: dayData.main.humidity,
          icon: allIcons[dayData.weather[0].icon] || clear_icon,
          date: new Date(dayData.dt * 1000).toLocaleDateString(),
        });
      }

      setForecastData(dailyForecast);

    } catch (error) {
      setWeatherData(false);
      console.error("Error in fetching weather data");
    }
  };

  const handleAddToFavorites = (city) => {
    let updatedCities;
    if (!recentCities.includes(city)) {
      updatedCities = [...recentCities, city];
      setIsFavorite(true); // Set as favorite
    } else {
      updatedCities = recentCities.filter(c => c !== city);
      setIsFavorite(false); // Remove from favorites
    }
    addDataToRecent(updatedCities);
    window.localStorage.setItem("recent", JSON.stringify(updatedCities));
  };

  return (
    <div className='weather'>
      {weatherData && (
        <video autoPlay loop muted className='background-video' src={videoMap[weatherData.condition] || sunnyVideo} />
      )}
      
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder='Search for a City' />
        <img src={search_icon} alt="" onClick={() => search(inputRef.current.value)} />
      </div>

      <div className="weather-and-forecast">
        {weatherData ? (
          <div className="current-weather">
            <img src={weatherData.icon} alt="" className='weather-icon' />
            <p className='temperature'>{weatherData.temperature}°C</p>
            <p className='location'>{weatherData.location}</p>
            <div className='favorite'>
              <img 
                src={isFavorite ? filled_star : empty_star} 
                alt="" 
                onClick={() => handleAddToFavorites(weatherData.location)} 
              />
            </div>
            <div className='weather-data'>
              <div className="col">
                <img src={humidity_icon} alt="" />
                <div>
                  <p>{weatherData.humidity} %</p>
                  <span>Humidity</span>
                </div>
              </div>
              <div className="col">
                <img src={wind_icon} alt="" />
                <div>
                  <p>{weatherData.windSpeed} km/h</p>
                  <span>Wind Speed</span>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div className='forecast-container'>
          {forecastData.map((day, index) => (
            <div key={index} className='forecast-box'>
              <p className='date'>{day.date}</p>
              <img src={day.icon} alt="weather icon" />
              <p className='day_temp'>{day.temperature}°C</p>
              <div className="for">
                <img src={wind_icon} alt="" className="icon" />
                <div>
                  <p>{day.wind} km/h</p>
                  <span>Wind Speed</span>
                </div>
              </div>
              <div className="for">
                <img src={humidity_icon} alt="" className="icon" />
                <div>
                  <p>{day.humidity} %</p>
                  <span>Humidity</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Weather;

