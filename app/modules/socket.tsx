import { io } from "socket.io-client";
import {v4 as uuidv4} from 'uuid';

const uuId = uuidv4()

export const socket = io(`http://treeparkasd.link:8000?uuId=${uuId}`,{
    withCredentials: true,
    transports: ["websocket"]
  });