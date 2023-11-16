"use client";
import { useEffect, useRef } from 'react';

export default function Catch() {
const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let drawing = false;
    let color = '#000000';
    let lineWidth = 5;

    const startDrawing = (event: MouseEvent) => {
      drawing = true;
      if (!ctx) return;
      ctx.beginPath();
      ctx.moveTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
    };

    const draw = (event: MouseEvent) => {
      if (!drawing || !ctx) return;

      ctx.lineTo(event.clientX - canvas.offsetLeft, event.clientY - canvas.offsetTop);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.stroke();
    };

    const stopDrawing = () => {
      drawing = false;
      if (ctx) ctx.closePath();
    };

    const setColor = (event: React.ChangeEvent<HTMLInputElement>) => {
      color = event.target.value;
    };

    const setLineWidth = (event: React.ChangeEvent<HTMLInputElement>) => {
      lineWidth = parseInt(event.target.value, 10);
    };

    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    return () => {
      canvas.removeEventListener('mousedown', startDrawing);
      canvas.removeEventListener('mousemove', draw);
      canvas.removeEventListener('mouseup', stopDrawing);
      canvas.removeEventListener('mouseout', stopDrawing);
    };
  }, []);

   return (
    <div>
      <canvas ref={canvasRef} id="canvas"></canvas>
      <div>
        <label htmlFor="color-picker">Color:</label>
        <input type="color" id="color-picker" onChange={setColor} />
      </div>
      <div>
        <label htmlFor="line-width">Line Width:</label>
        <input type="range" id="line-width" min="1" max="20" step="1" onChange={setLineWidth} />
      </div>
    </div>
  );
};