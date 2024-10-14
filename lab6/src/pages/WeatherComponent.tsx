import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './WeatherComponent.css';

interface WeatherData {
    list: {
        dt: number;
        main: {
            temp: number;
            feels_like: number;
            humidity: number;
            temp_min: number;
            temp_max: number;
        };
        weather: {
            description: string;
            icon: string;
        }[];
        wind: {
            speed: number;
            deg: number;
        };
        dt_txt: string;
    }[];
    city: {
        name: string;
    };
}

const WeatherComponent: React.FC = () => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWeatherData = async (lat: number, lon: number) => {
            try {
                const response = await axios.get(
                    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=fbcd1052281eeb55d199ad502ff69181`
                );
                setWeatherData(response.data);
            } catch (err: any) {
                setError('Error fetching weather data');
            }
        };

        const getLocationAndFetchWeather = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    position => {
                        const { latitude, longitude } = position.coords;
                        fetchWeatherData(latitude, longitude);
                    },
                    () => {
                        setError('Error getting user location');
                    }
                );
            } else {
                setError('Geolocation is not supported by this browser');
            }
        };

        getLocationAndFetchWeather();
    }, []);

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    if (!weatherData || !weatherData.city || !weatherData.list) {
        return <div className="loading">Loading...</div>;
    }

    const filteredList = weatherData.list.filter(entry => entry.dt_txt.includes('12:00:00'));

    return (
        <div className="weather-container">
            <h1 className="city-name">Weather Forecast in {weatherData.city.name}</h1>
            <div className="weather-list">
                {filteredList.map((weather, index) => (
                    <div key={index} className="weather-card">
                        <h3>{new Date(weather.dt * 1000).toLocaleDateString()} {weather.dt_txt.split(' ')[1]}</h3>
                        <div className="weather-info">
                            <img
                                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                alt="weather icon"
                                className="weather-icon"
                            />
                            <div className="weather-details">
                                <p>Temperature: {weather.main.temp}°C</p>
                                <p>Condition: {weather.weather[0].description}</p>
                                <p>Feels Like: {weather.main.feels_like}°C</p>
                                <p>Min: {weather.main.temp_min}°C, Max: {weather.main.temp_max}°C</p>
                                <p>Humidity: {weather.main.humidity}%</p>
                                <p>Wind: {weather.wind.speed} m/s at {weather.wind.deg}°</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WeatherComponent;
