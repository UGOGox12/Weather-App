import pic from "./assets/picture.webp";

function HourlyForcast(props) {
  return (
    <>
      <div className="hourly-forecast mt-8 w-full overflow-x-auto relative">
        {props.loading && (
          <div className="preloader flex flex-col items-center p-2 ">
            <div className="skeleton skeleton-text w-[80%]"></div>
            <div className="skeleton skeleton-circle"></div>
            <div className="skeleton skeleton-text w-[80%]"></div>
          </div>
        )}
        <ul className="hourly-list flex gap-4">
          <li className="hourly-item flex flex-col items-center justify-center bg-white/10 backdrop-blur-md rounded-lg p-3 w-24">
            <p className="hour text-sm">{props.hour.slice(11, 16)}</p>
            <img
              src={props.icon || pic}
              alt="Weather Icon"
              className="hourly-icon w-10 h-10 my-2"
            />
            <p className="hourly-temp font-semibold">
              {props.temperature}°
              <span className="text-sm align-top text-white/70">c</span>
            </p>
          </li>
        </ul>
      </div>
    </>
  );
}

export default HourlyForcast;
