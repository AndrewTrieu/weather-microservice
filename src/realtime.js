import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Define OpenWeatherMap API endpoint and API key
const OPENWEATHERMAP_API_ENDPOINT =
  "https://api.openweathermap.org/data/2.5/weather";
const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

// Define function for fetching realtime weather data from OpenWeatherMap API
async function getRealtimeWeatherData(location) {
  const url = `${OPENWEATHERMAP_API_ENDPOINT}?q=${location}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
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

// Define API endpoint for getting real-time weather data
app.get("/real-time-weather", async (req, res) => {
  const location = req.query.location;

  // Fetch weather data from OpenWeatherMap API
  try {
    const realtimeWeatherData = await getRealtimeWeatherData(location);
    res.json(realtimeWeatherData);
  } catch (error) {
    console.error("Could not fetch weather data", error);
    res.status(500).send("Internal server error");
  }
});

// Start Express server
app.listen(4000, () => console.log("Server listening on port 4000"));
