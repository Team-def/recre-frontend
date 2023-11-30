"use client";
import { useState } from 'react';

let accelerationData: number[] = [];
let lastAcceleration = 0;

export default function RedGreenPlayer() {
    const [shakeCount, setShakeCount] = useState(0);
    
    //shake 이벤트가 발생하면 shakeCount를 1 증가시키는 함수
    const handleShake = () => {
        setShakeCount((prevCount) => prevCount + 1);
    }

    //device의 움직임을 읽어오는 함수
    const handleDeviceMotion = (event: DeviceMotionEvent) => {
        const acceleration= event.acceleration;

        if (acceleration) {
            const accelerationMagnitude = Math.sqrt( (acceleration.x??0) ** 2 + (acceleration.y??0) ** 2 + (acceleration.z??0) ** 2);
            const smoothedAcceleration = 0.2 * accelerationMagnitude + 0.8 * lastAcceleration;
            lastAcceleration = smoothedAcceleration;
            accelerationData.push(smoothedAcceleration);

            const maxDataLength = 10;
            if (accelerationData.length > maxDataLength) {
                accelerationData = accelerationData.slice(1);
            }

            const peakIndex = detectPeak(accelerationData);

            if (peakIndex !== -1) {
                handleShake();
            }
        //     const shakeThreshold = 15;
        //     if (accelerationMagnitude > shakeThreshold) {
        //         handleShake();
        //     }
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
        if (isSafariOver13) {
            window.DeviceOrientationEvent.requestPermission().then((permissionState) => {
                if (permissionState === 'denied') {
                    //safari 브라우저를 종료하고 다시 접속하도록 안내하는 화면 필요
                  console.log('Permission wasn\'t granted. Allow a retry.');
                  return;
                } else if (permissionState === 'granted') {
                    window.addEventListener('devicemotion', handleDeviceMotion);
                };
            })
                   
        } else {
            window.addEventListener('devicemotion', handleDeviceMotion);
            };
        }

    return (
        <div>
            <button onClick={requestPermissionSafari}>허가</button>
            <p>Shake Count: {shakeCount};</p>
        </div>
    );
}