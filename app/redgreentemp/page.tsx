"use client";
import { useEffect, useState, useRef } from 'react';
import { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { socketApi } from '../modules/socketApi';

export default function RedGreenPlayer({ roomId,  }: { roomId: string, socket: Socket }) {
    const [shakeCount, setShakeCount] = useState(0);
    const [isAlive, setIsAlive] = useState(true); //생존 여부를 관리하는 상태
    const [start, setStart] = useState(false);
    //test를 위한 임시 socket 설정
    const socket = useRef(io(`${socketApi}?uuId=123`, {
        withCredentials: true,
        transports: ["websocket"],
        autoConnect: false,
    }));


        //safari 13 이상의 safari 브라우저에서는 모션 이벤트 권한을 요청해야 함
    const isSafariOver13 = typeof window.DeviceOrientationEvent.requestPermission === 'function';

    const requestPermissionSafari = () => {
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

        // Check if the DeviceMotion API is supported
    window.addEventListener('devicemotion', handleDeviceMotion);

    function handleMotion(event) {
        // The acceleration data is available in the x, y, and z properties of the event
        const acceleration = event.acceleration;

        // Calculate the magnitude of acceleration
        const accelerationMagnitude = Math.sqrt(acceleration.x ** 2 + acceleration.y ** 2 + acceleration.z ** 2);

        // Smooth the acceleration data using a simple low-pass filter
        const smoothedAcceleration = 0.2 * accelerationMagnitude + 0.8 * lastAcceleration;

        // Update the lastAcceleration for the next iteration
        lastAcceleration = smoothedAcceleration;

        // Add the smoothed acceleration to the data array
        accelerationData.push(smoothedAcceleration);

        // Keep only the last N samples to avoid memory overflow
        const maxDataLength = 10;
        if (accelerationData.length > maxDataLength) {
            accelerationData = accelerationData.slice(1);
        }

            // Detect peaks in the acceleration data
            const peakIndex = detectPeak(accelerationData);

            // If a peak is detected, increment the step count
            if (peakIndex !== -1) {
                stepCount++;
                updateStepCount();
            }
        }

        function updateStepCount() {
            document.getElementById('stepCount').innerText = stepCount;
        }

        // Simple peak detection algorithm
        function detectPeak(data) {
            const threshold = 1.5; // Adjust this threshold based on testing

            for (let i = 1; i < data.length - 1; i++) {
                if (data[i] > data[i - 1] && data[i] > data[i + 1] && data[i] > threshold) {
                    return i;
                }
            }

            return -1;
        }



    socket.current.on('touchdown', (res) => {
        alert(`이겼습니다. 우승자는 ${res.name}입니다.
            이동거리: ${res.distance}, 걸린 시간: ${res.endtime}`);
        //이겼을 때 화면에 표시되어야 할 것들
    });

    socket.current.on('youdie', (res)=> {
        setIsAlive(false);
        alert(`죽었습니다. ${res.name}는 ${res.endtime}만큼 생존했습니다.`);
        //기타 죽었을 때 화면에 표시되어야 할 것들
    })

    return (
        <div>
            <button onClick={requestPermissionSafari}>허가</button>
            <p>Shake Count: {shakeCount};</p>
            {/* <p>y: {yCount}</p> */}
            {/* <p>y: {maxY}</p>
            <p>y: {minY}</p> */}

        </div>

    );
}