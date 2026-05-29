import location from "./assets/location1.svg"; 
import { useState, useEffect} from "react";


function Search(props) {


    return(
        <div className="search-section flex w-full max-w-lg">
            <form className="search-form flex items-center bg-white/20 backdrop-blur-md rounded-lg px-4 py-2 w-full"
              onSubmit={(e) => {
                props.addC();
                e.preventDefault();
              }}
            >
              <span className="material-symbols-rounded text-gray-200 mr-2">search</span>
              <input
                type="text"
                placeholder="Enter city name"
                className="search-input flex-1 bg-transparent text-white placeholder-gray-300 focus:outline-none"
                value={props.city}
                onChange={props.handleChange}
              />
            </form>

            <button className="location-button ml-4 p-2 rounded-md bg-blue-500 hover:bg-blue-600 hover:animate-pulse"
             onClick={props.locate}
              >
              <img
                className="w-8 h-8"
                src={location}
                alt="Weather Icon"
                
              />
            </button>
          </div>
    );
}
export default Search;