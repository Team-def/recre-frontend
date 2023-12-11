'use client';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { gameAtoms } from "@/app/modules/gameAtoms";
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { loginAtom } from "@/app/modules/loginAtoms";
import { useRouter } from "next/navigation";
import { useAtom } from 'jotai';
import MyModal from '@/component/MyModal';
import Catch from '../catch/page';
import { tokenAtoms } from '@/app/modules/tokenAtoms';
import { answerAtom } from '../modules/answerAtom';
import { userInfoAtoms } from '../modules/userInfoAtom';
import { io } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';
import { socketApi } from '../modules/socketApi';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { css, keyframes } from "@emotion/react";
import React from 'react';
import Flower from '../redGreen/page';
import { redGreenInfoAtom } from '../modules/redGreenAtoms';
import { redGreenStartAtom } from '../modules/redGreenStartAtom';
import MyPopover from '@/component/MyPopover';
import { anchorElAtom } from '../modules/popoverAtom';
import QRpage from '@/component/QRpage';
import { catchStartAtom } from '../modules/catchStartAtom';

export default function QR() {
    const [nowPeople, setNowPeople] = useState(0);
    const [gameInfo, setGameInfo] = useAtom(gameAtoms);
    const [userInfo,] = useAtom(userInfoAtoms);
    const [isLogin,] = useAtom(loginAtom);
    const router = useRouter();
    const [open, setOpen] = useState(true);
    const [gameContent, setGameContent] = useState<JSX.Element>();
    const [token,] = useAtom(tokenAtoms);
    const [answer, setAnswer] = useAtom(answerAtom);
    const [uuId,] = useState<string>(uuidv4());
    const [nameSpace ,setNameSpace] = useState<string>('');
    const socket = useRef(io(`${socketApi}/${JSON.parse(localStorage.getItem('game') || 'null')[0] === '그림 맞추기'?'catch':'redgreen'}?uuId=${uuId}`, {
        withCredentials: true,
        transports: ["websocket"],
        autoConnect: false,
    }));
    const gamePageUrlAns = useRef(`${process.env.NEXT_PUBLIC_RECRE_URL}/catchAnswer`);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const [emotions, setEmotions] = useState<emotion[]>([]);
    const [redGreenInfo, ] = useAtom(redGreenInfoAtom);
    const [isStart, setIsStart] = useAtom(redGreenStartAtom);
    interface emotion {
        x: number;
        y: number;
        emotion: string;
    }
    const gamePageUrl = `${process.env.NEXT_PUBLIC_RECRE_URL}/player?data=${userInfo.id}_${nameSpace}`;
    const [anchorEl, setAnchorEl] = useAtom(anchorElAtom);
    const [, setCatchStart] = useAtom(catchStartAtom);

    useEffect(() => {
        // if (!isLogin) {
        //     // console.log(isLogin)
        //     alert('로그인이 필요합니다.')
        //     router.push("/")
        // }

        setIsStart(false)

        switch (JSON.parse(localStorage.getItem('game') || 'null')[0]) {
            case '그림 맞추기':
                setNameSpace('catch')
                break;
            case '무궁화 꽃이 피었습니다':
                setNameSpace('redgreen')
                break;
        }
        socket.current.connect();

        socket.current.volatile.on("connect", () => {
            // console.log("disconnect_check:", socket.current.connected);
            makeRoom(localStorage.getItem('access_token')??'' as string);
        });


        socket.current.volatile.on("disconnect", () => {
            // console.log("disconnect_check:", socket.current.connected);
        });

        if (JSON.parse(localStorage.getItem('game') || 'null')[0] === '그림 맞추기') {
            setGameContent(<Catch socket={socket.current} />)
        } else if (JSON.parse(localStorage.getItem('game') || 'null')[0] === '무궁화 꽃이 피었습니다') {
            setGameContent(<Flower socket={socket.current} />)
        } else if (JSON.parse(localStorage.getItem('game') || 'null')[0] === '줄넘기') {
            setGameContent(<Catch socket={socket.current} />)
        }

        socket.current.on("start_catch_game", (response) => {
            // console.log(response)
            if(response.result === true){
                setEmotions([])
                setOpen(false);
            }
            else
                alert(response.message)
        });

        socket.current.on('set_catch_answer', (res)=>{
            // console.log(res)
            if(res.type === 'answer_success'){
                setAnswer(res.answer)
            }
        });

        socket.current.on('player_list_add', (res)=>{
            // console.log(res)
            setNowPeople(res.player_cnt)
        });

        socket.current.on('player_list_remove', (res)=>{
            // console.log(res)
            setNowPeople(res.player_cnt)
        });

        socket.current.on('express_emotion', (res)=>{
            // console.log(emotions);
            makeEmotion(res.emotion);
        })

        setCatchStart(false)

        return () => { 
            handleBeforeUnload();
        };
    }, []);

        const makeRoom = (acc_token: string) => {
            const game_t = JSON.parse(localStorage.getItem('game') || 'null');
            socket.current.emit('make_room', {
                // goalDistance : redGreenInfo[1],
                // winnerNum : redGreenInfo[0],
                goalDistance : JSON.parse(localStorage.getItem('redGreenInfo') || 'null')[1],
                winnerNum : JSON.parse(localStorage.getItem('redGreenInfo') || 'null')[0],
                game_type: game_t[0],
                user_num: game_t[1],
                answer: answer,
                access_token: acc_token
            });
        };

        const startGame = () => {
            if(gameInfo[0] === '그림 맞추기'){
                if (!answer) {
                    alert('먼저 정답을 입력해주세요.')
                    return
                }
                socket.current.emit('start_catch_game', {
                    access_token: token
                });
                setCatchStart(true);
            } else if(gameInfo[0] === '무궁화 꽃이 피었습니다'){
                setIsStart(true);
                socket.current.emit('pre_player_status', {
                })
        
            setOpen(false);
            }
        }

        const handleBeforeUnload = () => {
            const user_t = JSON.parse(localStorage.getItem('userInfo')|| 'null');
            socket.current.emit('end_game', {
                access_token: token,
                room_id: user_t.id
            });

        };


        const testGame = () => {
            setIsStart(true);
            setOpen(false);
        }

        const makeEmotion = useCallback(async(emotion : string) => {
            if (modalRef.current) {
                const { left, top, right, bottom } = modalRef.current.getBoundingClientRect() as DOMRect;
                // console.log(left, top, right, bottom);
                let randomX = window.innerWidth/2
                let randomY = window.innerHeight/2
                while (randomX > left && randomX < right && randomY > top && randomY < bottom) {
                    randomX = Math.floor(Math.random() * window.innerWidth);
                    randomY = Math.floor(Math.random() * window.innerHeight);
                }
                // console.log(randomX, randomY);

                if(emotions.length > 20){
                    setEmotions((prevEmotions) => [...prevEmotions.slice(1),{ x: randomX, y: randomY, emotion: emotion }]);
                }
                else 
                    setEmotions((prevEmotions) => [...prevEmotions, { x: randomX, y: randomY, emotion: emotion }]);
                ;
            }    
        },[]);    

        useEffect(()=>{
            console.log(emotions.length)
            if(emotions.length>150){
                setEmotions([])
            }
        },[emotions])

        return (<>
            <MyModal open={open} modalHeader={"QR코드를 찍고 입장해주세요!"} modalContent={<QRpage gamePageUrlAns={gamePageUrlAns} gamePageUrl={gamePageUrl} nowPeople={nowPeople} total={gameInfo[1]??0} startGame={startGame}/>} closeFunc={() => { }} myref={modalRef}/>
            {gameContent}
            <div id='emotionPlace'>{
                emotions.map((emotion, index) => {
                    return <div className='emotion' key={index} style={{
                        position: 'absolute',
                        left: emotion.x,
                        top: emotion.y,
                        fontSize: '30px',
                        zIndex: 10000,
                        animation: 'move 2s linear forwards',
                    }}>{emotion.emotion}</div>
                })
            }</div>
            <style jsx>{`

        @keyframes move {
            0% {
              transform: translate(0, 0);
              opacity: 1;
            }
          
            25% {
              transform: translate(-10px, -20px);
            }
          
            50% {
              transform: translate(10px, -40px);
            }
          
            75% {
              transform: translate(-10px, -60px);
            }
          
            100% {
              transform: translate(10px, -80px);
              opacity: 0;
            }
          };
        `}</style>
        </>
        )
    }   