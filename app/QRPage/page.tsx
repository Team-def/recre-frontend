'use client';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { useAtomValue } from 'jotai';
import { numberOfPeopleAtom } from "@/app/modules/numberOfPeopleAtoms";
import { gameAtoms } from "@/app/modules/gameAtoms";
import { useState, useEffect } from 'react';
import { loginAtom } from "@/app/modules/loginAtoms";
import { useRouter } from "next/navigation";
import { useAtom } from 'jotai';


export default function QR () {
    const nowPeople = 20;
    const maxPeople = useAtomValue(numberOfPeopleAtom);
    const gameName = useAtomValue(gameAtoms);
    const gamePageUrl = 'naver.com';
    const [isLogin,] = useAtom(loginAtom);
    const router = useRouter();
    console.log(maxPeople);
    console.log(gameName);

    useEffect(() => {
        if (!isLogin) {
            console.log(isLogin)
            alert('로그인이 필요합니다.')
            router.push("/")
        }
    }, []);

    const startGame = () => {
        if (gameName === '그림 맞추기') {
            router.push("/catch");
        } else if (gameName === '무궁화 꽃이 피었습니다') {
            router.push("/flower");
        } else if (gameName === '줄넘기') {
            router.push("/jump");
        }

    }

    return (<>
        <div>
            <h1>{gameName}</h1>
            <div className='QR-code'>
                <Image src={`https://chart.apis.google.com/chart?cht=qr&chs=250x250&chl=${gamePageUrl}`} alt="QR" layout='fill' unoptimized={true} />
            </div>
            <div className='online-number'>
            <label>
                <Image className="icon" src="/pngegg.png" alt="people" width={20} height={20} />
            </label>
             <p>{nowPeople} / {maxPeople} 명</p>
            </div>


            <div className='game-start-button'>
                <Button disabled={nowPeople===0} onClick={startGame}>게임 시작</Button>
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