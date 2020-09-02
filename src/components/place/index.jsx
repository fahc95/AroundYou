import React, { useState } from "react";
import { Rating, PhotoAlbum, Hours, Comments } from "..";
import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./place.css";

export default function Place({ place, placeLoaded }) {
  const [mainPhotoUrl, setMainPhotoUrl] = useState("");

  if (place === undefined) return "";

  return (
    <div
      className="placeContainer px-1"
      style={{
        display: !placeLoaded ? "none" : "",
      }}
    >
      <div className="placeCard shadow bg-white rounded">
        <Card>
          <Card.Header>
            <Card.Title>{place.name}</Card.Title>
            <Card.Subtitle>{place.address}</Card.Subtitle>
          </Card.Header>
          <Card.Body>
            <Card.Img
              variant="top"
              alt={place.name}
              src={mainPhotoUrl ? mainPhotoUrl : place.mainPhoto}
              width={600}
              height={400}
              className="img-fluid shadow bg-white rounded"
            />
            <hr></hr>

            <Rating rating={place.rating} />
            <Hours openingHours={place.opening_hours} />

            <hr></hr>

            <PhotoAlbum
              placePhotos={place.photos}
              setMainPhoto={setMainPhotoUrl}
            />
            <hr></hr>
            <Comments reviews={place.reviews} />
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}
