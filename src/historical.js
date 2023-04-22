import express from "express";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

// Define OpenWeatherMap API endpoint and API key
const OPENWEATHERMAP_API_ENDPOINT =
  "https://api.openweathermap.org/data/3.0/onecall/timemachine";
const OPENWEATHERMAP_API_KEY = process.env.OPENWEATHERMAP_API_KEY;

// Define function for fetching historical weather data from OpenWeatherMap API
async function getHistoricalWeatherData(location, timestamp) {
  const url = `${OPENWEATHERMAP_API_ENDPOINT}?lat=${location.lat}&lon=${location.lon}&dt=${timestamp}&appid=${OPENWEATHERMAP_API_KEY}&units=metric`;
  const response = await axios.get(url);
  const { timezone_offset, data } = response.data;
  console.log(data[0].weather[0]);
  return {
    location: location.name,
    weather: data[0].weather[0],
    temperature: data[0].temp,
    humidity: data[0].humidity,
    windSpeed: data[0].wind_speed,
    windDirection: data[0].wind_deg,
    timestamp: new Date(data[0].dt * 1000 + timezone_offset * 1000),
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

// Define API endpoint for getting historical weather data
app.get("/historical-weather", async (req, res) => {
  const location = req.query.location;
  const timestamp = req.query.timestamp;
  // Fetch location data from OpenWeatherMap API
  try {
    const locationUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${OPENWEATHERMAP_API_KEY}`;
    const locationResponse = await axios.get(locationUrl);
    const { name, coord } = locationResponse.data;

    // Fetch historical weather data from OpenWeatherMap API
    const historicalWeatherData = await getHistoricalWeatherData(
      { name, lat: coord.lat, lon: coord.lon },
      timestamp
    );
    res.json(historicalWeatherData);
  } catch (error) {
    console.error("Could not fetch historical weather data", error);
    res.status(500).send("Internal server error");
  }
});

// Start Express server
app.listen(7000, () => console.log("Server listening on port 7000"));
