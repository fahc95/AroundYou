import React from "react";
import "./photoAlbum.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function PhotoCarousel({ placePhotos, setMainPhoto }) {
  if (placePhotos === undefined) return "";
  return (
    <div className="photoAlbumContainer">
      {placePhotos.slice(0, 6).map((photo, index) => (
        <div
          key={index}
          className="btn p-0 my-1"
          onClick={() => {
            setMainPhoto(photo);
          }}
        >
          <img src={photo} width={160} height={100} />
        </div>
      ))}
    </div>
  );
}
