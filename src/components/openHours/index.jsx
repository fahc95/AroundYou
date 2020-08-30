import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Accordion, Card } from "react-bootstrap";

export default function Hours({ openingHours }) {
  if (openingHours === undefined) return "";
  return (
    <Accordion defaultActiveKey="0">
      <Card>
        <Accordion.Toggle className="horario" as={Card.Header} eventKey="0">
          <span> Horarios </span>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            {openingHours.weekday_text.map((day, index) => (
              <div key={index}>{day}</div>
            ))}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
