import Button from '@mui/material/Button';
import Image from 'next/image';
import { useAtom } from 'jotai';
import { numberOfPeopleAtom } from "@/app/modules/numberOfPeopleAtoms";
import { gameAtoms } from "@/app/modules/gameAtoms";

export default function QR () {
    return (
        <>
            <h1>여기에 게임 이름</h1>
            <div className='QR-code'>
                <h1>여기에 QR 코드</h1>
            </div>
            <div className='online-number'>
            <label>
                <Image src="/pngegg.png" alt="QR" width={20} height={20} />
            </label>
             현재 접속 인원 / 최대 인원
            </div>
            

            <div className='game-start-button'>
                <Button>QR 코드 스캔 후 게임 시작 버튼</Button>
            </div>

        </>
        
    )
}