import { io } from "socket.io-client";
import {v4 as uuidv4} from 'uuid';

const uuId = uuidv4()

export const socket = io(`http://chltm.mooo.com:8080?uuId=${uuId}`,{
    withCredentials: true,
    transports: ["websocket"]
  });