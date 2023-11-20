"use client";

import { socket } from "../modules/socket";
import Button from '@mui/material/Button';
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Player() {
    const router = useRouter();
    //query string에서 hostId를 가져옴
    const params = useSearchParams();
    const hostId = params.get('hostId');
    const [playerNickname, setPlayerNickname] = useState<string>('');

    useEffect(() => {
        if (hostId === null) {
            alert('잘못된 접근입니다.');
            router.push("/");
        }
    
        socket.on("connect", () => {
            console.log(socket.id);
            console.log(socket.connected);
        });

        socket.on("disconnect", () => {
            console.log(socket.id);
            console.log(socket.connected);
        });

    });

    const readyToPlay = () => {
        socket.emit("host-data", { 
            "hostId": hostId,
            "nickname": playerNickname
        });
    };

    return (
        <>
        <div className="nickname-container">
            <label className="nickname-label">닉네임: </label>
            <input 
                type="text" 
                className="nickname-input"
                value={playerNickname} 
                onChange={(e)=>setPlayerNickname(e.target.value)}></input>
            <Button className="nickname-change" onClick={readyToPlay} >Ready!</Button>
        </div>
        </>
    )
}