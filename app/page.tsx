"use client";
import * as React from 'react';
import Image from 'next/image'
import Button from '@mui/material/Button';

export default function Home() {
  return (
    <div>
      <Image
        src="/vercel.svg"
        alt="Picture of the author"
        width={500}
        height={500}
      />
      {/* login시에만 보이는 버튼 */}
      <div className="login">
        <Button className='start-button'>RecRe 시작!</Button>
      </div>
    </div>
  )
}
