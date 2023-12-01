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
    const [start, setStart] = useState(false);
    
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
                    setStart(true);
                };
            })

        //android         
        } else {
            window.addEventListener('devicemotion', handleDeviceMotion);
            setStart(true);
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
        <>
        <div className='p-redgreen-div'>
            {!start ? 
            <div className="request-button-div">
                <button className="button-82-pushable" role="button" onClick={requestPermissionSafari}>
                    <span className="button-82-shadow"></span>
                    <span className="button-82-edge"></span>
                    <span className="button-82-front text">
                        시작하기
                    </span>
                </button>
            </div> : <></> }
            
            <div className="redgreen">
                <p>Shake Count: {shakeCount};</p>
            </div>
        </div>
        <style jsx>{`
            .p-redgreen-div{
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                gap: 20px;
            }
            .redgreen{
                margin-top: 20px;
                width: 85%;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
            }

            /* button CSS */
            .button-82-pushable {
                position: relative;
                border: none;
                background: transparent;
                padding: 0;
                cursor: pointer;
                outline-offset: 4px;
                transition: filter 250ms;
                user-select: none;
                -webkit-user-select: none;
                touch-action: manipulation;
            }

            .button-82-shadow {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 12px;
                background: hsl(0deg 0% 0% / 0.25);
                will-change: transform;
                transform: translateY(2px);
                transition:
                    transform
                    600ms
                    cubic-bezier(.3, .7, .4, 1);
            }

            .button-82-edge {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border-radius: 12px;
                background: linear-gradient(
                    to left,
                    hsl(340deg 100% 16%) 0%,
                    hsl(340deg 100% 32%) 8%,
                    hsl(340deg 100% 32%) 92%,
                    hsl(340deg 100% 16%) 100%
                );
            }

            .button-82-front {
                display: block;
                position: relative;
                padding: 12px 27px;
                border-radius: 12px;
                font-size: 1.1rem;
                color: white;
                background: hsl(345deg 100% 47%);
                will-change: transform;
                transform: translateY(-4px);
                transition:
                    transform
                    600ms
                    cubic-bezier(.3, .7, .4, 1);
            }

            @media (min-width: 768px) {
                .button-82-front {
                    font-size: 1.25rem;
                    padding: 12px 42px;
                }
            }

            .button-82-pushable:hover {
                filter: brightness(110%);
                -webkit-filter: brightness(110%);
            }

            .button-82-pushable:hover .button-82-front {
                transform: translateY(-6px);
                transition:
                    transform
                    250ms
                    cubic-bezier(.3, .7, .4, 1.5);
            }

            .button-82-pushable:active .button-82-front {
                transform: translateY(-2px);
                transition: transform 34ms;
            }

            .button-82-pushable:hover .button-82-shadow {
                transform: translateY(4px);
                transition:
                    transform
                    250ms
                    cubic-bezier(.3, .7, .4, 1.5);
            }

            .button-82-pushable:active .button-82-shadow {
                transform: translateY(1px);
                transition: transform 34ms;
            }

            .button-82-pushable:focus:not(:focus-visible) {
                outline: none;
            }
        `}</style>
        </>
    );
}