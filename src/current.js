import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Define OpenWeatherMap API endpoint and API key
const OPENWEATHERMAP_API_ENDPOINT =
  "https://api.openweathermap.org/data/2.5/weather";
const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

// Define function for fetching weather data from OpenWeatherMap API
async function getWeatherData(location) {
  const url = `${OPENWEATHERMAP_API_ENDPOINT}?lat=${location.lat}&lon=${location.lon}&units=metric&&appid=${OPENWEATHERMAP_API_KEY}`;
  const response = await axios.get(url);
  const { name, main, wind, dt, weather } = response.data;
  return {
    location: name,
    weather: weather[0],
    temperature: main.temp,
    humidity: main.humidity,
    windSpeed: wind.speed,
    windDirection: wind.deg,
    timestamp: new Date(dt * 1000),
  };
}

// Define Express server
const app = express();

// Add middleware to set CORS headers
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

// Define API endpoint for getting current weather data
app.get("/current-weather", async (req, res) => {
  try {
    const ipapiUrl = `https://ipapi.co/json/`;
    const ipapiResponse = await axios.get(ipapiUrl);
    const { city, region, country_name } = ipapiResponse.data;
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${region},${country_name}&appid=${OPENWEATHERMAP_API_KEY}`;
    const geoResponse = await axios.get(geoUrl);
    const currentWeatherData = await getWeatherData(geoResponse.data[0]);
    res.json(currentWeatherData);
  } catch (error) {
    console.error("Could not fetch historical weather data", error);
    res.status(500).send("Internal server error");
  }
});

// Start Express server
app.listen(8080, () => console.log("Server listening on port 8080"));
