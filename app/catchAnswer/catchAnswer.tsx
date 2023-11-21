"use client"
import Button from '@mui/material/Button';
import io from 'socket.io-client';
import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { userInfoAtoms } from "@/app/modules/userInfoAtom";
import { tokenAtoms } from '../modules/tokenAtoms';
import { socket } from '../modules/socket';
import { answerAtom } from '../modules/answerAtom';
import OauthButtons from '@/component/OauthButtons';
import { loginAtom } from '../modules/loginAtoms';


export default function CatchAnswer() {
    const [userInfo,] = useAtom(userInfoAtoms);
    const [catchAnswer, setCatchAnswer] = useState<string>('');
    const [token,] = useAtom(tokenAtoms);
    const [,setAnswer] = useAtom(answerAtom);
    const [isLogin,] = useAtom(loginAtom);

    useEffect(()=>{
        if(localStorage.getItem('isHostPhone') !== 'true'){
            localStorage.setItem('isHostPhone','true')
        }
    },[])


    const handleAnswerSubmit = () => {
        setAnswer(catchAnswer)
        socket.emit("set_catch_answer", { room_id : userInfo.id , ans : catchAnswer , access_token : token });
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