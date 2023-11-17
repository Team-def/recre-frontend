'use client';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { gameAtoms } from "@/app/modules/gameAtoms";
import { useEffect } from 'react';
import { loginAtom } from "@/app/modules/loginAtoms";
import { useRouter } from "next/navigation";
import { useAtom } from 'jotai';


export default function QR () {
    const nowPeople = 0;
    const [gameInfo,] = useAtom(gameAtoms);
    const gamePageUrl = 'naver.com';
    const [isLogin,] = useAtom(loginAtom);
    const router = useRouter();
    console.log(gameInfo);

    useEffect(() => {
        if (!isLogin) {
            console.log(isLogin)
            alert('로그인이 필요합니다.')
            router.push("/")
        }
    }, []);

    const startGame = () => {
        if (gameInfo[0] === '그림 맞추기') {
            router.push("/catch");
        } else if (gameInfo[0] === '무궁화 꽃이 피었습니다') {
            router.push("/flower");
        } else if (gameInfo[0] === '줄넘기') {
            router.push("/jump");
        }

    }

    return (<>
        <div className='qrPageCon'>
            <h1>{gameInfo[0]}</h1>
            <div className='QR-code'>
                <Image src={`https://chart.apis.google.com/chart?cht=qr&chs=250x250&chl=${gamePageUrl}`} alt="QR" layout='fill' unoptimized={true} />
            </div>
            <div className='online-number'>
            <label>
                <Image className="icon" src="/pngegg.png" alt="people" width={20} height={20} />
            </label>
             <p>{nowPeople} / {gameInfo[1]} 명</p>
            </div>


            <div className='gameInfo-start-button'>
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