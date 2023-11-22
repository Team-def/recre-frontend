import { Button } from "@mui/material";
import { useState } from "react";
import { Socket } from "socket.io-client";
import { useEffect, useRef } from 'react';

export default function CatchPlayer({ roomId, socket }: { roomId: string, socket: Socket }) {
    const [playerAnswer, setPlayerAnswer] = useState<string>('');

    const leave_game = () => {
        if (confirm('게임을 나가시겠습니까?')) {
            socket.emit("leave_game", {
            });
            if (window.opener && window.opener !== window) {
                window.opener.location.reload(); // Reload the parent window
                window.close(); // Close the current window
            } else {
                window.location.href = 'about:blank'; // Navigate to a blank page
            }
        }
    }

    const throwCatchAnswer = () => {
        socket.emit("throw_catch_answer", {
            room_id: roomId,
            ans: playerAnswer,
        })
    }

    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
        const canvas: HTMLCanvasElement | null = canvasRef.current;
        if(canvas){
            const context = canvas.getContext('2d');
            if(context){
                  // 캔버스 크기 및 스케일 조정
            const originalWidth = 300;
            const originalHeight = 300;
        
            // 낮추고 싶은 해상도 설정
            const targetWidth = 300;
            const targetHeight = 300;
            
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            canvas.style.width = `${originalWidth}px`;
            canvas.style.height = `${originalHeight}px`;
            canvas.style.display = 'block'; // 블록 수준 엘리먼트로 설정
            canvas.style.margin = 'auto'; // 가운데 정렬
            // Socket.io로부터 그림 데이터 및 캔버스 정보 수신
            socket.on('draw', (canvasData) => {
                
                    if (context) {
                      context.strokeStyle = canvasData.color  // 선 색깔
                      context.lineJoin = 'round';	// 선 끄트머리(?)
                      context.lineWidth = canvasData.lineWidth		// 선 굵기
                
                      context.beginPath();
                      context.moveTo(canvasData.first_x, canvasData.first_y);
                      context.lineTo(canvasData.x, canvasData.y);
                      context.closePath();
                
                      context.stroke();
                  };
            });

        socket.on('clear_draw', (res) => {
            console.log(res)

            if (res.result && context) {
                context.clearRect(0, 0, canvas.width, canvas.height);
            }
        })
        }}

        return () => {
            // 컴포넌트가 언마운트될 때 Socket.io 연결 해제
            socket.disconnect();
        };
    }, []);
    

    return (<>
        <label className="answer-label">정답: </label>
        <input
            type="text"
            className="catch-answer-input"
            value={playerAnswer}
            onChange={(e) => setPlayerAnswer(e.target.value)}></input>
        <Button className="throw-answer" onClick={throwCatchAnswer} >제출</Button>
        <Button onClick={leave_game}>leave game</Button>

        <div>
            <canvas
                ref={canvasRef}
                style={{ maxWidth: '100%', maxHeight: '100%', border: '1px solid black' }}
            ></canvas>
        </div>
        ;</>)
}