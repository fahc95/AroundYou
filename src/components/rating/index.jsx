import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

export default function Rating({ rating }) {
  const drawStar = (ctx, cx, cy, spikes, outerRadius, innerRadius, color) => {
    var rot = (Math.PI / 2) * 3;
    var x = cx;
    var y = cy;
    var step = Math.PI / spikes;

    ctx.strokeSyle = "#000";
    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = "blue";
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.fill();
  };

  useEffect(() => {
    var canvas = document.getElementById("canvas");
    canvas.width = 150;
    canvas.height = 30;
    const ctx = canvas.getContext("2d");
    const initx = 15;
    const stepPos = 30;
    const completeStar = Math.floor(rating);
    const partialStar = (rating - completeStar).toFixed(1);
    for (let index = 0; index < completeStar; index++) {
      drawStar(ctx, initx + stepPos * index, 12, 5, 10, 4.5, "skyblue");
    }
    const partialFill = rating - completeStar;
    if (partialFill > 0) {
      var gradient = ctx.createLinearGradient(
        125.48943483704846,
        2,
        144.51056516295154,
        2
      );
      gradient.addColorStop(0, "skyblue");
      gradient.addColorStop(partialStar, "skyblue");
      gradient.addColorStop(partialStar, "white");
      gradient.addColorStop(1, "white");
      drawStar(ctx, initx + stepPos * completeStar, 12, 5, 10, 4.5, gradient);
    }
  });

  const startRating = [];
  const completeStar = Math.floor(rating);
  for (let index = 0; index < completeStar; index++) {
    startRating[index] = <span className="fa fa-star"></span>;
  }

  return <canvas className="py-1" id="canvas"></canvas>;
}
