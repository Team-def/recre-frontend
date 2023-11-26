"use client"
import Button from '@mui/material/Button';
import io from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { userInfoAtoms } from "@/app/modules/userInfoAtom";
import { tokenAtoms } from '../modules/tokenAtoms';
import { answerAtom } from '../modules/answerAtom';
import OauthButtons from '@/component/OauthButtons';
import { loginAtom } from '../modules/loginAtoms';
import {v4 as uuidv4} from 'uuid';
import { socketApi } from '../modules/socketApi';
import { Alert } from '@mui/material';
import useVH from 'react-viewport-height';

//Answer setting page (for host)
export default function CatchAnswer() {
    const [userInfo,] = useAtom(userInfoAtoms);
    const [catchAnswer, setCatchAnswer] = useState<string>('');
    const [token,] = useAtom(tokenAtoms);
    const [,setAnswer] = useAtom(answerAtom);
    const [isLogin,] = useAtom(loginAtom);
    const [uuId,] = useState<string>(uuidv4());
    const vh = useVH();

    const socket = useRef(io(`${socketApi}?uuId=${uuId}`,{
        withCredentials: true,
        transports: ["websocket"],
        autoConnect: false,
    }));

    useEffect(()=>{
        localStorage.setItem('isHostPhone','true')

        socket.current.on("set_catch_answer", (res)=>{

            if (res.result === true) {

                socket.current.disconnect()
                alert('정답이 설정되었습니다.')

                window.close();

            } else {
                alert('아직 방이 안 만들어졌습니다.')
            }
        });
    },[])


    const handleAnswerSubmit = () => {
        if (catchAnswer === '') {
            alert('정답을 입력해주세요!')
            return;
        }
        socket.current.connect();
        setAnswer(catchAnswer)
        socket.current.emit("set_catch_answer", { room_id : userInfo.id , ans : catchAnswer , access_token : token });
        console.log("catchAnswer",catchAnswer)
    }

    return (
        <>
        {isLogin? <>
            <div className="nickname-container">
                    <div className="headerContainer">
                        <div className="logo">
                            <h1>RecRe</h1>
                            <span className='teamdef'>정답 입력 화면</span>
                        </div>
                    </div>
                    <div className='alertDiv'><Alert severity="info">문제의 정답을 입력해주시고 아래 '정답 제출' 버튼을 눌러주세요!</Alert></div>
                    <div className='nickDiv'>
                        <label className="nickname-label">정답: </label>
                        <input
                type="text"
                className="catchAnswer-input nickname-input"
                value={catchAnswer}
                onChange={(e) => setCatchAnswer(e.target.value)}
                placeholder='문제의 정답을 입력해주세요!'
                ></input>
                        <Button variant="contained" className="nickname-change" onClick={handleAnswerSubmit}>제출</Button></div>
                </div>
            </>:<OauthButtons/>}
            <style jsx>{`
                .nickname-container {
                    height: ${100 * vh - 60}px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-around;
                    background-color: #F5F5F5;
                    border-radius: 10px;
                }

                .nickname-label {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }

                .nickname-input {
                    width: 200px;
                    height: 30px;
                    padding: 5px;
                    border: 1px solid #CCCCCC;
                    border-radius: 5px;
                    margin-bottom: 10px;
                    text-align: center;
                    font-size: 16px;
                }

                .nickname-change {
                    width: 120px;
                    height: 40px;
                    background-color: #FF6B6B;
                    color: #FFFFFF;
                    font-size: 16px;
                    font-weight: bold;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                .logo{
                    font-size: 32px;
                    bakcground-color: #F5F5F5;
                }
                .nickDiv{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .alertDiv{
                    width: 70%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                }
                .logo{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background-color: transparent;
                }
                .teamdef{
                    font-size: 22px;
                    font-weight: 500;
                    color: gray;
                }
            `}</style>
            <style jsx global>{`
                body {
                    overflow: hidden !important;
                }
            `}</style>
        </>
    )
}