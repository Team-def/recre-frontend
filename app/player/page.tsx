"use client";
import { io } from "socket.io-client";
import Button from '@mui/material/Button';
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";

declare module "socket.io-client" {
    
    interface Socket {
        sessionID?: string;
        userID?: string;
    }
}

const socket = io("http://treepark.shop:8000",{
                withCredentials: true,
                transports: ["websocket"]});


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

        socket.on("session", ({sessionID, userID}) => {
            console.log(sessionID);
            console.log(userID);
            socket.auth = { sessionID };
            localStorage.setItem("sessionID", sessionID);
            socket.userID = userID;
        });
    });

    const readyToPlay = () => {
        socket.emit("host-data", { 
            "hostId": hostId,
            "nickname": playerNickname});
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