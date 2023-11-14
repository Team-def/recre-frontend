"use client";
import * as React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';

export default function Home() {
  const router = useRouter();
  return (<>
    <div className='container'>
      <div>
        <p className='middleLogo'>RecRe</p>
      </div>
      {/* login시에만 보이는 버튼 */}
      <div className="login">
        <Button className='start-button' onClick={() => router.push('/gameselect')}>RecRe 시작!</Button>
      </div>
    </div>
    <style jsx>{`
            .container{
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                height: 100vh;
            }
            .middleLogo{
              font-size: 10vw;
              background: #f1f1f1;
              padding: 50px;
              box-shadow: 0 0 10px rgba(0,0,0,0.5);
            }
            .middleLogo:hover{
              scale: 1.1;
              rotate: 10deg;
              cursor: pointer;
              color: gray;
            }
        `}</style>
    </>
  )
}
