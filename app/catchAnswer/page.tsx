"use client"
import Button from '@mui/material/Button';
import io from 'socket.io-client';
import { useState } from 'react';
import { useAtom } from 'jotai';
import { userInfoAtoms } from "@/app/modules/userInfoAtom";
import { tokenAtoms } from '../modules/tokenAtoms';
import { socket } from '../modules/socket';
import { answerAtom } from '../modules/answerAtom';


export default function CatchAnswer() {
    const [userInfo,] = useAtom(userInfoAtoms);
    const [catchAnswer, setCatchAnswer] = useState<string>('');
    const [token,] = useAtom(tokenAtoms);
    const [,setAnswer] = useAtom(answerAtom);


    const handleAnswerSubmit = () => {
        setAnswer(catchAnswer)
        socket.emit("set_catch_answer", { room_id : userInfo.id , ans : catchAnswer , access_token : token });
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