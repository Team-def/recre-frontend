"use client";
import { useState, useRef, useEffect } from 'react';
import { Socket } from "socket.io-client";
import useVH from 'react-viewport-height';
import { io } from "socket.io-client";
import { socketApi } from '../modules/socketApi';
import MyModal from '@/component/MyModal';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Image from 'next/image';

let accelerationData: number[] = [];
let lastAcceleration = 0;

export default function RedGreenPlayer({ roomId, socket, length, win_num, total_num}: { roomId: string, socket: Socket, length: number, win_num: number, total_num: number}) {
    const [shakeCount, setShakeCount] = useState(0);
    const [isAlive, setIsAlive] = useState(true); //생존 여부를 관리하는 상태
    const [open, setOpen] = useState(false);
    const [modalHeader, setModalHeader] = useState<string>('');
    const [modalContent, setModalContent] = useState<JSX.Element>(<></>);
    const [myrank, setMyRank] = useState<number>(0); //등수를 관리하는 상태
    const [nickname, setNickname] = useState<string>('');
    const [isGreen, setIsGreen] = useState<boolean>(true); //초록색인지 빨간색인지를 관리하는 상태
    const [progress, setProgress] = useState<number>(0); //왼쪽에서 오른쪽으로 얼마나 진행했는지를 관리하는 상태
    const [latency, setLatency] = useState<number>(0); //지연 시간을 관리하는 상태
    const vh = useVH();

    //초록색인지 빨간색인지에 따라 outline 색깔을 바꿔주는 클래스 이름을 동적으로 결정
    const outlineClassName = isGreen ? 'outline-player-page-green' : 'outline-player-page-red';
    //생존 여부에 따라 minimap 색깔을 바꿔주는 클래스 이름을 동적으로 결정
    const minimapClassName = isAlive ? 'minimap-player' : 'minimap-player-dead';
    //왼쪽에서 오른쪽으로 얼마나 진행했는지를 계산

    //시간 측정 함수
    const timeCheck = (elapsed_time:Date):string | void => {
        if(elapsed_time) {
            const timeDifference =elapsed_time.getTime();
            const minutes = Math.floor(timeDifference / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
            const formattedElapsedTime = `${minutes}분 ${seconds}초`;
            return formattedElapsedTime;
        }
        return alert('시간 측정 불가');
    };

    enum state {
        alive = 'ALIVE',
        dead = 'DEAD',
        finish = 'FINISH',
      }

    interface all_player {
        name: string,
        distance: number,
        state: state,
        elapsed_time: number,
    }
    
    //shake 이벤트가 발생하면 shakeCount를 1 증가시키는 함수
    const handleShake = () => {
        if (isAlive) {
            setShakeCount((prevCount) => prevCount + 1);
        }
    }

    //device의 움직임을 읽어오는 함수
    const handleDeviceMotion = (event: DeviceMotionEvent) => {
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
        const threshold = 2.5; // Adjust this threshold based on testing
    
        for (let i = 1; i < data.length - 1; i++) {
          if (data[i] > data[i - 1] && data[i] > data[i + 1] && data[i] > threshold) {
            return i;
          }
        }
        return -1;
    };

    useEffect(() => {
        window.addEventListener('devicemotion', handleDeviceMotion);

        socket.on('game_finished', (res) => {
            setModalHeader('게임 끝!');
            setOpen(true);
            setModalContent(<List
                sx={{
                  width: '100%',
                  maxWidth: 360,
                  bgcolor: 'background.paper',
                  position: 'relative',
                  overflow: 'auto',
                  maxHeight: 300,
                  '& ul': { padding: 0 },
                }}
                subheader={<li />}
              >{res.player_info.map((player : all_player, index : number)=>{
                const elapsedTime = timeCheck(new Date(player.elapsed_time)); //게임 시간 계산
                const playerFixedDistance = player.distance>length?length:player.distance;
                return <ListItem key={`item-${index}`}><div style={{backgroundColor: player.name === localStorage.getItem('nickname')?"#ffd400":'white'}}>{index+1}등: {player.name} / {playerFixedDistance} / {elapsedTime??''} / {player.state}</div></ListItem>
            })}</List>);
        });
        
        //통과
        socket.on('touchdown', (res) => {
            const elapsedTime = timeCheck(new Date(res.elapsed_time)); //게임 시간 계산
            setModalHeader('통과!');
            setModalContent(<div>{res.name}님 축하합니다!<br></br> 이동 거리: {length} / {length}<br></br>걸린 시간: {elapsedTime}<br></br> 등수 : {myrank} / {total_num}</div>);
            setOpen(true);
            //이겼을 때 화면에 표시되어야 할 것들
        });
    
        //죽음
        socket.on('youdie', (res)=> {
            const elapsedTime = timeCheck(new Date(res.elapsed_time)); //게임 시간 계산
            setIsAlive(false);
            setModalHeader('죽었습니다!');
            setModalContent(<div>{res.name}님께서는 탈락하셨습니다!<br></br> 이동 거리: {res.distance>length?length:res.distance} / {length}<br></br> 생존 시간 : {elapsedTime} </div> );
            setOpen(true);
            //기타 죽었을 때 화면에 표시되어야 할 것들
        });

        //실시간 redgreen 색깔 정보
        socket.on('realtime_redgreen', (res) => {
            setIsGreen(res.go);
        });

        //실시간 등수 정보
        socket.on('realtime_my_rank', (res) => {
            setMyRank(res.rank);
        });

        setInterval(() => {
          const start = performance.now();
          socket.emit("ping", {start}, (res: {start: number}) => {
            const end = performance.now();
            const latency = (end - res.start) / 2;
            setLatency(latency);
            console.log(`latency: ${latency}ms`);
          });
        }, 2000);
        
        return () => {
            localStorage.removeItem('nickname')
        }
    }, []);

    //달리는 중
    useEffect(() => {
        if (isAlive) {
            if(shakeCount<=length){
                socket.emit('run', {
                    shakeCount: shakeCount,
                    latency: latency,
                });
                setProgress((shakeCount / length) * 100);    
            }
        }
    }, [shakeCount]);

    return (
        <>

        <div className={outlineClassName}>
            <div className="speech-bubble-player">
                <h1>달린 거리 : {shakeCount>length?length:shakeCount} / {length}</h1>
                <h1>나의 등수 : {myrank} / {total_num} 등</h1>
                <button onClick={()=>setShakeCount((prev)=>prev+1)}>test</button>
            </div>
            <div className={minimapClassName}>
                <div className="icon" style={{left: `${progress * 0.8}%`}}>
                    <Image src="/walker.png" alt="walker" width={100} height={100} />
                </div>
            </div>
          <MyModal open={open} modalHeader={modalHeader} modalContent={modalContent} closeFunc={() => { }} myref={null}/>
        </div>
        <style jsx>{`
            .outline-player-page-green {
                margin: 20px auto;
                /* padding: 10px auto; */
                outline: 30px solid green;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                align-items: center;
                border-radius: 5%;
                height: ${95 * vh}px;
                width: 80vw;
                background-color: #faf9f6;
            }
            .outline-player-page-red {
                margin: 20px auto;
                /* padding: 10px auto; */
                outline: 30px solid red;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                align-items: center;
                border-radius: 5%;
                height: ${95 * vh}px;
                width: 80vw;
                background-color: #faf9f6;      
            }
            .speech-bubble-player {
                width: 100%;
                height: 50%;
                display: flex;
                flex: 1;
                flex-direction: column;
                border-bottom: 20px solid black;
                justify-content: space-evenly;
                align-items: center;
            }
            .minimap-player {
                width: 100%;
                height: 100%;
                display: flex;
                flex: 1;
                flex-direction: column;
                justify-content: space-evenly;
                align-items: center;
                border-bottom: 5px solid #5C4033;

            }
            .minimap-player-dead {
                width: 100%;
                height: 100%;
                display: flex;
                flex: 1;
                flex-direction: column;
                justify-content: space-evenly;
                align-items: center;
                background-color: gray;
                border-bottom: 5px solid gray;
            }
            .icon {
                position: absolute;
                bottom: 0;
                transition: left 0.3s ease;
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