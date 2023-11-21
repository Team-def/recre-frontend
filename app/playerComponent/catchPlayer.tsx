import { Button } from "@mui/material";
import { useState } from "react";
import { Socket } from "socket.io-client";

export default function CatchPlayer({roomId, socket} : {roomId : string, socket : Socket}) {
    const [playerAnswer, setPlayerAnswer] = useState<string>('');

    const leave_game = () => {
        if(confirm('게임을 나가시겠습니까?')){
            socket.emit("leave_game", {
            });
            if (window.opener && window.opener !== window) {
                window.opener.location.reload(); // Reload the parent window
                window.close(); // Close the current window
            } else {
                window.location.href = 'about:blank'; // Navigate to a blank page
            }
        }
    }

    const throwCatchAnswer = () => {
        socket.emit("throw_catch_answer", {
            room_id: roomId,
            ans: playerAnswer,
        })
    }

    return (<>
         <label className="answer-label">정답: </label>
                <input 
                    type="text" 
                    className="catch-answer-input"
                    value={playerAnswer} 
                    onChange={(e)=>setPlayerAnswer(e.target.value)}></input>
                <Button className="throw-answer" onClick={throwCatchAnswer} >제출</Button>
        <Button onClick={leave_game}>leave game</Button></>)
}