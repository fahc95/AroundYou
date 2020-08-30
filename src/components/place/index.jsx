import React, { useState } from "react";
import { Card } from "react-bootstrap";
import { Rating, PhotoAlbum, Hours } from "..";
import "bootstrap/dist/css/bootstrap.min.css";
import "./place.css";

export default function Place({ place }) {
  const [mainPhotoUrl, setMainPhotoUrl] = useState("");

  if (place === undefined) return "";

  return (
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
          <div className="rating">
            <div>Rating: {place.rating}</div>
            <Rating rating={place.rating} />
          </div>
          <div className="horario_">
            <Hours openingHours={place.opening_hours} />
          </div>
          <PhotoAlbum
            placePhotos={place.photos}
            setMainPhoto={setMainPhotoUrl}
          />
        </Card.Body>
      </Card>
    </div>
  );
}
