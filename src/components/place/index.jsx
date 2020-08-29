import React from "react";
import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Place({ place }) {
  return (
    <div className="placeCard shadow bg-white rounded">
      <Card>
        <Card.Body>
          <Card.Title>{place.name}</Card.Title>
          <Card.Subtitle>{place.address}</Card.Subtitle>
        </Card.Body>
        <Card.Img
          variant="top"
          alt={place.name}
          src={place.photos}
          className="img-fluid shadow bg-white rounded placePhoto"
        />
      </Card>
    </div>
  );
}
