import React, { useState, useEffect, useRef } from "react";
import { Place, GoogleMap, NearbyPlaces } from "./components";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

let map;
const google = window.google;
const coordsBarcelona = {
  lat: 41.384747,
  lng: 2.176391,
};

export default function App() {
  const [mapCenter, setMapCenter] = useState(coordsBarcelona);
  const [userLocation, setuserLocation] = useState();
  const [destination, setDestination] = useState();
  const [place, setPlace] = useState();
  const [nearbyPlaces, setNearbyPlaces] = useState();
  const [placeLoaded, setPlaceLoaded] = useState(false);
  const [queryString, setQueryString] = useState("");
  const mapRef = useRef(map);
  let placesService;
  let mainPhoto;

  useEffect(() => {
    // Gets users current location if allowed
    if (navigator.geolocation)
      navigator.geolocation.getCurrentPosition((position) => {
        setMapCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setuserLocation(mapCenter);
      });

    if (google) {
      console.log("Places API Loaded");

      if (mapRef.current === undefined) {
        mapRef.current = new google.maps.Map(document.getElementById("map"), {
          center: userLocation ? userLocation : mapCenter,
          zoom: 12,
          disableDefaultUI: true,
          zoomControl: true,
        });

        new google.maps.Marker({
          position: userLocation ? userLocation : mapCenter,
          map: mapRef.current,
          draggable: true,
        });

        let searchBox = document.getElementById("searchBox");
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

          setDestination(place.geometry.location);
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
          setQueryString(searchBox.value);
        });
      }
    }
  });

  const handleOnClickSelectPlace = () => {
    const requestFindPlace = {
      query: queryString,
      fields: ["photos", "place_id"],
    };

    const requestNearbyPlaces = {
      location: destination,
      radius: "500",
      openNow: true,
    };

    placesService = new google.maps.places.PlacesService(mapRef.current);
    placesService.findPlaceFromQuery(requestFindPlace, findPlace);
    placesService.nearbySearch(requestNearbyPlaces, searchNearbyPlaces);
  };

  const searchNearbyPlaces = (results, status) => {
    const nearbyPlacesTemp = [];
    if (status === "OK") {
      results.map((result) => {
        nearbyPlacesTemp.push(result);
      });
    }
    setNearbyPlaces(nearbyPlacesTemp);
  };

  const findPlace = (results, status) => {
    if (status === "OK") {
      results.map((result) => {
        let place_id = result.place_id;
        mainPhoto = result.photos ? result.photos[0].getUrl() : "";
        if (place_id !== undefined) findePLaceDetail(place_id);
      });
    }
  };

  const findePLaceDetail = (place_id) => {
    const request = {
      placeId: place_id,
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
        });
      }
      const placeTemp = {
        id: place.place_id,
        name: place.name,
        address: place.formatted_address,
        mainPhoto: mainPhoto,
        photos: placePhotos,
        opening_hours: place.opening_hours,
        rating: place.rating,
        reviews: place.reviews,
      };
      setPlace(placeTemp);
      setPlaceLoaded(true);
    }
  };

  return (
    <div className="mainContainer pt-3">
      <div
        className="map_NearbyPlacesContainer px-2"
        style={{
          width: placeLoaded ? "70%" : "98%",
        }}
      >
        <GoogleMap
          placeLoaded={placeLoaded}
          handleOnClick={handleOnClickSelectPlace}
          queryString={queryString}
        />
        <NearbyPlaces
          nearbyPlaces={nearbyPlaces}
          handleOnClick={handleOnClickSelectPlace}
        />
      </div>
      <Place place={place} placeLoaded={placeLoaded} />
    </div>
  );
}
