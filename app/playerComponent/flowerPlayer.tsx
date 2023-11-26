"use client";
import { useEffect, useState } from 'react';

export default function FlowerPlayer() {
    //iphone 13 이상의 사파리 브라우저에서는 모션 이벤트 권한을 요청해야 함
    const requestPermission = (eventType: 'devicemotion' | 'deviceorientation') => {
        if (window.DeviceOrientationEvent !== undefined && typeof (window.DeviceOrientationEvent as any).requestPermission === 'function') {
          (window.DeviceOrientationEvent as any).requestPermission()
            .then(() => {
              // Permission granted, you might want to do something here
              window.addEventListener(eventType, () => {});
            })
            .catch((error: any) => {
              console.error(`Error requesting permission: ${error}`);
            });
        } else {
          // Permission not needed or not supported
          window.addEventListener(eventType, () => {});
        }
    };
    
    const [shakeCount, setShakeCount] = useState(0);

    useEffect(() => {
        requestPermission('devicemotion');
        requestPermission('deviceorientation');

        let x:number = 0;
        let y:number = 0;
        let z:number = 0;
        let lastUpdate = 0;
        
        const shakeListener = (event: DeviceMotionEvent) => {
            const { acceleration } = event;
            
            if (acceleration) {
                const curTime = new Date().getTime() / 1000;
                if ((curTime - lastUpdate) > 1) {
                    const diffTime = curTime - lastUpdate;
                    lastUpdate = curTime;
                    
                    x = acceleration.x || 0;
                    y = acceleration.y || 0;
                    z = acceleration.z || 0;
            
                    const speed = Math.abs(x + y + z - 3 * 9.81) / diffTime;
                    if (speed > 30) {
                        setShakeCount((prevShakeCount) => prevShakeCount + 1);
                    }
                }
            }
        };
        
        window.addEventListener('devicemotion', shakeListener);
        
        return () => {
            window.removeEventListener('devicemotion', shakeListener);
        };
    }, [shakeCount]);
        
    return (
        <div>
            <p>Shake Count: {shakeCount};</p>
        </div>
    );
}