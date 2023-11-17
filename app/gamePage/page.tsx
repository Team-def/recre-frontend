'use client';
import Button from '@mui/material/Button';
import Image from 'next/image';
import { gameAtoms } from "@/app/modules/gameAtoms";
import { useEffect, useState } from 'react';
import { loginAtom } from "@/app/modules/loginAtoms";
import { useRouter } from "next/navigation";
import { useAtom } from 'jotai';
import MyModal from '@/component/MyModal';
import Catch from '../catch/page';


export default function QR () {
    const [nowPeople,setNowPeople] = useState(2);
    const [gameInfo,] = useAtom(gameAtoms);
    //https://treepark.shop/player?hostId=1234 같은 형식이어야 함
    const gamePageUrl = 'naver.com';
    const [isLogin,] = useAtom(loginAtom);
    const router = useRouter();
    const [open, setOpen] = useState(true);
    const [gameContent, setGameContent] = useState<JSX.Element>();

    useEffect(() => {
        if (!isLogin) {
            console.log(isLogin)
            alert('로그인이 필요합니다.')
            router.push("/")
        }
    }, []);

    const startGame = () => {
        if (gameInfo[0] === '그림 맞추기') {
            setGameContent(<Catch/>)
            setOpen(false);
        } else if (gameInfo[0] === '무궁화 꽃이 피었습니다') {
            setGameContent(<Catch/>)
            setOpen(false);
        } else if (gameInfo[0] === '줄넘기') {
            setGameContent(<Catch/>)
            setOpen(false);
        }

    }

    const QRpage = () => {
        return (
            <>
        <div className='qrPageCon'>
            <h2>{gameInfo[0]}</h2>
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
                height: 70vh;
                display: flex;
                justify-content: space-evenly;
                align-items: center;
                flex-direction: column;
            }
            .QR-code{
                width: 20vw;
                height: 20vw;
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

    return (<>
        <MyModal open={open} modalHeader={"QR코드를 찍고 입장해주세요!"} modalContent={<QRpage/>} closeFunc={()=>{}}/>
        {gameContent}
    </>)
}