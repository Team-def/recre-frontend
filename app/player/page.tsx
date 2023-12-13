"use client";
import Button from '@mui/material/Button';
import { useSearchParams, useRouter } from "next/navigation";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import CatchPlayer from '../playerComponent/catchPlayer';
import RedGreenPlayer from '../playerComponent/redGreenPlayer';
import { io } from "socket.io-client";
import { v4 as uuidv4 } from 'uuid';
import { socketApi } from '../modules/socketApi';
import useVH from 'react-viewport-height';
import { Alert, Box, ButtonGroup, TextField, styled } from '@mui/material';
import { isMobile, browserName } from 'react-device-detect';
import Image from 'next/image';
import MyModal from '@/component/MyModal';
import { type } from 'os';

const TextInfoCustom = styled(TextField)(({colorStyle}:{colorStyle:string})=>({
    width: 200,
    textAlign: 'center',
    fontFamily: 'myfont',
    "& .MuiOutlinedInput-input": {
        color: colorStyle,
        textAlign: 'center',
        fontFamily: 'myfont',
    },

    "&:hover .MuiOutlinedInput-input": {
        color: colorStyle,
        fontFamily: 'myfont',
    },
    "&:hover .MuiInputLabel-root": {
        color: colorStyle,
        fontFamily: 'myfont',
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: colorStyle
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
        color: colorStyle,
        fontFamily: 'myfont',
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: colorStyle,
        fontFamily: 'myfont',
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: colorStyle
    },
    "& .MuiInputLabel-root": {
        color: colorStyle,
        fontFamily: 'myfont',
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: colorStyle,
        borderWidth: 2,
        fontFamily: 'myfont',
    },

    "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: colorStyle,
    },
}));

export default function Player() {
    const params = useSearchParams();
    const [data, setData] = useState<string[]>(params.get('data')?.split('_') ?? []);
    const router = useRouter(); //query string에서 hostId를 가져옴
    const [playerNickname, setPlayerNickname] = useState<string | null>(null);
    const [ready, setReady] = useState<boolean>(false);
    const [isGame, setIsGame] = useState<boolean>(false);
    const [isGateClosed, setIsGateClosed] = useState<boolean>(false); //closeGate 여부를 관리하는 상태
    const [isReadySent, setIsReadySent] = useState<boolean>(false); //ready 이벤트를 보냈는지 여부를 관리하는 상태
    const [shakeCount, setShakeCount] = useState<number>(0);
    const [gameContent, setGameContent] = useState<JSX.Element | null>(null);
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [uuId,] = useState<string>(uuidv4());
    const [addClass, setAddClass] = useState(false);
    const circleRef = useRef<HTMLHeadingElement>(null);
    const [colorStyle, setColorStyle] = useState<string>('orange');
    const containerRef = useRef<HTMLDivElement>(null);

    const vh = useVH();

    const socket = useRef(io(`${socketApi}/${data[1]}?uuId=${uuId}`, {
        withCredentials: true,
        transports: ["websocket"],
        autoConnect: false,
    }));

    const [redGreenData, setRedGreenData] = useState<redGreenDataType>({
        length: 0,
        win_num: 0,
        total_num : 0,
    });

    interface redGreenDataType {
        length: number,
        win_num: number,
        total_num : number,
    }

    let accelerationData: number[] = [];
    let lastAcceleration = 0;

    const handleShake = () => {
        setShakeCount((prevCount) => prevCount + 1);
    }

    //device의 움직임을 읽어오는 함수
    const handleDeviceMotion = (event: DeviceMotionEvent) => {
        event.preventDefault(); //shakeToUndo 기능 방지
        const acceleration= event.acceleration;

        if (acceleration) {
            const accelerationMagnitude = (acceleration.y??0)
            const smoothedAcceleration = 0.2 * accelerationMagnitude + 0.8 * lastAcceleration;
            lastAcceleration = smoothedAcceleration;
            accelerationData.push(smoothedAcceleration);

            const maxDataLength = 3;
            if (accelerationData.length > maxDataLength) {
                accelerationData = accelerationData.slice(1);
            }

            const peakIndex = detectPeak(accelerationData);

            if (peakIndex !== -1) {
                handleShake();
            }
        }
    };

    const detectPeak = (data: number[]): number => {
        const threshold = 1.5; // Adjust this threshold based on testing
    
        for (let i = 1; i < data.length - 1; i++) {
          if (data[i] > data[i - 1] && data[i] > data[i + 1] && data[i] > threshold) {
            return i;
          }
        }
        return -1;
    };
    //여기까지 움직임 측정 함수

    //safari 브라우저에서는 센서 권한을 허용받아야 함
    const isSafariOver13 = typeof window.DeviceOrientationEvent.requestPermission === 'function';

    const requestPermissionSafari = () => {
        //iOS
        if (isSafariOver13) {
            window.DeviceOrientationEvent.requestPermission().then((permissionState) => {
                if (permissionState === 'denied') {
                    //safari 브라우저를 종료하고 다시 접속하도록 안내하는 화면 필요
                    alert('게임에 참여 하려면 센서 권한을 허용해주세요. Safari를 완전히 종료하고 다시 접속해주세요.');
                    return;
                } else if (permissionState === 'granted') {
                    window.addEventListener('devicemotion', handleDeviceMotion);
                };
            })
        
        //android         
        } else {
            alert('게임 참여를 위하여 모션 센서를 사용합니다.');
            window.addEventListener('devicemotion', handleDeviceMotion);
        };
    }

    useEffect(() => {
        if (parseInt(data[0]) === null) {
            alert('잘못된 접근입니다.');
            window.close();
        }

        //catchmind 시작
        socket.current.on("start_catch_game", (res) => {
            if (res.result === true) {
                setIsGame(true)
            } else {
                alert(res.message)
            }
        })
        //redgreen 시작
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
            if (res.result === true) {
                setReady(true)
                setModalOpen(false)

                if(data[1]){
                    switch (data[1]) {
                        case 'catch':
                            setGameContent(<CatchPlayer roomId={data[0] as string} socket={socket.current} />)
                            break;
                        case 'redgreen':
                            setGameContent(<RedGreenPlayer roomId={data[0] as string} socket={socket.current} 
                                length={res.length as number} win_num={res.win_num as number} total_num={res.total_num as number} />)
                            break;
                    }
                }
                else{
                    alert('잘못된 접근입니다.');
                    window.close();
                }
            }
            else {
                //여기에서 레디가 중복으로 들어갔다는 에러 경고창을 띄움
                alert(res.message)
            }
        })

        //closeGate
        socket.current.on("close_gate", (res) => {
            setShakeCount((prev) => prev = 0);
            setIsGateClosed(true);
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
        if (playerNickname === null || playerNickname === '') {
            alert('닉네임을 입력해주세요.');
            return;
        } else if (playerNickname.length > 5) {
            alert('닉네임은 5글자 이하로 입력해주세요.');
            setPlayerNickname('')
            return;
        }

        localStorage.setItem('nickname', playerNickname);

        //gametype에 따라 다른 socket 연결
        if (data[1] === null || data[1] === '') {
            alert('잘못된 접근입니다.');
            return;
        //catchmind
        } else if (data[1] === 'catch') {
            socket.current.connect();
            socket.current.emit("ready", {
                room_id: parseInt(data[0]),
                nickname: playerNickname
            });
            setTimeout(() => {
                setColorStyle('rgb(48,67,143)')
            }, 200)
            if(containerRef.current && circleRef.current){
                containerRef.current.style.setProperty('background-color', 'orange')
                circleRef.current.style.setProperty('background-color', 'orange')
                setAddClass(true)
            }
            return;
        //redgreen
        } else if (data[1] === 'redgreen') {
            setModalOpen(true);
            requestPermissionSafari();
        }
    };

    useEffect(() => {
        if(!ready){
            //10번 흔들어서 준비 완료
            if (shakeCount >= 10 && !isReadySent) {
                socket.current.connect();
                setIsReadySent(true);
                socket.current.emit("ready", {
                    room_id: parseInt(data[0]),
                    nickname: playerNickname,
                });
                let isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                if (!isSafari) {
                    navigator.vibrate([1000]);
                }
                setTimeout(() => {
                    setColorStyle('rgb(48,67,143)')
                }, 200)
                if(containerRef.current && circleRef.current){
                    containerRef.current.style.setProperty('background-color', 'orange')
                    circleRef.current.style.setProperty('background-color', 'orange')
                    setAddClass(true)
                }
            }
        }
    }, [shakeCount])

    //modal창 띄우기
    const ReadyModal = () => {
        if (data[1] === 'redgreen') {
            return (
                <div className='readyModalDiv'>
                    <div className='readyModalHeader'>흔들어서 준비하기! </div>
                    <div className='readyModalContent'>호스트가 준비를 완료하면 게임이 시작됩니다.</div>
                    <div className='readyModalCount'> {shakeCount} / 10 </div>
                    {/* <button onClick={() => setShakeCount((prev)=>prev + 1)}>test</button> */}
                </div>
            )
        }
    }
    //준비 취소
    const cancelReady = () => {
        socket.current.emit("leave_game", {
        });
        setTimeout(() => {
            setColorStyle('orange')
        }, 200)
        if(containerRef.current && circleRef.current){
            containerRef.current.style.setProperty('background-color', 'rgb(48,67,143)')
            circleRef.current.style.setProperty('background-color', 'rgb(48,67,143)')
        }
        setShakeCount((prev) => prev = 0);
        setIsReadySent(false);
        setReady(false);
        setAddClass(true)
    }

    useEffect(() => {
        if (addClass) {
            setTimeout(() => {
                setAddClass(false)
            }, 500)
        }
    }, [addClass])

    const expressEmotion = (emotion: string) => {
        socket.current.emit("express_emotion", {
            room_id: parseInt(data[0]),
            emotion: emotion
        });
    }

    const emotions = ['❤️', '👍', '🦋', '💩']


    return (
        <>{isGame ? gameContent :
            <>
                    <div className='wrapper' ref={containerRef}>
                        <div className='lightbulb'></div>
                    <div className={`circleDiv ${addClass ? 'active' : ''}`} ref={circleRef}></div>
                <div className="nickname-container">
                    <div className="p_headerContainer">
                        <div className="logo">
                            <span className='logoSpan'>RecRe</span>
                            {ready?'':<Image src="/teamDEF_logo.png" alt='logo' width={100} height={100} />}
                        </div>
                    </div>
                    <div className='alertDiv'><Alert severity={ready ? "success" : "info"} style={{fontFamily:'myfont',backgroundColor:colorStyle,color:ready?'orange':'rgb(48,67,143)'}}>{ready ? "잠시 기다려 주시면 게임이 곧 시작됩니다!" : "닉네임을 입력하신 후 '준비 완료!' 버튼을 눌러주세요!"}</Alert></div>
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
                                color: colorStyle,
                                border: `1px solid ${colorStyle}`,
                                borderRadius:'3px',
                                '& > *': {
                                    m: 2,
                                },
                            }}
                        ><span>호스트 화면에 이모티콘을 띄워보세요!</span>
                            <ButtonGroup aria-label="medium button group" sx={{boxShadow:'2.5px 2.5px 7px #262626'}}>{emotions.map((emotion, index) => {
                                return <Button className="nickname-change" size='large' variant='outlined' key={index} disabled={!ready} onClick={() => expressEmotion(emotion)} sx={{borderColor:colorStyle}}>{'' + emotion + ''}</Button>
                            })}</ButtonGroup></Box>
                    </div></>:null
                    }
                    <div className='nickDiv'>
                        <label className="nickname-label">닉네임을 입력해주세요! </label>
                        <TextInfoCustom
                            className="nickname-input"
                            id="outlined-text"
                            label=''
                            type="text"
                            value={playerNickname ?? ''}
                            onChange={(e : any) => setPlayerNickname(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            color='primary'
                            colorStyle={colorStyle}
                            disabled={ready}
                        />
                        <Button variant="contained" className="nickname-change" onClick={ready ? cancelReady : readyToPlay} disabled={isGateClosed} sx={{backgroundColor:colorStyle, fontFamily:'myfont',color:ready?'orange':'rgb(48,67,143)', marginTop:'15px','&:focus': {
            backgroundColor: colorStyle,
        },}}>
                            {ready ? "준비 취소!" : "준비 완료!"}
                        </Button></div>
                        <MyModal open={modalOpen} modalHeader={`흔들어서 게임준비`} modalContent={<ReadyModal />} closeFunc={() => { }} myref={null} />
                </div></div></>}
            <style jsx>{`
                .wrapper{
                    height: ${100 * vh}px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background-color:rgb(48,67,143);
                    transition-delay: 0.5s;
                }
                .circleDiv{
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background: orange;
                    transition: clip-path 0.5s ease-out;
                    clip-path: circle(0% at 50% 92%);
                    z-index: 0;
                }
                .circleDiv.active{
                    clip-path: circle(141.4% at 50% 92%);
                }
                .nickname-container {
                    height: ${90 * vh}px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-around;
                    padding-top:10%;
                    z-index:2;
                }

                .nickname-label {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color:${colorStyle}
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
                    background-color: tranparent;
                }
                .nickDiv{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .p_headerContainer{
                    height:auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background-color: tranparent;
                    border-radius:30px;
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
                    background-color: tranparent;
                }
                .logoSpan{
                    font-size: 60px;
                    font-weight: 500;
                    color:black;
                    color:${colorStyle}
                }
                .emotionDiv{
                    width: 70%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                }
                .lightbulb{
                    position: absolute;
                    background-image: url('/lightbulb.gif');
                    background-size: cover;
                    width: 100vw;
                    height: 100px;
                    top: 3vh;
                    z-index: 1;
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