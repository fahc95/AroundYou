import React, { useEffect, useState } from 'react';
import {
  GoogleMap,
  useLoadScript,
  Marker,
  InfoWindow
} from "@react-google-maps/api";
import SearchBox from "./components/SearchBox/SearchBox.jsx"
import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";

const coordsBarcelona = {
  lat: 41.384747,
  lng: 2.176391
};

const libraries = ["places"];

const mapContainerStyle = {
  width: '70vw',
  height: '50vh'
};

const mapOptions = {
  disableDefaultUI: true,
  zoomControl: true
}

export default function App() {
  // const [logged, setLoginStatus] = useState(false);
  // const [photo, setPhoto] = useState('');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) return "Error loading Maps";
  if (!isLoaded) return "Loading...";
  if (isLoaded) console.log("API Loaded");

  return (
    <div>
      <div className="my-5 d-flex justify-content-center">
        <SearchBox lat={coordsBarcelona.lat} lng={coordsBarcelona.lng} />
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          zoom={12}
          center={coordsBarcelona}
          options={mapOptions}
        ></GoogleMap>
      </div>
    </div>
  );
}

