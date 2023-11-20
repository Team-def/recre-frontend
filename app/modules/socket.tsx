import { io } from "socket.io-client";
import {v4 as uuidv4} from 'uuid';

const uuId = uuidv4()
//임시로 접속 주소 변경
export const socket = io(`http://chldsdsdtm.moojho.com:8080?uuId=${uuId}`,{
    withCredentials: true,
    transports: ["websocket"]
  });