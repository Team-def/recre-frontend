"use client";
import React, { useRef, useState, useCallback, useEffect } from 'react';
import { useAtom } from 'jotai';
import { userInfoAtoms } from '../modules/userInfoAtom';
import Button from '@mui/material/Button';
import { useRouter } from 'next/navigation';
import MyModal from '@/component/MyModal';
import IntegrationNotistack from '@/component/snackBar';
import { answerAtom } from '../modules/answerAtom';
import { Socket } from 'socket.io-client';

interface recievedAns {
  ans: string;
  nick: string;
  isAns : boolean;
}

interface Coordinate {
  x: number;
  y: number;
};

export default function Catch({socket}: {socket : Socket}) {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined);
  const [isPainting, setIsPainting] = useState(false);
  const [curColor, setCurColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(45);
  const [isEraser, setIsEraser] = useState(false);
  const [userInfo,] = useAtom(userInfoAtoms)
  const router = useRouter();
  const [answer, setAnswer] = useState('');
  const [correctNick, setCorrectNick] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [recievedAns, setRecievedAns] = useState<recievedAns>({
    ans : '', 
    nick : '', 
    isAns : false,
  });
  const [, setAnsAtom] = useAtom(answerAtom);

  useEffect(() => {

    socket.on('correct',(res)=>{
      // console.log(res)
      if(res.result === true){
        setAnswer(res.answer)
        setCorrectNick(res.nickname)
        setRecievedAns({
          ans : res.answer,
          nick : res.nickname,
          isAns : true,
        })
        setIsFinished(true)
      }
    }); 

    socket.on('incorrect',(res)=>{
      // console.log(res)
      if(res.result === true){
        setRecievedAns({
          ans : res.incorrectAnswer,
          nick : res.nickname,
          isAns : false,
        })
      }
    }); 

    const canvas = canvasRef.current;
    // 원본 해상도 설정
    const originalWidth = 600;
    const originalHeight = 600;

    // 낮추고 싶은 해상도 설정
    const targetWidth = 300;
    const targetHeight = 300;

    if(canvas){
      // 캔버스 크기 및 스케일 조정
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      canvas.style.width = `${originalWidth}px`;
      canvas.style.height = `${originalHeight}px`;
      canvas.style.display = 'block'; // 블록 수준 엘리먼트로 설정
      canvas.style.margin = 'auto'; // 가운데 정렬
    }

    // return () => {
    // }


  }, []);



  // 좌표 얻는 함수
  const getCoordinates = (event: MouseEvent): Coordinate | undefined => {
    if (!canvasRef.current) {
      return;
    }
    const canvas: HTMLCanvasElement = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;

    return {
      x: (event.pageX - canvas.offsetLeft) * scaleX,
      y: (event.pageY - canvas.offsetTop) * scaleY,
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

      console.log(context)
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

      const newMousePosition = getCoordinates(event);
      if (isPainting) {
        if (mousePosition && newMousePosition) {
          drawLine(mousePosition, newMousePosition);
          setMousePosition(newMousePosition);
          socket.emit('draw', {
            room_id : userInfo.id,
            x : newMousePosition.x,
            y : newMousePosition.y,
            color : isEraser?'white':curColor,
            lineWidth : isEraser ? eraserWidth : lineWidth,
            first_x : mousePosition.x,
            first_y : mousePosition.y,
          });
        }
      } else {

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
      socket.emit('clear_draw', {
        room_id : userInfo.id,
      });
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

  const leaveGame = () => {
    if(!isFinished){

      if(confirm("게임을 나가시겠습니까?")){
        socket.emit('end_game',{
          room_id : userInfo.id,
        });

        socket.emit('leave_game',{
        });

        setAnsAtom(null)
        router.push('/gameSelect');
      }

    } else{

      socket.emit('end_game',{
        room_id : userInfo.id,
      });

      socket.emit('leave_game',{
      });
      
      setAnsAtom(null)
      router.push('/gameSelect');
    }
  }

  const FinishedModal = () => {
    return (
      <div>
        <div className="winnerInfo">
          <div className="modalText">우승자 : {correctNick}</div>
          <div className="modalText">정답 : {answer}</div>
        </div>
        <Button onClick={leaveGame}>게임 끝내기</Button>
      </div>
    )
  }

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
            <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '100%' }} className="canvas"/>
          </div>
          <Button onClick={()=>{leaveGame()}}>나가기</Button>
        </div>
        <IntegrationNotistack isAns={recievedAns.isAns} ans={recievedAns.ans} nick={recievedAns.nick}/>
        <MyModal open={isFinished} modalHeader={`우승자 : ${correctNick}`} modalContent={<FinishedModal/>} closeFunc={()=>{}}/>
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
          width: 500px;
          height: 500px;
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
        .snack-bar{
          width: 200%;
          height: 200%;
        }
        `}</style>
        </>
      );
};

