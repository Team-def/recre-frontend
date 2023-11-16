'use client';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { useAtomValue } from 'jotai';
import { numberOfPeopleAtom } from "@/app/modules/numberOfPeopleAtoms";
import { gameAtoms } from "@/app/modules/gameAtoms";

export default function QR () {
    //모바일로 user 대기 페이지에 접속해 ready 버튼을 누른 사람들의 수
    const nowPeople = 20;
    const maxPeople = useAtomValue(numberOfPeopleAtom);
    const gameName = useAtomValue(gameAtoms);
    const gamePageUrl = 'naver.com';
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
                <Image className="icon" src="/pngegg.png" alt="people" width={20} height={20} />
            </label>
             <p>{nowPeople} / {maxPeople} 명</p>
            </div>
            

            <div className='game-start'>
                <Button className='game-start-button'>QR 코드 스캔 후 게임 시작 버튼</Button>
            </div>
            <style jsx>{`
            h1 {
                text-align: center;
            }
            .online-number {
                text-align: center;

            }
            .game-start {
                padding: 20px;  
                text-align: center;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            `}</style>
        </>
        
    )
}