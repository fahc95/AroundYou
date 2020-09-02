import React from "react";
import { Accordion, Card } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./comments.css";

export default function Comments({ reviews }) {
  if (reviews === undefined)
    return (
      <div>
        <i>No hay comentarios para este lugar</i>
      </div>
    );

  return (
    <Accordion defaultActiveKey="0">
      <Card>
        <Accordion.Toggle className="horario" as={Card.Header} eventKey="0">
          <span> Comentarios </span>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey="0">
          <Card.Body>
            {reviews.map((review, index) => (
              <div className="commentCardBody">
                <div className="userPhoto">
                  <img src={review.profile_photo_url} alt="User Photo" />
                </div>
                <div className="comment">
                  <div>
                    <strong>{review.author_name}</strong>
                  </div>
                  <div>{review.text}</div>
                </div>
              </div>
            ))}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    </Accordion>
  );
}
