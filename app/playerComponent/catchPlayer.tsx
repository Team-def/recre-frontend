import { Button, InputAdornment, TextField } from "@mui/material";
import { useState } from "react";
import { Socket } from "socket.io-client";
import { useEffect, useRef } from 'react';
import MyModal from '@/component/MyModal';

export default function CatchPlayer({ roomId, socket }: { roomId: string, socket: Socket }) {
    const [playerAnswer, setPlayerAnswer] = useState<string>('');
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [modalHeader, setModalHeader] = useState<string>('');
    const [modalContent, setModalContent] = useState<JSX.Element>(<></>);
    const leave_game = () => {
        if (confirm('게임을 나가시겠습니까?')) {
            socket.emit("leave_game", {
            });
            // if (window.opener && window.opener !== window) {
            //     window.opener.location.reload(); // Reload the parent window
            //     window.close(); // Close the current window
            // } else {
            //     window.location.href = 'about:blank'; // Navigate to a blank page
            // }
            window.close();
        }
    }
    //throw catch mind answer (blocks the button for 3 seconds)
    const throwCatchAnswer = () => {
        socket.emit("throw_catch_answer", {
            room_id: roomId,
            ans: playerAnswer,
        })
        setPlayerAnswer("");
        setButtonDisabled(true);
        setTimeout(()=>setButtonDisabled(false), 3000);
    }
    const handleClose = () => { setOpen(false); };
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
            }
        }

        socket.on('correct', (res) => {
            setModalHeader('정답입니다!');
            setModalContent(<div>{res.nickname}님께서 정답을 맞추셨습니다!<br></br> 정답 : {res.answer}</div>);
            setOpen(true);
        })

        socket.on('incorrect', (res) => {
            setModalHeader('오답입니다!');
            setModalContent(<div>정답이 아닙니다.</div>);
            setOpen(true);
            setTimeout(()=>setOpen(false), 2000);
        })


        return () => {
            // 컴포넌트가 언마운트될 때 Socket.io 연결 해제
            socket.emit("leave_game", {
            });
            window.close();
        };
    }, []);
    

    return (<>
    <div className="p_catch_div">
        <div className="submitDiv">
            <TextField
            id="filled-start-adornment"
            sx={{ m: 1, width: '25ch' }}
            InputProps={{
                startAdornment: <InputAdornment position="start">정답 : </InputAdornment>,
            }}
            variant="standard"
            value={playerAnswer}
            onChange={(e) => setPlayerAnswer(e.target.value)}/>
            
            <Button className="throw-answer" variant="contained" onClick={throwCatchAnswer} disabled={buttonDisabled}> {buttonDisabled? '대기':'제출'}</Button>
        </div>
        <MyModal open={open} modalHeader={modalHeader} modalContent={modalContent} closeFunc={handleClose} myref={null}/>
        <div>
            <canvas
                ref={canvasRef}
                style={{ maxWidth: '100%', maxHeight: '100%', border: '1px solid black' }}>
            </canvas>
        </div>
        <Button variant="outlined" onClick={leave_game}>게임 나가기</Button>
    </div>
        <style jsx>{`
                canvas{
                    background-color: white !important;
                    border: 0.1px solid gray;
                    border-radius: 10px;
                    box-shadow: 0.1px 0.1px 5px gray;
                }
                .submitDiv{
                    margin-top: 20px;
                    width: 85%;
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: center;
                }
                .p_catch_div{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                }
        `}</style>
        </>)
}
