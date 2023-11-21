"use client";
import Button from '@mui/material/Button';
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";
import { userInfoAtoms } from "../modules/userInfoAtom";
import { useAtom } from "jotai";
import CatchPlayer from '../playerComponent/catchPlayer';
import { socket } from "../modules/socket";


export default function Player() {
    const params = useSearchParams();
    const room_id = params.get('id');
    const router = useRouter();
    //query string에서 hostId를 가져옴
    const [playerNickname, setPlayerNickname] = useState<string|null>(null);
    const [userInfo, ] = useAtom(userInfoAtoms);
    const [ready, setReady] = useState<boolean>(false);
    const [isGame, setIsGame] = useState<boolean>(false);

    useEffect(() => {
        if (room_id === null) {
            alert('잘못된 접근입니다.');
            router.push("/");
        }

        // socket.on("ready", (res)=>{
        //     if(res.result === true){
        //         setReady(true)
        //     } else{
        //         alert(res.message)
        //     }
        // });

        socket.on("start_catch_game", (res)=>{
            if(res.result === true){
                setIsGame(true)
            } else{
                alert(res.message)
            }
        })
    });
    
    const readyToPlay = () => {
        if(playerNickname === null || playerNickname === ''){
            alert('닉네임을 입력해주세요.')
            return
        }
        setReady(true)
        socket.emit("ready", { 
            room_id: room_id,
            nickname: playerNickname
        });
    };


    return (
        <>{isGame?
            <CatchPlayer roomId={room_id as string}/>:
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