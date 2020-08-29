import React from "react";
import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Place({ place }) {
  console.log(place);
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
            src={place.mainPhoto}
            className="img-fluid shadow bg-white rounded placePhoto"
          />
        </Card.Body>
      </Card>
    </div>
  );
}
