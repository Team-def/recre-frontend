import Button from '@mui/material/Button';
import io from 'socket.io-client';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { userInfoAtoms } from "@/app/modules/userInfoAtom";

//server와 front가 같은 domain인 경우
//다른 경우 수정해야 함!
const socket = io();

export default function CatchAnswer() {
    const [userInfo,] = useAtom(userInfoAtoms);
    const [catchAnswer, setCatchAnswer] = useState<string>('');

    socket.on("connect", () => {
        console.log(socket.id);
        console.log(socket.connected);
    });

    const handleAnswerSubmit = () => {
        socket.emit("hostId-submit", { nickname: userInfo.nickname });
        socket.emit("answer-submit", { catchAnswer });
    }

    return (
        <>
        <label>정답입력</label>
        <input 
            type="text"
            className="catchAnswer-input"
            value={catchAnswer}
            onChange={(e)=>setCatchAnswer(e.target.value)}></input>
        <Button onClick={ handleAnswerSubmit }>제출</Button>
        </>
    )
}