import pic from "./assets/picture.webp";
import "./App.css";
function Current(props) {
  return (
    <div
      className={` relative current-weather flex flex-col items-center justify-center bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-lg `}
    >
      {props.loading && (
        <div className="preloader flex flex-col items-center p-2 ">
          <div className="skeleton skeleton-text w-[60%]"></div>
          <div className="skeleton skeleton-circle"></div>
          <div className="skeleton skeleton-text w-[50%]"></div>
          <div className="skeleton skeleton-text w-[65%]"></div>
          <div className="skeleton skeleton-text w-[80%]"></div>
        </div>
      )}{" "}
      <p>
        {props.countryTitle} / {props.state}
      </p>
      <img src={props.icon || pic} alt="Weather Icon" className=" w-24 h-24" />
      <h1 className="temperature text-5xl font-bold text-center">
        {props.temperature}°
        <span className="text-[2rem] align-top text-white/70">c</span>
      </h1>
      <p className="weather-description text-gray-200">{props.description}</p>
      <p className="text-sm text-gray-300 mt-2 text-center">
        Min {props.minTemp}° / Max {props.maxTemp}°
      </p>
    </div>
  );
}

export default Current;
