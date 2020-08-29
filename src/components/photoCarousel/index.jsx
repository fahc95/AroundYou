import React from "react";
import { Carousel, CarouselItem } from "react-bootstrap";
import "./style.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function photoCarousel({ placePhotos }) {
  if (placePhotos === undefined) return "";
  return (
    <div className="photoCarousel">
      <Carousel>
        {placePhotos.map((photo, index) => (
          <CarouselItem key={index}>
            <img
              src={photo}
              className="slidePhoto d-block w-100"
              alt="slide Photo"
            />
          </CarouselItem>
        ))}
      </Carousel>
    </div>
  );
}
