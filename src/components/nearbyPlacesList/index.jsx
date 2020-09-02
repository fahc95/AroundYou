import React from "react";
import "./nearbyPlaces.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function List({ nearbyPlaces, handleOnClick }) {
  if (nearbyPlaces === undefined) return "";

  console.log("Comp -> nearbyPlaces");
  console.log(nearbyPlaces);
  return (
    <div className="nearbyPlacesContainer">
      {nearbyPlaces.slice(0, 8).map((place, index) => (
        <div key={index} className="nearbyPlace">
          <div className="placePhoto">
            <img
              src={place.photos !== undefined ? place.photos[0].getUrl() : ""}
              width={180}
              height={150}
            />
          </div>
          <div>{place.name}</div>
          <div>{place.rating}</div>
          <div>
            <button
              id="searchBtn"
              className="btn btn-primary"
              onClick={handleOnClick}
            >
              Seleccionar
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
