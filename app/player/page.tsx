"use client";
import Button from '@mui/material/Button';
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useState } from "react";
import CatchPlayer from '../playerComponent/catchPlayer';
import { io } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';
import { socketApi } from '../modules/socketApi';
import useVH from 'react-viewport-height';
import { Alert, Box, ButtonGroup } from '@mui/material';
import { isMobile, browserName } from 'react-device-detect';
import Image from 'next/image';
import { type } from 'os';
import RedGreenPlayer from '../redgreentemp/page';





export default function Player() {
    const params = useSearchParams();
    const [data, setData] = useState<string[]>(params.get('data')?.split('_') ?? []);
    const router = useRouter();
    //query string에서 hostId를 가져옴
    const [playerNickname, setPlayerNickname] = useState<string | null>(null);
    const [ready, setReady] = useState<boolean>(false);
    const [isGame, setIsGame] = useState<boolean>(false);
    const [uuId,] = useState<string>(uuidv4());
    const vh = useVH();
    const socket = useRef(io(`${socketApi}/${data[1]}?uuId=${uuId}`, {
        withCredentials: true,
        transports: ["websocket"],
        autoConnect: false,
    }));

    useEffect(() => {
        if (parseInt(data[0]) === null) {
            alert('잘못된 접근입니다.');
            router.push("/");
        }



        socket.current.on("start_catch_game", (res) => {
            if (res.result === true) {
                setIsGame(true)
            } else {
                alert(res.message)
            }
        })

        socket.current.on("start_game", (res) => {
            if (res.result === true) {
                setIsGame(true)
            } else {
                alert(res.message)
            }
        })


        socket.current.on("end", (res) => {
            if (res.result === true) {
                alert('게임이 종료되었습니다.')
                window.close();
            }
        })

        socket.current.on("forceDisconnect", (res) => {
            alert('게임이 15분동안 시작되지 않아 종료되었습니다.')
            setReady(false)
        })

        socket.current.on("ready", (res) => {
            alert(32323)
            if (res.result === true) {
                // alert('ready')
                setReady(true)
            }
            else {
                alert(res.message)
            }
        })

        if (isMobile && (browserName === 'Samsung Internet')) {
            alert("삼성 브라우저에서는 다크모드를 사용하실 경우 캐치마인드 게임이 어렵습니다.\n다크모드를 사용중이실 경우 해제하고 게임을 즐겨주세요!");
        }

        // window.addEventListener('resize', useVH);

        return () => {
            // socket.current.emit("leave_game", {
            // });
            // // window.close();
        }
    }, []);

    const readyToPlay = () => {
        alert(`${parseInt(data[0])}, ${data[1]}`)
        if (playerNickname === null || playerNickname === '') {
            alert('닉네임을 입력해주세요.')
            return
        }
        socket.current.connect();
        socket.current.emit("ready", {
            room_id: parseInt(data[0]),
            nickname: playerNickname
        });
    };

    const cancleReady = () => {
        socket.current.emit("leave_game", {
        });
        setReady(false)
    }

    const expressEmotion = (emotion: string) => {
        socket.current.emit("express_emotion", {
            room_id: parseInt(data[0]),
            emotion: emotion
        });
    }

    const emotions = ['❤️', '👍', '🦋', '💩']


    return (
        <>{isGame ? data[1] === 'redgreen'?<RedGreenPlayer roomId={data[0] as string} socket={socket.current}/>:
            //캐치마인드 게임이 시작되면 catch로 이동
            <CatchPlayer roomId={data[0] as string} socket={socket.current} /> :
            //무궁화꽃이피었습니다 게임이 시작되면 flower로 이동
            <>
                <div className="nickname-container">
                    <div className="headerContainer">
                        <div className="logo">
                            <span className='logoSpan'>RecRe</span>
                            <Image src="/teamDEF_logo.png" alt='logo' width={100} height={100} />
                        </div>
                    </div>
                    <div className='alertDiv'><Alert severity={ready ? "success" : "info"}>{ready ? "잠시 기다려 주시면 게임이 곧 시작됩니다!" : "닉네임을 입력하신 후 '준비 완료!' 버튼을 눌러주세요!"}</Alert></div>
                    {ready?<>
                    <div className='emotionDiv'>
                        <Box
                            sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignContent: 'center',
                                flexDirection: 'column',
                                alignItems: 'center',
                                fontStyle:'italic',
                                color: 'gray',
                                '& > *': {
                                    m: 2,
                                },
                            }}
                            onClick={() => ready?null:alert('먼저 준비를 완료해주세요!')}
                        ><span>호스트 화면에 이모티콘을 띄워보세요!</span>
                            <ButtonGroup aria-label="medium button group">{emotions.map((emotion, index) => {
                                return <Button className="nickname-change" size='large' variant='outlined' key={index} disabled={!ready} onClick={() => expressEmotion(emotion)}>{'' + emotion + ''}</Button>
                            })}</ButtonGroup></Box>
                    </div></>:null
                    }
                    <div className='nickDiv'>
                        <label className="nickname-label">닉네임을 입력해주세요! </label>
                        <input
                            type="text"
                            className="nickname-input"
                            value={playerNickname ?? ''}
                            onChange={(e) => setPlayerNickname(e.target.value)}
                            disabled={ready}
                            placeholder='닉네임을 입력해주세요.'
                        />
                        <Button variant={ready ? "outlined" : "contained"} className="nickname-change" onClick={ready ? cancleReady : readyToPlay}>
                            {ready ? "준비 취소!" : "준비 완료!"}
                        </Button></div>
                </div></>}
            <style jsx>{`
                .nickname-container {
                    height: ${100 * vh}px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-evenly;
                    background-color: #F5F5F5;
                    border-radius: 10px;
                    ${ready?'padding-top: 7%;':''}
                }

                .nickname-label {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }

                .nickname-input {
                    width: 200px;
                    height: 30px;
                    padding: 5px;
                    border: 1px solid #CCCCCC;
                    border-radius: 5px;
                    margin-bottom: 10px;
                    text-align: center;
                    font-size: 16px;
                }

                .nickname-change {
                    width: 120px;
                    height: 40px;
                    background-color: #FF6B6B;
                    color: #FFFFFF;
                    font-size: 16px;
                    font-weight: bold;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                .logo{
                    font-size: 32px;
                    bakcground-color: #F5F5F5;
                }
                .nickDiv{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .headerContainer{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background-color: #F5F5F5;
                }
                .alertDiv{ 
                    width: 70%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                }
                .logo{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background-color: #F5F5F5;
                }
                .logoSpan{
                    font-size: 60px;
                    font-weight: 500;
                    color:black;
                }
                .emotionDiv{
                    width: 70%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                }
            `}</style>
            <style jsx global>{`
                body {
                    overflow: hidden !important;
                }
            `}</style>
        </>
    )
}