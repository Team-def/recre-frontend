import { io } from "socket.io-client";
import Button from '@mui/material/Button';
import { useRouter } from "next/router";
import { useEffect } from "react";

const router = useRouter();
const hostId = router.query.hostId || null;

//server와 front 가 같은 domain인 경우
const socket = io();

// //서버와 front 가 서로 다른 domain인 경우
// const socket = io("http://server.domain.com");
useEffect(() => {
    if (hostId === null) {
        alert('잘못된 접근입니다.');
        router.push("/");
    }

    socket.on("connect", () => {
        console.log(socket.id);
        console.log(socket.connected);
    });

    socket.emit("host-data", { hostId });
    
    socket.on("join-room", (roomId) => {
        console.log(roomId);
    });
    
});

export default function Player() {
    return (
        <>
        <div className="nickname-container">
            <label className="nickname-label">닉네임: </label>
            <input type="text" className="nickname-input"></input>
            <Button className="nickname-change">변경하기</Button>
        </div>
        <div className="ready-button-container">
            <Button className="ready-button">준비하기</Button>
        </div>
        </>
    )
}