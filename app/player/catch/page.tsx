import { socket } from '../../modules/socket';
import Button from '@mui/material/Button';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function player_catch() {

    const [playerAnswer, setPlayerAnswer] = useState<string>('');
    const params = useSearchParams();
    const room_id = params.get('hostId');

    useEffect(() => {
        socket.on("connect", () => {
            console.log(socket.id);
            console.log(socket.connected);
        });

        socket.on("disconnect", () => {
            console.log(socket.id);
            console.log(socket.connected);
        });

    });

    const throwCatchAnswer = () => {
        socket.emit("throw_catch_answer", {
            room_id: room_id,
            ans: playerAnswer,
        })
    }

    return (
        <>
            <div className="answer-container">
                <label className="answer-label">정답: </label>
                <input 
                    type="text" 
                    className="catch-answer-input"
                    value={playerAnswer} 
                    onChange={(e)=>setPlayerAnswer(e.target.value)}></input>
                <Button className="throw-answer" onClick={throwCatchAnswer} >제출</Button>
            </div>
        </>
    );
}