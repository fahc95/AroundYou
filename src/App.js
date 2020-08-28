import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import { Place } from "./components";

const google = window.google;
const coordsBarcelona = {
  lat: 41.384747,
  lng: 2.176391,
};

export default function App() {
  const [mapCenter, setCoords] = useState(coordsBarcelona);
  const [userMarker, setUserMarker] = useState(mapCenter);
  const [query, setQuery] = useState("");
  const [place, setPlace] = useState({});
  const [placePhotos, setPlacePhotos] = useState([""]);
  let map;

  // Gets users current location if allowed
  if (navigator.geolocation)
    navigator.geolocation.getCurrentPosition((position) => {
      setCoords({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
      setUserMarker(mapCenter);
    });

  useEffect(() => {
    if (google) {
      map = new google.maps.Map(document.getElementById("map"), {
        center: mapCenter,
        zoom: 12,
        disableDefaultUI: true,
        zoomControl: true,
      });

      const input = document.getElementById("pac-input");
      map.controls[google.maps.ControlPosition.TOP_CENTER].push(input);
      const autocomplete = new google.maps.places.Autocomplete(input);

      autocomplete.bindTo("bounds", map);
      autocomplete.setFields([
        "address_components",
        "geometry",
        "icon",
        "name",
      ]);

      const infowindow = new google.maps.InfoWindow();
      const infowindowContent = document.getElementById("infowindow-content");
      infowindow.setContent(infowindowContent);
      const marker = new google.maps.Marker({
        map,
        anchorPoint: new google.maps.Point(0, -29),
      });
      autocomplete.addListener("place_changed", () => {
        infowindow.close();
        marker.setVisible(false);
        const place = autocomplete.getPlace();
        console.log(place);

        if (!place.geometry) {
          window.alert("No details available for input: '" + place.name + "'");
          return;
        }

        // If the place has a geometry, then present it on a map.
        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);
        let address = "";

        if (place.address_components) {
          address = [
            (place.address_components[1] &&
              place.address_components[1].long_name) ||
              "",
            (place.address_components[0] &&
              place.address_components[0].long_name) ||
              "",
            (place.address_components[6] &&
              place.address_components[6].long_name) ||
              "",
          ].join(" , ");
        }
        infowindowContent.children["place-icon"].src = place.icon;
        infowindowContent.children["place-name"].textContent = place.name;
        infowindowContent.children["place-address"].textContent = address;
        infowindow.open(map, marker);
        let placeQuery = document.getElementById("pac-input").value;
        placeQuerySearch(placeQuery);
      });
    }
  });

  const placeQuerySearch = (placeQuery) => {
    const request = {
      query: placeQuery,
      fields: ["name", "formatted_address", "geometry", "photos", "place_id"],
    };
    let service = new google.maps.places.PlacesService(map);
    service.findPlaceFromQuery(request, findPlace);
  };

  const findPlace = (results, status) => {
    if (status === "OK") {
      results.map((place) => {
        setPlace({
          id: place.place_id,
          name: place.name,
          address: place.formatted_address,
          geometry: place.geometry,
        });
      });
    }
  };

  return (
    <div>
      <div className="py-4 d-flex justify-content-center">
        <input
          id="pac-input"
          className="controls"
          type="text"
          placeholder="Busca un lugar ..."
        />
        <div id="map"></div>
        <div id="infowindow-content">
          <img src="" width="16" height="16" id="place-icon" />
          <span id="place-name" className="title"></span>
          <br />
          <span id="place-address"></span>
        </div>
      </div>
      <Place place={place} />
    </div>
  );
}
