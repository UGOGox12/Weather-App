import "./App.css";
import { useState } from "react";
import hero from "./assets/hero.png";
import sunny from "./assets/sunny.webp";
import HourlyForcast from "./HourlyForcast.jsx";
import Current from "./current.jsx";
import Search from "./Search.jsx";



function App() {
  const myStyle = {

  };

const key = import.meta.env.VITE_WEATHER_API_KEY;

  let time = new Date().getHours();


  const [city, setCity] = useState("");
  const [country, setCountry] = useState("Country");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("State");
  const [temperature, setTemperature] = useState("0");
  const [minTemp, setMinTemp] = useState("0");
  const [maxTemp, setMaxTemp] = useState("0");
  const [weatherData, setWeatherData] = useState(null);
  const [myURL, setMyURL] = useState("");

  const URL = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}`;


const getLocation = () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${latitude},${longitude}`;
      setMyURL(url); // save to state

    },
    (error) => {
      console.error("Error getting location:", error);
    }
  );
};

getLocation();

  let handleChange = (event) => {
    setCity(event.target.value);
  };

  const addC = async () => {
    if (city === "") {
      alert("Write something !");
      return;
    }

    try {
      const response = await fetch(URL); // <-- await here always with fetch
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json(); // now works
      setWeatherData(data);
      setCountry(data.location.country);

      setState(data.location.name);

      setDescription(data.current.condition.text);
      setTemperature(Math.floor(data.current.temp_c));
      setMinTemp(data.forecast.forecastday[0].day.mintemp_c);
      setMaxTemp(data.forecast.forecastday[0].day.maxtemp_c);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
    setCity("");
  };

  

  const locate = async () => {

    try {
      const response = await fetch(myURL); // <-- await here always with fetch
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json(); // now works
      setWeatherData(data);
      setCountry(data.location.country);

      setState(data.location.name);

      setDescription(data.current.condition.text);
      setTemperature(Math.floor(data.current.temp_c));
      setMinTemp(data.forecast.forecastday[0].day.mintemp_c);
      setMaxTemp(data.forecast.forecastday[0].day.maxtemp_c);
    } catch (error) {
      console.error("Error fetching weather data:", error);
    }
    setCity("");
  };


  return (
    <>
      <div className=" myBackground relative ">
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Main container */}
        <div className="container relative z-10 text-white flex flex-col items-center min-h-screen min-w-screen p-6">
          {/* Search section */}
          <Search city={city} addC={addC} 
          handleChange={handleChange} 
          locate={locate} 
          />

          {/* Weather section */}
          <div className="Weather-section mt-10">
            <Current
              country={country}
              state={state}
              description={description}
              temperature={temperature}
              minTemp={minTemp}
              maxTemp={maxTemp}
              icon={weatherData?.current?.condition?.icon}
            />

            {/* hourly forecast section */}
<div className="hourly-forecast flex flex-row gap-4 ">
  {weatherData &&
    weatherData.forecast.forecastday[0].hour.slice(time+1, time+5).map((h, index) => (
      <HourlyForcast
        key={index}
        hour={h.time}
        temperature={h.temp_c}
        icon={h.condition.icon}

      />
    ))}
</div>
            
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
