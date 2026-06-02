import "./App.css";
import { useState, useEffect } from "react"; // <-- added useEffect
import pic from "./assets/picture.webp";
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
  const [oldBackgroundUrl, setOldBackgroundUrl] = useState(defaultBg); // for background transitions
  const [showOld, setShowOld] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const URL = `https://api.weatherapi.com/v1/forecast.json?key=${key}&q=${city}`;

  // useEffect for geolocation (runs once after mount)
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
          setErrorMessage("Oops. Please try again.");
        },
      );
    };
    getLocation();
  }, [key]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(""); // clear after 5 seconds
      }, 5000);

      // cleanup if component unmounts or errorMessage changes
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  let handleChange = (event) => {
    setCity(event.target.value);
  };

  const addC = async () => {
    if (city === "") {
      alert("Write something !");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(URL);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
        setErrorMessage("Failed to fetch. Please try again.");
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
      setErrorMessage("Failed to fetch. Please try again.");
    } finally {
      setCity("");
      setLoading(false);
    }
  };

  // useEffect for background (runs whenever description changes)
  useEffect(() => {
    const getBackground = async () => {
      if (!description) return;
      try {
        const query = `${description}`;
        const response = await fetch(
          `https://api.pexels.com/v1/search?query=${query},${"weather"}`,
          {
            headers: {
              Authorization: import.meta.env.VITE_BACKGROUND_API_KEY,
            },
          },
        );
        const data = await response.json();
        if (data.photos && data.photos.length > 0) {
          const newUrl = data.photos[0].src.landscape;
          setOldBackgroundUrl(backgroundUrl); // keep the old one
          setBackgroundUrl(newUrl); // set the new one
          setShowOld(true);
          setShowNew(true);
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
      setLoading(true);
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
      setErrorMessage("Failed to fetch. Please try again.");
    } finally {
      setCity("");
      setLoading(false);
    }
  };

  return (
    <>
      <div className="myBackground relative">
        {/* Old background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${oldBackgroundUrl})`,
            opacity: showOld ? 1 : 0,
          }}
          onTransitionEnd={() => setShowOld(false)} // hide old after fade
        />

        {/* New background */}
        <div
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url(${backgroundUrl})`,
            opacity: showNew ? 1 : 0,
          }}
        />

        {/* Overlay and content */}

        {errorMessage && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-4 py-2 rounded z-20 mb-4">
            {errorMessage}
          </div>
        )}

        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container relative z-10 text-white flex flex-col items-center min-h-screen min-w-screen p-6">
          {/* ... your Search, Current, HourlyForecast etc. */}

          <div className="absolute inset-0 bg-black/30"></div>

          <div className="container relative z-10 text-white flex flex-col items-center min-h-screen min-w-screen p-6">
            <Search
              city={city}
              addC={addC}
              handleChange={handleChange}
              locate={locate}
            />

            <div className=" Weather-section mt-10 ">
              <Current
                countryTitle={countryTitle}
                state={state}
                description={description}
                temperature={temperature}
                minTemp={minTemp}
                maxTemp={maxTemp}
                icon={weatherData?.current?.condition?.icon}
                loading={loading}
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
                        loading={loading}
                      />
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
