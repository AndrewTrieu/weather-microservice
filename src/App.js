import React, { useState } from "react";
import axios from "axios";

function App() {
  const [option, setOption] = useState("");
  const [location, setLocation] = useState("");
  const [timestamp, setTimestamp] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const currentAddress = "http://localhost:8080";
  const realtimeAddress = "http://localhost:4000";
  const historicalAddress = "http://localhost:7000";

  const handleOptionChange = (event) => {
    setOption(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleTimestampChange = (event) => {
    setTimestamp(event.target.value);
  };

  const handleGetWeatherData = async () => {
    try {
      let response;
      if (option === "realtime") {
        response = await axios.get(
          `${realtimeAddress}/real-time-weather?location=${location}`
        );
      } else if (option === "current") {
        response = await axios.get(`${currentAddress}/current-weather?`);
      } else {
        response = await axios.get(
          `${historicalAddress}/historical-weather?location=${location}&timestamp=${timestamp}`
        );
      }
      console.log(response.data);
      setWeatherData(response.data);
    } catch (error) {
      console.error("Could not fetch weather data", error);
    }
  };

  return (
    <div>
      <div>
        <label>
          <input
            type="radio"
            name="option"
            value="current"
            checked={option === "current"}
            onChange={handleOptionChange}
          />
          Current weather
        </label>
        <label>
          <input
            type="radio"
            name="option"
            value="realtime"
            checked={option === "realtime"}
            onChange={handleOptionChange}
          />
          Realtime weather
        </label>
        <label>
          <input
            type="radio"
            name="option"
            value="historical"
            checked={option === "historical"}
            onChange={handleOptionChange}
          />
          Historical weather
        </label>
      </div>
      {option === "realtime" && (
        <div>
          <label>
            Location:
            <input
              type="text"
              value={location}
              onChange={handleLocationChange}
            />
          </label>
        </div>
      )}
      {option === "historical" && (
        <div>
          <label>
            Location:
            <input
              type="text"
              value={location}
              onChange={handleLocationChange}
            />
          </label>
          <label>
            Timestamp (in UNIX format):
            <input
              type="text"
              value={timestamp}
              onChange={handleTimestampChange}
            />
          </label>
        </div>
      )}
      <div>
        <button onClick={handleGetWeatherData}>Get Weather Data</button>
      </div>
      {weatherData && (
        <div>
          <p>Location: {weatherData.location}</p>
          <p>
            Weather: {weatherData.weather.main} (
            {weatherData.weather.description})
          </p>
          <p>Temperature: {weatherData.temperature}°C</p>
          <p>Humidity: {weatherData.humidity}%</p>
          <p>Wind Speed: {weatherData.windSpeed} m/s</p>
          <p>Wind Direction: {weatherData.windDirection}°</p>
          <p>Timestamp: {weatherData.timestamp.toString()}</p>
        </div>
      )}
    </div>
  );
}

export default App;
