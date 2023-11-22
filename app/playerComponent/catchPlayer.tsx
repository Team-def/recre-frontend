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

            // Socket.io 연결

            // 마우스 이벤트 처리
            let isDrawing = false;

            if(context){
            // Socket.io로부터 그림 데이터 및 캔버스 정보 수신
            socket.on('draw', (canvasData) => {
                const img = new ImageData(new Uint8ClampedArray(canvasData.data), canvasData.width, canvasData.height);
                context.canvas.width = canvasData.width;
                context.canvas.height = canvasData.height;
                context.putImageData(img, 0, 0);
            });
        }
        }

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
                style={{ maxWidth: '100%', height: 'auto', border: '1px solid black' }}
            ></canvas>
        </div>
        ;</>)
}