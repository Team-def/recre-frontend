"use client";
import Button from '@mui/material/Button';
import Image from 'next/image';
import { useAtom, useAtomValue } from 'jotai';
import { numberOfPeopleAtom } from "@/app/modules/numberOfPeopleAtoms";
import { gameAtoms } from "@/app/modules/gameAtoms";
import { useState, useEffect } from 'react';
import { loginAtom } from "@/app/modules/loginAtoms";
import { useRouter } from "next/navigation";

export default function QR() {
    const [numberOfPeople, setNumberOfPeople] = useAtom(numberOfPeopleAtom);
    const [currNumOfPeople, setCurrNumOfPeople] = useState<number>(0);
    const [isLogin,] = useAtom(loginAtom);
    const router = useRouter();

    useEffect(() => {
        if (!isLogin) {
            console.log(isLogin)
            alert('로그인이 필요합니다.')
            router.push("/")
        }
    }, []);

    const startGame = () => {

    }

    return (
        <><div className='qrPageCon'>
            <div className='headers'>
                <h1>여기에 게임 이름</h1>
                <h3>카메라로 QR코드를 찍어 게임에 참여해주세요!</h3>
            </div>
            <div className='QR-code'>
                <Image src={`https://chart.apis.google.com/chart?cht=qr&chs=250x250&chl=https://taeme.tistory.com/"`} alt="QR" layout='fill' unoptimized={true} />
            </div>
            <div className='online-number'>
                <label>
                    <Image src="/pngegg.png" alt="QR" width={20} height={20} />
                </label>
                {currNumOfPeople} / {numberOfPeople}
            </div>


            <div className='game-start-button'>
                <Button disabled={currNumOfPeople===0} onClick={startGame}>게임 시작</Button>
            </div>
        </div>
            <style jsx>{`
            .qrPageCon{
                height: 100vh;
                display: flex;
                justify-content: space-evenly;
                align-items: center;
                flex-direction: column;
            }
            .QR-code{
                width: 27vw;
                height: 27vw;
                margin: 0 auto;
                display: flex;
                justify-content: center;
                align-items: center;
                position: relative;
            }
            .headers{
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
            }
            .online-number{
                width: 250px;
                display: flex;
                align-items: center;
                justify-content: space-evenly;
            }
        `}</style>
        </>

    )
}