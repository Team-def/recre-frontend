import { Button, InputAdornment, List, ListItem, ListItemText, ListSubheader, TextField } from "@mui/material";
import { useState } from "react";
import { Socket } from "socket.io-client";
import { useEffect, useRef } from 'react';
import MyModal from '@/component/MyModal';
import useVH from 'react-viewport-height';

export default function CatchPlayer({ roomId, socket }: { roomId: string, socket: Socket }) {
    const [playerAnswer, setPlayerAnswer] = useState<string>('');
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [modalHeader, setModalHeader] = useState<string>('');
    const [modalContent, setModalContent] = useState<JSX.Element>(<></>);
    const [myans, setMyans] = useState<string[]>([]);
    const vh = useVH();
    
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
        if (playerAnswer === '') {
            alert('정답을 입력해주세요!')
            return;
        }
        if(playerAnswer.length > 10){
            alert('10글자 이하로 작성해주세요!')
            return;
        }
        setMyans([playerAnswer,...myans])
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
                const originalWidth = 450;
                const originalHeight = 450;
        
                // 낮추고 싶은 해상도 설정
                const targetWidth = 450;
                const targetHeight = 450;
            
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
            sx={{ m: 1, width: '25ch', fontFamily:'myfont', backgroundColor:'white', borderRadius:'5px', boxShadow:'0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);'}}
            InputProps={{
                startAdornment: <InputAdornment position="start" sx={{fontFamily:'myfont'}}>정답 : </InputAdornment>,
            }}
            variant="outlined"
            value={playerAnswer}
            onChange={(e) => setPlayerAnswer(e.target.value)}
            size="small"/>
            
            <Button className="throw-answer" variant="contained" onClick={throwCatchAnswer} disabled={buttonDisabled} sx={{fontFamily:'myfont'}}> {buttonDisabled? '대기':'제출'}</Button>
        </div>
        <MyModal open={open} modalHeader={modalHeader} modalContent={modalContent} closeFunc={handleClose} myref={null}/>
        <div>
            <canvas
                ref={canvasRef}
                style={{ maxWidth: '90vw', maxHeight: '90vw', border: '0px solid black', boxShadow:'0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);' }}>
            </canvas>
        </div>
        <List
      sx={{
        width: '90%',
        maxWidth: '90%',
        bgcolor: 'rgba(0,0,0,0.5)',
        color: 'white',
        position: 'relative',
        overflow: 'auto',
        maxHeight: 300,
        borderColor:'gray',
        borderRadius:'10px',
        boxShadow:'0px 2px 4px -1px rgba(0,0,0,0.2), 0px 4px 5px 0px rgba(0,0,0,0.14), 0px 1px 10px 0px rgba(0,0,0,0.12);',
        '& ul': { padding: 0 },
      }}
      subheader={<li />}
    >
         <ListSubheader sx={{backgroundColor:'rgba(0,0,0,1)', color:'white', fontWeight:'bold', fontFamily:'myfont', textAlign:'center'}}>{`내가 제출한 정답`}</ListSubheader>
        {myans.map((item, index) => (
            <ListItem key={`item-${index}-${item}`} sx={{fontFamily:'myfont', textAlign:'center'}}>
            <ListItemText style={{fontFamily:'myfont'}} primary={`${item}`}/>
            </ListItem>
        ))}
    </List>
        <Button color="error" variant="contained" onClick={leave_game} sx={{fontFamily:'myfont', position:'static', marginBottom:'5%'}}>게임 나가기</Button>
    </div>
        <style jsx>{`
                .p_catch_div{
                    height: ${100 * vh}px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    gap: 20px;
                    animation: animateBg 20s ease infinite;
                }
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
        `}</style>
        </>)
}
