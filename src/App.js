import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Place } from "./components";
import { Container } from "react-bootstrap";

const google = window.google;
let map;
const coordsBarcelona = {
  lat: 41.384747,
  lng: 2.176391,
};

export default function App() {
  const [mapCenter, setCoords] = useState(coordsBarcelona);
  const [userMarker, setUserMarker] = useState(mapCenter);
  const [place, setPlace] = useState({});
  const [placeLoaded, setPlaceLoaded] = useState(false);
  const [queryString, setQueryString] = useState("");
  // const [placePhotos, setPlacePhotos] = useState([""]);
  const mapRef = useRef(map);
  let placesService;

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
      console.log("Places API Loaded");
      if (mapRef.current === undefined) {
        mapRef.current = new google.maps.Map(document.getElementById("map"), {
          center: mapCenter,
          zoom: 12,
          disableDefaultUI: true,
          zoomControl: true,
        });

        new google.maps.Marker({
          position: userMarker,
          map: mapRef.current,
          draggable: true,
        });

        let searchBox = document.getElementById("searchBox");
        let searchBtn = document.getElementById("searchBtn");

        mapRef.current.controls[google.maps.ControlPosition.TOP_CENTER].push(
          searchBox
        );
        mapRef.current.controls[google.maps.ControlPosition.TOP_CENTER].push(
          searchBtn
        );

        let autocomplete = new google.maps.places.Autocomplete(searchBox);

        autocomplete.bindTo("bounds", mapRef.current);
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
          map: mapRef.current,
          anchorPoint: new google.maps.Point(0, -29),
        });

        autocomplete.addListener("place_changed", () => {
          infowindow.close();
          marker.setVisible(false);
          const place = autocomplete.getPlace();

          if (!place.geometry) {
            window.alert(
              "No details available for input: '" + place.name + "'"
            );
            return;
          }

          // If the place has a geometry, then present it on a map.
          if (place.geometry.viewport) {
            mapRef.current.fitBounds(place.geometry.viewport);
          } else {
            mapRef.current.setCenter(place.geometry.location);
            mapRef.current.setZoom(17);
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
          infowindow.open(mapRef.current, marker);
          setQueryString(address);
        });
      }
    }
  });

  const handleOnClick = () => {
    const request = {
      query: queryString,
      fields: ["photos", "formatted_address", "name", "place_id"],
    };
    placesService = new google.maps.places.PlacesService(mapRef.current);
    placesService.findPlaceFromQuery(request, findPlace);
    console.log(place);
  };

  const findPlace = (results, status) => {
    if (status === "OK") {
      results.map((result) => {
        let place_id = result.place_id;
        if (place_id !== undefined) findePLaceDetail(place_id);
      });
    }
  };

  const findePLaceDetail = (placeFound) => {
    const request = {
      placeId: placeFound,
      fields: [
        "address_component",
        "adr_address",
        "alt_id",
        "formatted_address",
        "icon",
        "id",
        "name",
        "photo",
        "place_id",
        "plus_code",
        "scope",
        "type",
        "url",
        "vicinity",
        "geometry",
        "rating",
        "reviews",
        "opening_hours",
      ],
    };
    placesService.getDetails(request, foundPlaceDetail);
  };

  const foundPlaceDetail = (place, status) => {
    if (status === "OK") {
      let placePhotos = [""];
      if (place.photos) {
        place.photos.map((placePhoto, index) => {
          placePhotos[index] = placePhoto.getUrl();
          if (index === 5) return;
        });
      }
      const placeTemp = {
        id: place.place_id,
        name: place.name,
        address: place.formatted_address,
        photos: placePhotos,
      };
      setPlace(placeTemp);
      setPlaceLoaded(true);
    }
  };

  return (
    <Container fluid className="d-flex flex-column align-items-center">
      <div className="py-4 d-flex justify-content-center">
        <input
          id="searchBox"
          className="controls"
          type="text"
          placeholder="Busca un lugar ..."
        />
        <button
          id="searchBtn"
          className="btn btn-primary"
          onClick={handleOnClick}
          style={{ display: queryString === "" ? "none" : "" }}
        >
          Buscar
        </button>
        <div id="map"></div>
        <div id="infowindow-content">
          <img src="" width="16" height="16" id="place-icon" />
          <span id="place-name" className="title"></span>
          <br />
          <span id="place-address"></span>
        </div>
      </div>
      <div
        style={{ display: !placeLoaded ? "none" : "" }}
        className="selectedPlace"
      >
        <Place place={place} />
      </div>
    </Container>
  );
}
