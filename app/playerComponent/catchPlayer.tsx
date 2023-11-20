import { Button } from "@mui/material";
import { socket } from "../modules/socket"

export default function CatchPlayer(){
    const leave_game = () => {
        socket.emit("leave_game", { 
        });
    }

    return(<><Button onClick={leave_game}>leave game</Button></>)
}