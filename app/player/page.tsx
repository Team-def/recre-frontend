"use client";
import Button from '@mui/material/Button';
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useState } from "react";
import CatchPlayer from '../playerComponent/catchPlayer';
import { io } from "socket.io-client";
import {v4 as uuidv4} from 'uuid';
import { socketApi } from '../modules/socketApi';



export default function Player() {
    const params = useSearchParams();
    const room_id = params.get('id');
    const router = useRouter();
    //query string에서 hostId를 가져옴
    const [playerNickname, setPlayerNickname] = useState<string|null>(null);
    const [ready, setReady] = useState<boolean>(false);
    const [isGame, setIsGame] = useState<boolean>(false);
    const [uuId,] = useState<string>(uuidv4());
    const socket = useRef(io(`${socketApi}?uuId=${uuId}`,{
        withCredentials: true,
        transports: ["websocket"],
        autoConnect: false,
    }));

    useEffect(() => {
        if (room_id === null) {
            alert('잘못된 접근입니다.');
            router.push("/");
        }

        socket.current.connect();

        socket.current.on("start_catch_game", (res)=>{
            if(res.result === true){
                setIsGame(true)
            } else{
                alert(res.message)
            }
        })

        socket.current.on("end", (res)=>{
            if(res.result === true){
                alert('게임이 종료되었습니다.')
                //꺼지게
            }
        })

        return () => {
            handleBeforeUnload()
        };
    },[]);

    useEffect(() => {
        alert(12)
    }, [socket]);

    const handleBeforeUnload = () => {
         socket.current.emit('leave_game',{
        });
      };
    
    const readyToPlay = () => {
        if(playerNickname === null || playerNickname === ''){
            alert('닉네임을 입력해주세요.')
            return
        }
        setReady(true)
        socket.current.emit("ready", { 
            room_id: room_id,
            nickname: playerNickname
        });
    };


    return (
        <>{isGame?
            <CatchPlayer roomId={room_id as string} socket={socket.current}/>:
            <>
            <div className="nickname-container">
                <label className="nickname-label">닉네임: </label>
                <input 
                    type="text" 
                    className="nickname-input"
                    value={playerNickname??''} 
                    onChange={(e)=>setPlayerNickname(e.target.value)}
                    disabled={ready}></input><br></br>
                <Button className="nickname-change" onClick={readyToPlay} disabled={ready}>{ready?"Waiting":"Ready!"}</Button>
            </div>
            </>}            </>
    )
}