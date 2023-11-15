'use client';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { useAtomValue } from 'jotai';
import { numberOfPeopleAtom } from "@/app/modules/numberOfPeopleAtoms";
import { gameAtoms } from "@/app/modules/gameAtoms";

export default function QR () {
    const nowPeople = "?";
    const maxPeople = useAtomValue(numberOfPeopleAtom);
    const gameName = useAtomValue(gameAtoms);
    console.log(maxPeople);
    console.log(gameName);
    return (
        <>
            <h1>{gameName}</h1>
            <div className='QR-code'>
                <h1>여기에 QR 코드</h1>
            </div>
            <div className='online-number'>
            <label>
                <Image src="/pngegg.png" alt="QR" width={20} height={20} />
            </label>
             {nowPeople} / {maxPeople} 명
            </div>
            

            <div className='game-start-button'>
                <Button>QR 코드 스캔 후 게임 시작 버튼</Button>
            </div>

        </>
        
    )
}