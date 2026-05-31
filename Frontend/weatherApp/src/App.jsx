import "./App.css";
import { useState, useEffect } from "react"; // <-- added useEffect
import sunny from "./assets/sunny.webp";
import HourlyForcast from "./HourlyForcast.jsx";
import Current from "./current.jsx";
import Search from "./Search.jsx";
import defaultBg from "./assets/background.jpg";

function App() {
  const key = import.meta.env.VITE_WEATHER_API_KEY;

  let time = new Date().getHours();

  const [city, setCity] = useState("");
  const [countryTitle, setCountryTitle] = useState("Country");
  const [country, setCountry] = useState("");
  const [description, setDescription] = useState("");
  const [state, setState] = useState("State");
  const [temperature, setTemperature] = useState("0");
  const [minTemp, setMinTemp] = useState("0");
  const [maxTemp, setMaxTemp] = useState("0");
  const [weatherData, setWeatherData] = useState(null);
  const [myURL, setMyURL] = useState("");
  const [backgroundUrl, setBackgroundUrl] = useState(defaultBg);

  const URL = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}`;

  // ✅ useEffect for geolocation (runs once after mount)
  useEffect(() => {
    const getLocation = () => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${latitude},${longitude}`;
          setMyURL(url);
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    };
    getLocation();
  }, [key]);

  let handleChange = (event) => {
    setCity(event.target.value);
  };

  const addC = async () => {
    if (city === "") {
      alert("Write something !");
      return;
    }

    try {
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setWeatherData(data);
      setCountry(data.location.country);
      setCountryTitle(data.location.country);
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

  // ✅ useEffect for background (runs whenever country/description changes)
  useEffect(() => {
    const getBackground = async () => {
      if (!country && !description) return;
      try {
        const query = `${description} ${country}`;
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${query}`,
          {
            headers: {
              Authorization: import.meta.env.VITE_BACKGROUND_API_KEY,
            },
          }
        );
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          setBackgroundUrl(data.photos[0].src.landscape);

        } else {
          setBackgroundUrl(defaultBg); // fallback
        }
      } catch (error) {
        console.error("Error fetching background image:", error);
        setBackgroundUrl(defaultBg); // fallback on error
      }
    };
    getBackground();
  }, [country, description]);

  
  const locate = async () => {
    try {
      const response = await fetch(myURL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setWeatherData(data);
      setCountry(data.location.country);
      setCountryTitle(data.location.country);
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
      <div
        className="myBackground relative"
        style={{ backgroundImage: `url(${backgroundUrl})` }}
      >
        <div className="absolute inset-0 bg-black/30"></div>

        <div className="container relative z-10 text-white flex flex-col items-center min-h-screen min-w-screen p-6">
          <Search
            city={city}
            addC={addC}
            handleChange={handleChange}
            locate={locate}
          />

          <div className="Weather-section mt-10">
            <Current
              countryTitle={countryTitle}
              state={state}
              description={description}
              temperature={temperature}
              minTemp={minTemp}
              maxTemp={maxTemp}
              icon={weatherData?.current?.condition?.icon}
            />

            <div className="hourly-forecast flex flex-row gap-4 ">
              {weatherData &&
                weatherData.forecast.forecastday[0].hour
                  .slice(time + 1, time + 5)
                  .map((h, index) => (
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
