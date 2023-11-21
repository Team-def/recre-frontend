"use client"
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { userInfoAtoms } from "@/app/modules/userInfoAtom";
import { socket } from '../modules/socket';
import OauthButtons from '@/component/OauthButtons';
import { loginAtom } from '../modules/loginAtoms';


export default function CatchAnswer() {
    const [userInfo,] = useAtom(userInfoAtoms);
    const [catchAnswer, setCatchAnswer] = useState<string>('');
    const [isLogin,] = useAtom(loginAtom);

    useEffect(()=>{
        localStorage.setItem('isHostPhone','true')
    },[])


    const handleAnswerSubmit = () => {
        socket.emit("hostId-submit", { nickname: userInfo.nickname });
        socket.emit("answer-submit", { catchAnswer });
    }

    return (
        <>

        {isLogin? <><label>정답입력</label>
                <input
                    type="text"
                    className="catchAnswer-input"
                    value={catchAnswer}
                    onChange={(e) => setCatchAnswer(e.target.value)}></input>
                <Button onClick={handleAnswerSubmit}>제출</Button></>:<OauthButtons/>}
        </>
    )
}