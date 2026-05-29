import sunny from "./assets/sunny.webp";

function Current(props) {
  return (
    <div className="current-weather flex flex-col items-center justify-center bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg">
      <p>
        {props.country} / {props.state}
      </p>
      <img src={props.icon || sunny} alt="Weather Icon" className="w-24 h-24" />
      <h1 className="temperature text-5xl font-bold text-center">
        {props.temperature}°<span className="text-[2rem] align-top text-white/70">c</span>
      </h1>
      <p className="weather-description text-gray-200">{props.description}</p>
      <p className="text-sm text-gray-300 mt-2 text-center">
        Min {props.minTemp}° / Max {props.maxTemp}°
      </p>
    </div>
  );
}

export default Current;
