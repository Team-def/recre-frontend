import { useEffect, useState } from 'react';

export default function FlowerPlayer() {
    const [shakeCount, setShakeCount] = useState(0);

    useEffect(() => {
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