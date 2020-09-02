import React from "react";
import "./map.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function GoogleMap({ placeLoaded, queryString, handleOnClick }) {
  return (
    <div className="mapContainer">
      <div className="mapControls">
        <input
          id="searchBox"
          className="searchBox"
          type="text"
          placeholder="Busca un lugar ..."
        />
        <button
          id="searchBtn"
          className="btn btn-primary"
          onClick={handleOnClick}
          style={{ display: queryString === "" ? "none" : "" }}
        >
          Seleccionar Lugar
        </button>
      </div>

      <div id="map" className="px-1"></div>

      <div
        id="infowindow-content"
        style={{
          display: !placeLoaded ? "none" : "",
        }}
      >
        <img src="" width="16" height="16" id="place-icon" />
        <span id="place-name" className="title"></span>
        <br />
        <span id="place-address"></span>
      </div>
    </div>
  );
}
