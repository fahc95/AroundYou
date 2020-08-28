import React from "react";
import { Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Place({ place }) {
  return (
    <div>
      <Card>
        <Card.Body>
          <Card.Title>{place.name}</Card.Title>
          <Card.Subtitle>{place.address}</Card.Subtitle>
        </Card.Body>
      </Card>
    </div>
  );
}
