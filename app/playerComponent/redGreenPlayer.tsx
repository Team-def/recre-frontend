"use client";
import { useState, useRef, useEffect } from 'react';
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { socketApi } from '../modules/socketApi';

let accelerationData: number[] = [];
let lastAcceleration = 0;

export default function RedGreenPlayer({ roomId, socket }: { roomId: string, socket: Socket }) {
    const startTime = new Date(); //게임 시작시에 시간 기록
    const [shakeCount, setShakeCount] = useState(0);
    const [isAlive, setIsAlive] = useState(true); //생존 여부를 관리하는 상태
    const [start, setStart] = useState(false);

    //시간 측정 함수
    const timeCheck = (startTime: Date, endTime: Date):string | void => {
        if (typeof startTime === 'object' && typeof endTime === 'object' && startTime !== null && endTime !== null && 'getTime' in startTime && 'getTime' in endTime) {
            const timeDifference = endTime.getTime() - startTime.getTime();
            const minutes = Math.floor(timeDifference / (1000 * 60));
            const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
            const formattedElapsedTime = `${minutes}분 ${seconds}초`;
            return formattedElapsedTime;
        }
        return alert('시간 측정 불가');
    };
    
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
        const threshold = 1.5; // Adjust this threshold based on testing
    
        for (let i = 1; i < data.length - 1; i++) {
          if (data[i] > data[i - 1] && data[i] > data[i + 1] && data[i] > threshold) {
            return i;
          }
        }
        return -1;
    };

    window.addEventListener('devicemotion', handleDeviceMotion);


    useEffect(() => {
        window.addEventListener('devicemotion', handleDeviceMotion);
        
        //통과
        socket.on('touchdown', (res) => {
            const endTime = new Date(res.endtime); //게임 종료시에 시간 기록
            const elapsedTime = timeCheck(startTime, endTime); //게임 시간 계산
            alert(`이겼습니다. 우승자는 ${res.name}입니다. 걸린 시간: ${elapsedTime}`);
            //이겼을 때 화면에 표시되어야 할 것들
        });
    
        //죽음
        socket.on('youdie', (res)=> {
            const endTime = new Date(res.endtime); //게임 종료시에 시간 기록
            const elapsedTime = timeCheck(startTime, endTime); //게임 시간 계산
            setIsAlive(false);
            alert(`죽었습니다. 당신은 ${res.distance}만큼 이동했고, ${elapsedTime}만큼 생존했습니다.`);
            //기타 죽었을 때 화면에 표시되어야 할 것들
        });
    },[]);

    //달리는 중
    useEffect(() => {
        if (isAlive) {
            socket.emit('run', {
                shakeCount: shakeCount,});
        }
    }, [shakeCount]);

    return (
        <>

        <div>
            <p>Shake Count: {shakeCount};</p>
            <button onClick={()=>setShakeCount((prev)=>prev+1)}>test</button>
        </div>
        
        </>
    );
}