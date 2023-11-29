"use client";
import { useState } from 'react';

export default function FlowerPlayer() {
    const [shakeCount, setShakeCount] = useState(0);
    
    const handleShake = () => {
        setShakeCount((prevCount) => prevCount + 1);
    }

    //device의 움직임을 읽어오는 함수
    const handleDeviceMotion = (event: DeviceMotionEvent) => {
        const { acceleration } = event;

        if (acceleration) {
            const { x, y, z } = acceleration;
            const accelerationMagnitude = Math.sqrt( (x??0) ** 2 + (y??0) ** 2 + (z??0) ** 2);
            const shakeThreshold = 15;
            if (accelerationMagnitude > shakeThreshold) {
                handleShake();
            }
        }
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