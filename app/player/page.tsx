"use client";

// import { socket } from "../modules/socket";
import Button from '@mui/material/Button';
import { io } from "socket.io-client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import { userInfoAtoms } from "../modules/userInfoAtom";
import { useAtom } from "jotai";
import CatchPlayer from "../playerComponent/catchPlayer";

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
    const params = useSearchParams();
    const room_id = params.get('id');
    const router = useRouter();
    //query string에서 hostId를 가져옴
    const [playerNickname, setPlayerNickname] = useState<string>('');
    const [userInfo, ] = useAtom(userInfoAtoms);
    const [ready, setReady] = useState<boolean>(false);
    const [playerComponent, setPlayerComponent] = useState<JSX.Element | null>(null);

    useEffect(() => {
        if (room_id === null) {
            alert('잘못된 접근입니다.');
            router.push("/");
        }

        socket.on("ready", (res)=>{
            if(res.result === true){
                setReady(true)
            } else{
                alert(res.message)
            }
        });

        socket.on("start_catch_game", (res)=>{
            if(res.result === true){
                setPlayerComponent(<CatchPlayer/>)
            } else{
                alert(res.message)
            }
        })

        setPlayerComponent(<ReadyComponent/>)
    });


    const ReadyComponent = () => {
        const readyToPlay = () => {
            socket.emit("ready", { 
                room_id: room_id,
                nickname: userInfo.nickname
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
                    onChange={(e)=>setPlayerNickname(e.target.value)}
                    autoFocus></input>
                <Button className="nickname-change" onClick={readyToPlay} disabled={ready}>{ready?"Waiting":"Ready!"}</Button>
            </div>
            </>
        )
    }

    return (
        <>{playerComponent}</>
    )
}