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
  const [windowSize, setWindowSize] = useState({width: 0, height: 0});

  useEffect(() => {
    const canvas: HTMLCanvasElement | null = canvasRef.current;
    if (canvas) {
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      setWindowSize({width: canvas.offsetWidth, height: canvas.offsetHeight});
    }
  }, []);

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

  const drawColor = ["black", "red", "blue", "green", "#dec549"]
  const drawWidth = [[1,'얇게'], [5,'중간'], [10,'굵게']]
  const eraseWidth = [[5,'얇게'], [15,'중간'], [25,'굵게']]

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
              eraseWidth.map((info) => <button className="lineWidthButton" onClick={()=>setEraserWidth(info[0] as number)}>{info[1] as string}</button>)
              :
              drawWidth.map((info) => <button className="lineWidthButton" onClick={()=>setLineWidth(info[0] as number)}>{info[1] as string}</button>)}
            </div>
            <Button onClick={clearCanvas}>전체 지우기</Button>
          </div>
          <div className='canvasDiv'>
            <canvas ref={canvasRef} height={windowSize.height} width={windowSize.width} className="canvas"/>
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
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
        }
        .colorButton{
          width: 20px;
          height: 20px;
          border-radius: 50%;
          margin: 5px;
        }
        .lineWidthContainer{
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 5px;
        }
        canvas{
          background-color: white;
        }
        .ButtonContainer{
          width: 60vw;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-around;
          margin-bottom: 20px;
          border: 1px solid gray;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          background-color: #f5f5f5;
        }
        `}</style>
        </>
      );
};

//지우개, 전체 지우기, 색
// QR 페이지의 하위 컴포넌트로 게임들을 가각 불러오게.