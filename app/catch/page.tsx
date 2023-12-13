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
import { tokenAtoms } from '../modules/tokenAtoms';
import Popover from '@mui/material/Popover';
import Particle from '@/component/Particle';
import { catchStartAtom } from '../modules/catchStartAtom';
import BackgroundMusic from '@/component/BackgroundMusic';


interface recievedAns {
  ans: string;
  nick: string;
  isAns: boolean;
}

interface Coordinate {
  x: number;
  y: number;
};


export default function Catch({ socket }: { socket: Socket }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState<Coordinate | undefined>(undefined);
  const [isPainting, setIsPainting] = useState(false);
  const [curColor, setCurColor] = useState("black");
  const [lineWidth, setLineWidth] = useState(5);
  const [eraserWidth, setEraserWidth] = useState(45);
  const [isEraser, setIsEraser] = useState(false);
  const [userInfo,] = useAtom(userInfoAtoms)
  const [acc_token,] = useAtom(tokenAtoms)
  const router = useRouter();
  const [answer, setAnswer] = useState('');
  const [correctNick, setCorrectNick] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [recievedAns, setRecievedAns] = useState<recievedAns>({
    ans: '',
    nick: '',
    isAns: false,
  });
  const [, setAnsAtom] = useAtom(answerAtom);
  const [catchStarted,setCatchStarted] = useAtom(catchStartAtom)
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [isBGMOn, setIsBGMOn] = useState<boolean>(true);

  useEffect(() => {
    socket.on('correct', (res) => {
      // console.log(res)
      if (res.result === true) {
        setAnswer(res.answer)
        setCorrectNick(res.nickname)
        setRecievedAns({
          ans: res.answer,
          nick: res.nickname,
          isAns: true,
        })
        setIsFinished(true)
      }
    });

    socket.on('incorrect', (res) => {
      // console.log(res)
      if (res.result === true) {
        setRecievedAns({
          ans: res.incorrectAnswer,
          nick: res.nickname,
          isAns: false,
        })
      }
    });

    const canvas = canvasRef.current;
    // 원본 해상도 설정
    const originalWidth = 900;
    const originalHeight = 900;

    // 낮추고 싶은 해상도 설정
    const targetWidth = 450;
    const targetHeight = 450;

    if (canvas) {
      // 캔버스 크기 및 스케일 조정
      canvas.width = targetWidth;
      canvas.height = targetHeight;
      canvas.style.width = `${originalWidth}px`;
      canvas.style.height = `${originalHeight}px`;
      canvas.style.display = 'block'; // 블록 수준 엘리먼트로 설정
      canvas.style.margin = 'auto'; // 가운데 정렬
    }

    return () => {
      handleBeforeUnload();
    };
  }, []);

  const handleBeforeUnload = () => {
    const user_t = JSON.parse(localStorage.getItem('userInfo') || 'null');
    socket.emit('end_game', {
      access_token: localStorage.getItem("access_token") ?? ("" as string),
      room_id: user_t.id
    });

  };

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
      context.strokeStyle = isEraser ? 'white' : curColor;  // 선 색깔
      context.lineJoin = 'round';	// 선 끄트머리(?)
      context.lineWidth = isEraser ? eraserWidth : lineWidth;		// 선 굵기

      context.beginPath();
      context.moveTo(originalMousePosition.x, originalMousePosition.y);
      context.lineTo(newMousePosition.x, newMousePosition.y);
      context.closePath();

      context.stroke();

      // console.log(context)
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
            access_token: localStorage.getItem('access_token')??'' as string,
            room_id: userInfo.id,
            x: newMousePosition.x,
            y: newMousePosition.y,
            color: isEraser ? 'white' : curColor,
            lineWidth: isEraser ? eraserWidth : lineWidth,
            first_x: mousePosition.x,
            first_y: mousePosition.y,
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
        access_token: localStorage.getItem('access_token')??'' as string,
        room_id: userInfo.id,
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
  const drawWidth = [[1, '얇게'], [5, '중간'], [10, '굵게']]
  const eraseWidth = [[20, '얇게'], [45, '중간'], [70, '굵게']]

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const leaveGame = () => {
    if (!isFinished) {

      if (confirm("게임을 나가시겠습니까?")) {
        socket.emit('end_game', {
          access_token: localStorage.getItem("access_token") ?? ("" as string),
          room_id: userInfo.id,
        });

        socket.emit('leave_game', {
        });

        setAnsAtom(null)
        router.push('/gameSelect');
      }

    } else {

      socket.emit('end_game', {
        access_token: localStorage.getItem("access_token") ?? ("" as string),
        room_id: userInfo.id,
      });

      socket.emit('leave_game', {
      });

      setAnsAtom(null)
      router.push('/gameSelect');
    }
  }

  const FinishedModal = () => {
    return (<>
      <div>
        <div className="winnerInfo">
          <div className="modalText">우승자 : {correctNick}</div>
          <div className="modalText">정답 : {answer}</div>
        </div>
        <Button variant='contained' size='large' onClick={leaveGame} style={{fontFamily: 'myfont'}}>게임 끝내기</Button>
      </div>
      <style jsx>{`
        .winnerInfo{
        }
        .modalText{
          font-size: 35px;
          margin-bottom: 30px;
        }
      `}</style>
      </>
    )
  }

  const handleBGM = () => {
    setIsBGMOn((prevBGMStatus) => !prevBGMStatus);
  } 

  return (
    <>
      <div className="BGM-container" onClick={handleBGM}>
        {isBGMOn? <BackgroundMusic /> : <></>}
        {isBGMOn? <Button className='button-mute'>🔇</Button> : <Button className='button-unmute'>🔈</Button> }
      </div>
      <Particle/>
      <div className="canvasContainer">
        <div className="ButtonContainer">
            <Button size='small' variant="contained" onClick={() => setIsEraser(!isEraser)} style={{fontFamily: 'myfont'}}>
              {isEraser ? "붓" : '지우개'}
            </Button>
            <Button size='small' variant="contained" onClick={clearCanvas} style={{fontFamily: 'myfont'}}>전체 지우기</Button>
            <Button aria-describedby={id} size='small' variant="contained" onClick={handleClick} style={{fontFamily: 'myfont'}}>
              붓 색상
            </Button>
            <Popover
              id={id}
              open={open}
              anchorEl={anchorEl}
              onClose={handleClose}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
            >
              {drawColor.map((color) => (
                <button
                  className={`colorButton ${curColor === color ? 'selectedColor' : ''}`}
                  style={{ backgroundColor: color }}
                  onClick={() => setCurColor(color)}
                ></button>
              ))}
            </Popover>
            {isEraser ? "지우개" : '붓'} 굵기:
            {isEraser ? (
              eraseWidth.map((info) => (
                <button
                  className={`lineWidthButton ${eraserWidth === info[0] ? 'selectedTool' : ''}`}
                  onClick={() => setEraserWidth(info[0] as number)}
                  style={{fontFamily: 'myfont'}}
                >
                  {info[1] as string}
                </button>
              ))
            ) : (
              drawWidth.map((info) => (
                <button
                  className={`lineWidthButton ${lineWidth === info[0] ? 'selectedTool' : ''}`}
                  onClick={() => setLineWidth(info[0] as number)}
                  style={{fontFamily: 'myfont'}}
                >
                  {info[1] as string}
                </button>
              ))
            )}
        </div>
        <div className='canvasDiv'>
          <canvas ref={canvasRef} style={{ maxWidth: '100%', maxHeight: '100%' }} className="canvas" />
        </div>
        <Button variant='contained' color='error' onClick={() => { leaveGame() }} style={{fontFamily: 'myfont'}}>나가기</Button>
      </div>
      <IntegrationNotistack isAns={recievedAns.isAns} ans={recievedAns.ans} nick={recievedAns.nick}/>
      <MyModal open={isFinished} modalHeader={`게임 종료`} modalContent={<FinishedModal />} closeFunc={() => { }} myref={null} />
      <style jsx>{`
        .canvasContainer {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          flex-direction: column;
          white-space: nowrap;
          text-overflow: ellipsis;
          // animation: animateBg 20s ease infinite;
          gap: 20px;
          position: relative;
        }
        @keyframes animateBg {
          0% {
            background-color: #9b59b6;
          }
          25% {
            background-color: #3498db;
          }
          50% {
            background-color: #16a085;
          }
          75% {
            background-color: #3498db;
          }
          100% {
            background-color: #9b59b6;
          }
        }
        .canvasDiv {
          width: 800px;
          aspect-ratio: 1 / 1;
          border: 1px solid gray;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          z-index : 1500;
        }

        @media (max-width: 1000px) {
          .canvasDiv {
            width: 800px;
            aspect-ratio: 1 / 1;
          }
        }

        .colorContainer {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          width: 30%;
          margin-bottom: 10px;
        }
        .colorButton {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          border: 0px solid gray;
          margin: 10px;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        }
        .selectedColor {
          border: 0px solid gray;
          box-shadow: 0 0 0 3.5px rgba(255, 255, 255, 0.7) inset;
        }
        .lineWidthContainer {
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: center;
          gap: 5px;
          width: 30%;
          margin-bottom: 10px;
        }
        canvas {
          background-color: white;
          z-index: 1;
        }
        .ButtonContainer {
          width: 500px;
          padding: 5px 0;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-around;
          border: 1px solid gray;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          background-color: #636363;
          color: white;
          z-index: 9999;
        }
        .lineWidthButton {
          border: 0px solid gray;
          border-radius: 5px;
          padding: 3px 7px;
          color: black;
          margin: 0 3px;
          background-color: white;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        }
        .selectedTool {
          background-color: #197bbd;
          color: white;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
        }
        .eraseBtn {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin-bottom: 10px;
          gap: 20px;
        }
        .snack-bar {
          width: 200%;
          height: 200%;
        }
        #tsparticles{
          z-index: -5;
        }
        .BGM-container{
          position: absolute;
          top: 1%;
          right: 26%;
          scale: 1.5;
          border: 1px solid gray;
          border-radius: 5px;
          cursor: pointer;
          background-color: #3498db
        }
        .button-mute {
          appearance: button;
          background-color: #1899D6;
          border: solid transparent;
          border-radius: 16px;
          border-width: 0 0 4px;
          box-sizing: border-box;
          color: #FFFFFF;
          cursor: pointer;
          display: inline-block;
          font-family: din-round,sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: .8px;
          line-height: 20px;
          margin: 0;
          outline: none;
          overflow: visible;
          padding: 13px 16px;
          text-align: center;
          text-transform: uppercase;
          touch-action: manipulation;
          transform: translateZ(0);
          transition: filter .2s;
          user-select: none;
          -webkit-user-select: none;
          vertical-align: middle;
          white-space: nowrap;
          width: 100%;
        }

        .button-mute:after {
          background-clip: padding-box;
          background-color: #1CB0F6;
          border: solid transparent;
          border-radius: 16px;
          border-width: 0 0 4px;
          bottom: -4px;
          content: "";
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
        }

        .button-mute:main,
        .button-mute:focus {
          user-select: auto;
        }

        .button-mute:hover:not(:disabled) {
          filter: brightness(1.1);
          -webkit-filter: brightness(1.1);
        }

        .button-mute:disabled {
          cursor: auto;
        }

        .button-mute:active {
          border-width: 4px 0 0;
          background: none;
        }
        .button-unmute {
          appearance: button;
          background-color: #1899D6;
          border: solid transparent;
          border-radius: 16px;
          border-width: 0 0 4px;
          box-sizing: border-box;
          color: #FFFFFF;
          cursor: pointer;
          display: inline-block;
          font-family: din-round,sans-serif;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: .8px;
          line-height: 20px;
          margin: 0;
          outline: none;
          overflow: visible;
          padding: 13px 16px;
          text-align: center;
          text-transform: uppercase;
          touch-action: manipulation;
          transform: translateZ(0);
          transition: filter .2s;
          user-select: none;
          -webkit-user-select: none;
          vertical-align: middle;
          white-space: nowrap;
          width: 100%;
        }

        .button-unmute:after {
          background-clip: padding-box;
          background-color: #1CB0F6;
          border: solid transparent;
          border-radius: 16px;
          border-width: 0 0 4px;
          bottom: -4px;
          content: "";
          left: 0;
          position: absolute;
          right: 0;
          top: 0;
        }

        .button-unmute:main,
        .button-unmute:focus {
          user-select: auto;
        }

        .button-unmute:hover:not(:disabled) {
          filter: brightness(1.1);
          -webkit-filter: brightness(1.1);
        }

        .button-unmute:disabled {
          cursor: auto;
        }

        .button-unmute:active {
          border-width: 4px 0 0;
          background: none;
        }
      `}</style>
    </>
  );
}