"use client";
import React, { useRef, useState, useCallback, useEffect } from 'react';
import Button from '@mui/material/Button';

interface CanvasProps {
  width: number;
  height: number;
}

interface Coordinate {
  x: number;
  y: number;
};

export default function Catch() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined);
  const [isPainting, setIsPainting] = useState(false);
  const [color, setColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(3);
  const [eraserWidth, setEraserWidth] = useState(15);
  const [isEraser, setIsEraser] = useState(false);

  // 좌표 얻는 함수
  const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
    if (!canvasRef.current) {
      return;
    }

    const canvas: HTMLCanvasElement = canvasRef.current;
    return {
      x: event.pageX - canvas.offsetLeft,
      y: event.pageY - canvas.offsetTop
    };
  };

     // canvas에 선을 긋는 함수
  const drawLine = (originalMousePosition: Coordinate, newMousePosition: Coordinate) => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      context.strokeStyle = isEraser?'white':color;  // 선 색깔
      context.lineJoin = 'round';	// 선 끄트머리(?)
      context.lineWidth = isEraser ? eraserWidth : lineWidth;		// 선 굵기

      context.beginPath();
      context.moveTo(originalMousePosition.x, originalMousePosition.y);
      context.lineTo(newMousePosition.x, newMousePosition.y);
      context.closePath();

      context.stroke();
    }
  };

  const startPaint = useCallback((event: MouseEvent) => {
    const coordinates = getCoordinates(event);
    if (coordinates) {
      setIsPainting(true);
      setMousePosition(coordinates);
    }
  }, []);

  const paint = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();   // drag 방지
      event.stopPropagation();  // drag 방지

      if (isPainting) {
        const newMousePosition = getCoordinates(event);
        if (mousePosition && newMousePosition) {
          drawLine(mousePosition, newMousePosition);
          setMousePosition(newMousePosition);
        }
      }
    },
    [isPainting, mousePosition]
  );

  const exitPaint = useCallback(() => {
    setIsPainting(false);
  }, []);

  const clearCanvas = () => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const context = canvas.getContext('2d');

    if (context) {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }
  
  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;

    canvas.addEventListener('mousedown', startPaint);
    canvas.addEventListener('mousemove', paint);
    canvas.addEventListener('mouseup', exitPaint);
    canvas.addEventListener('mouseleave', exitPaint);

    return () => {
      // Unmount 시 이벤트 리스터 제거
      canvas.removeEventListener('mousedown', startPaint);
      canvas.removeEventListener('mousemove', paint);
      canvas.removeEventListener('mouseup', exitPaint);
      canvas.removeEventListener('mouseleave', exitPaint);
    };
  }, [startPaint, paint, exitPaint]);

  const drawColor = ["black", "red", "blue", "green", "yellow"]
  const drawWidth = [1, 5, 10]
  const eraseWidth =[5, 15, 25]

  return(<>
        <div className="canvasContainer">
          <div className="ButtonContainer">
            <Button onClick={()=>setIsEraser(!isEraser)}>{isEraser?"붓":'지우개'}</Button>
            <div className="colorContainer">
            붓 색
              {drawColor.map((color) => <button className="colorButton" style={{backgroundColor: color}} onClick={()=>setColor(color)}></button>)}
            </div>
            <div className="lineWidthContainer">
              {isEraser?"지우개":'붓'} 굵기
              {isEraser?
              eraseWidth.map((width) => <button className="lineWidthButton" onClick={()=>setEraserWidth(width)}>{width}</button>)
              :
              drawWidth.map((width) => <button className="lineWidthButton" onClick={()=>setLineWidth(width)}>{width}</button>)}
            </div>
            <Button onClick={clearCanvas}>전체 지우기</Button>
          </div>
          <div className='canvasDiv'>
            <canvas ref={canvasRef} height={window.innerHeight} width={window.innerWidth} className="canvas"/>
          </div>
        </div>
        <style jsx>{`
        .canvasContainer {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
        }
        .canvasDiv{
          width: 60vw;
          height: 65vh;
          border: 1px solid gray;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
        .colorContainer{
          height: 50px;
        }
        .colorButton{
          width: 20px;
          height: 20px;
          border-radius: 50%;
          margin: 5px;
        }
        canvas{
          background-color: white;
        }
        .ButtonContainer{
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          margin-bottom: 20px;
        }
        `}</style>
        </>
      );
};

//지우개, 전체 지우기, 색
// QR 페이지의 하위 컴포넌트로 게임들을 가각 불러오게.