import Head from "next/head";
import Image from "next/image";
import localFont from "next/font/local";
import styles from "@/styles/Home.module.css";
import { useState } from "react";
import axios from "axios";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const API_KEY = "28e5650e4fd7fc77a0a6e56adeab75a6";
const BASE_URL = "https://api.openweathermap.org/data/2.5/";

const getWeatherData = async (city) => {
  try {
    const response = await axios.get(
      `${BASE_URL}weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data", error);
    return null;
  }
};

const getForecastData = async (city) => {
  try {
    const response = await axios.get(
      `${BASE_URL}forecast?q=${city}&units=metric&cnt=3&appid=${API_KEY}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching forecast data", error);
    return null;
  }
};

export default function WeatherApp() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const weatherData = await getWeatherData(city);
    const forecastData = await getForecastData(city);
    setWeather(weatherData);
    setForecast(forecastData);
    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Weather App</h1>
      <input
        type="text"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        placeholder="Enter city name"
      />
      <button onClick={handleSearch}>Search</button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {weather && (
            <div>
              <h2>{weather.name}</h2>
              <p>{weather.weather[0].description}</p>
              <p>Temperature: {weather.main.temp}°C</p>
            </div>
          )}
          {forecast && (
            <div>
              <h3>3-day Forecast</h3>
              {forecast.list.map((day, index) => (
                <div key={index}>
                  <p>{new Date(day.dt * 1000).toLocaleDateString()}</p>
                  <p>Temp: {day.main.temp}°C</p>
                  <p>{day.weather[0].description}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
