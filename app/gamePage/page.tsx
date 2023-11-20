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
import { socket } from '../modules/socket';
import { tokenAtoms } from '@/app/modules/tokenAtoms';
import { answerAtom } from '../modules/answerAtom';
import { userInfoAtoms } from '../modules/userInfoAtom';

export default function QR() {
    const [nowPeople, setNowPeople] = useState(2);
    const [gameInfo,] = useAtom(gameAtoms);
    const [userInfo,] = useAtom(userInfoAtoms);
    const gamePageUrl = `http://localhost:3000/catchAnswer?id=${userInfo}`;
    const [isLogin,] = useAtom(loginAtom);
    const router = useRouter();
    const [open, setOpen] = useState(true);
    const [gameContent, setGameContent] = useState<JSX.Element>();
    const [uuid, setUuid] = useState<string>('');
    const [token,] = useAtom(tokenAtoms);
    const [answer,] = useAtom(answerAtom);

    useEffect(() => {
        if (!isLogin) {
            console.log(isLogin)
            alert('로그인이 필요합니다.')
            router.push("/")
        }

        socket.volatile.on("connect", () => {
            console.log("disconnect_check:", socket.connected);
        });


        socket.volatile.on("disconnect", () => {
            console.log("disconnect_check:", socket.connected);
        });

        if (gameInfo[0] === '그림 맞추기') {
            setGameContent(<Catch />)
        } else if (gameInfo[0] === '무궁화 꽃이 피었습니다') {
            setGameContent(<Catch />)
        } else if (gameInfo[0] === '줄넘기') {
            setGameContent(<Catch />)
        }

        socket.on("start_catch_game", (response) => {
            if (response.result === "true")
                setOpen(false);
            else
                alert(response.message)
        });

        socket.on("make_room", (response) => {
            if (response.result === "true")
                startGame()
        });
    }, []);


    const makeRoom = () => {
        if (!answer) {
            alert('먼저 정답을 입력해주세요.')
            return
        }
        socket.emit('make_room', {
            game_type: gameInfo[0],
            user_num: gameInfo[1],
            answer: answer,
            access_token: token
        })
    }

    const startGame = () => {
        socket.emit('start_catch_game', {
            access_token: token
        });
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
                        <Button disabled={nowPeople === 0} onClick={makeRoom}>게임 시작</Button>
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
        <MyModal open={open} modalHeader={"QR코드를 찍고 입장해주세요!"} modalContent={<QRpage />} closeFunc={() => { }} />
        {gameContent}
    </>)
}