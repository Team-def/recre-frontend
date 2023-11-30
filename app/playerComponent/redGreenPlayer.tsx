"use client";
import { useState, useRef, useEffect } from 'react';
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { socketApi } from '../modules/socketApi';

let accelerationData: number[] = [];
let lastAcceleration = 0;

export default function RedGreenPlayer({ roomId, socket }: { roomId: string, socket: Socket }) {
    const [shakeCount, setShakeCount] = useState(0);
    const [isAlive, setIsAlive] = useState(true); //생존 여부를 관리하는 상태
    //test를 위한 임시 socket 설정
    // const socket = useRef(io(`${socketApi}?uuId=123`, {
    //     withCredentials: true,
    //     transports: ["websocket"],
    //     autoConnect: false,
    // }));
    
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

    //iOS 13 이상의 safari 브라우저에서는 모션 이벤트 권한을 요청해야 함
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
            window.addEventListener('devicemotion', handleDeviceMotion);
        };
    }

    // //통과
    // socket.current.on('touchdown', (res) => {
    //     alert(`이겼습니다. 우승자는 ${res.name}입니다.
    //         이동거리: ${res.distance}, 걸린 시간: ${res.endtime}`);
    //     //이겼을 때 화면에 표시되어야 할 것들
    // });

    // //죽음
    // socket.current.on('youdie', (res)=> {
    //     setIsAlive(false);
    //     alert(`죽었습니다. ${res.name}는 ${res.endtime}만큼 생존했습니다.`);
    //     //기타 죽었을 때 화면에 표시되어야 할 것들
    // })

    // //달리는 중
    // useEffect(() => {
    //     if (isAlive) {
    //         socket.current.emit('run', {
    //             roomId: roomId,
    //             shakeCount: shakeCount,});
    //     }
    // }, [shakeCount]);

    return (
        <div>
            <button onClick={requestPermissionSafari}>허가</button>
            <button onClick={()=>setShakeCount((prev)=>prev+1)}>허가</button>
            <p>Shake Count: {shakeCount};</p>
        </div>
    );
}