"use client";

import React, { useRef, useState, useCallback, useEffect, use } from 'react';
import { io } from "socket.io-client";
import { useAtom } from 'jotai';
import { userInfoAtoms } from '../modules/userInfoAtom';
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

  const socket = io("http://treepark.shop:8000",{
    withCredentials: true,
    transports: ["websocket"]});

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined);
  const [isPainting, setIsPainting] = useState(false);
  const [curColor, setCurColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(50);
  const [isEraser, setIsEraser] = useState(false);
  const [windowSize, setWindowSize] = useState({width: 0, height: 0});

  const [userInfo,] = useAtom(userInfoAtoms)

  useEffect(() => {
    
    socket.timeout(5000).on("connect", () => {
      console.log("connect_check:", socket.connected);
      console.log("socket_id:", socket.id);
    });

    const listener = (data: any) => {
      console.log(data);
    }

    socket.on("test", listener);

    socket.on("session", ({sessionID, userID}) => {
      socket.auth = { sessionID };
      localStorage.setItem("sessionID", sessionID);
      socket.userID = userID;
    });

    socket.emit('make_room', ({
      "sessionID": localStorage.getItem("sessionID"),
      "userID": socket.userID,
      "accessToken": localStorage.getItem("accessToken"),
      "gamename": "그림 맞추기",
    }));

    socket.on("disconnect", () => {
      console.log("disconnect_check:", socket.connected);
    });

    socket.on("answer", (data: string) => {
      localStorage.setItem("answer", data);
    });

    socket.on("incorrect", (data) => {
      //data를 보낸 사람의 닉네임
      const nickname = data.nickname;
      //오답
      const wrong_answer = data.wrong_answer;

      //채팅창에 해당 닉네임과 오답을 출력하기

    });

    socket.on("correct", (data) => {
      //data를 보낸 사람의 닉네임
      const nickname = data.nickname;
      //정답
      const correct_answer = data.correct_answer;
      //게임 끝내는 함수 호출
      end_game();
    });

    const canvas: HTMLCanvasElement | null = canvasRef.current;

    if (canvas) {
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      setWindowSize({width: canvas.offsetWidth, height: canvas.offsetHeight});
    }
  }, []);

  //게임 끝내는 함수 - 게임 끝내는 버튼에 할당해야 함
  const end_game = () => {
    socket.emit('end_game', {
      "sessionID": localStorage.getItem("sessionID"),
      "accessToken": localStorage.getItem("accessToken"),
    });

    //정답 및 맞춘 사람 닉네임 출력
    
  }
  

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
      context.strokeStyle = isEraser?'white':curColor;  // 선 색깔
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
  const eraseWidth = [[20,'얇게'], [45,'중간'], [70,'굵게']]

  return(<>
        <div className="canvasContainer">
          <div className="ButtonContainer">
            <div className='eraseBtn'><button onClick={()=>setIsEraser(!isEraser)}>{isEraser?"붓":'지우개'}</button></div>
            <div className="colorContainer">
            붓 색 : 
              {drawColor.map((color) => <button className={`colorButton ${curColor === color?'selectedColor':''}`} style={{backgroundColor: color}} onClick={()=>setCurColor(color)}></button>)}
            </div>
            <div className="lineWidthContainer">
              {isEraser?"지우개":'붓'} 굵기 : 
              {isEraser?
              eraseWidth.map((info) => <button className={`lineWidthButton ${eraserWidth === info[0]?'selectedTool':''}` } onClick={()=>setEraserWidth(info[0] as number)}>{info[1] as string}</button>)
              :
              drawWidth.map((info) => <button className={`lineWidthButton  ${lineWidth === info[0]?'selectedTool':''}`} onClick={()=>setLineWidth(info[0] as number)}>{info[1] as string}</button>)}
            </div>
            <div className='eraseBtn'><button onClick={clearCanvas}>전체 지우기</button></div>
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
          white-space: nowrap; 
          text-overflow: ellipsis;
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
          width: 30%;
        }
        .colorButton{
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 0px solid gray;
          margin: 5px;
          box-shadow: 0 0 5px rgba(0,0,0,0.5);
        }
        .selectedColor{
          border:2.7px solid rgba(255,255,255,0.7);
        }
        .lineWidthContainer{
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 5px;
          width: 30%;
        }
        canvas{
          background-color: white;
        }
        .ButtonContainer{
          width: 60vw;
          padding: 5px 0;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-around;
          margin-bottom: 20px;
          border: 1px solid gray;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
          background-color: #636363;
          color: white;
        }
        .lineWidthButton{
          border: 0px solid gray;
          border-radius: 5px;
          padding: 3px 7px;
          color: black;
          margin: 0 3px;
          background-color: white;
          box-shadow: 0 0 5px rgba(0,0,0,0.5);
        }
        .selectedTool{
          background-color: #197bbd;
          color: white;
          box-shadow: 0 0 5px rgba(0,0,0,0.5);
        }
        .eraseBtn{
          width: 20%;
        }
        .eraseBtn{
          display: flex;
          justify-content: center;
          align-items: center;
        }
        `}</style>
        </>
      );
};

// QR 페이지의 하위 컴포넌트로 게임들을 가각 불러오게.