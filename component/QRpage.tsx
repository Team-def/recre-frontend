import { Alert, AlertTitle, Button } from "@mui/material"
import MyPopover from "./MyPopover"
import Image from "next/image"
import { anchorElAtom } from "@/app/modules/popoverAtom";
import { useAtom } from "jotai";
import { useMemo } from "react";
import React from "react";

const QRpage = ({gamePageUrlAns, gamePageUrl, nowPeople, total, startGame}:{gamePageUrlAns :  React.MutableRefObject<string>, gamePageUrl : string, nowPeople : number, total : number, startGame: ()=> void}) => {
    const [, setAnchorEl] = useAtom(anchorElAtom);
    const handlePopover = useMemo(() => {
        return setAnchorEl;
    },[]);
    return (
        <>
            <div className='qrPageCon'>
                <h2>{JSON.parse(localStorage.getItem('game') || 'null')[0]}</h2>
                {/* 게임 종류가 catch mind인 경우 */}
                {JSON.parse(localStorage.getItem('game') || 'null')[0] === '그림 맞추기' ?
                    <div className='alertSt'><Alert severity="info" onClick={()=>handlePopover(document.body)}>
                    <AlertTitle>정답을 입력해주세요</AlertTitle>
                    호스트는 이 창을 클릭하여 QR을 찍고 문제의 정답을 입력해 주세요. <strong>로그인 된 호스트만</strong> 정답을 입력할 수 있습니다.
                </Alert><MyPopover url={gamePageUrlAns.current}/></div> : <></>}
                <div className='QR-code'>
                    <Image src={`https://chart.apis.google.com/chart?cht=qr&chs=250x250&chl=${gamePageUrl}`} alt="QR" layout='fill' unoptimized={true} />
                </div>
                <div className='online-number'>
                    <label className="icon">
                        <Image src="/pngegg.png" alt="people" width={20} height={20} />
                    </label>
                    <h3>{nowPeople} / {total} 명</h3>
                </div>


                <div className='gameInfo-start-button'>
                    <Button disabled={nowPeople === 0} onClick={startGame}>게임 시작</Button>
                    {/* <Button onClick={testGame}>TestPlay</Button> */}
                    {/* <Button onClick={()=>makeEmotion('❤️')}>TestHeart</Button> */}
                </div>
            </div>
            <style jsx>{`
    .qrPageCon{
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        flex-direction: column;
    }
    .QR-code{
        width: 20vw;
        max-width: 350px;
        max-height: 350px;
        height: 20vw;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        margin-bottom: 10px;
    }
    .alertSt{
        cursor: pointer;
        border: 1px solid transparent;
        margin-bottom: 15px;
    }
    .alertSt:hover{
        border: 1px solid blue;
    }
    .headers{
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    .online-number{
        display: flex;
        align-items: center;
        justify-content: space-evenly;
        gap: 10px;
    }
    .QR-code-ans{
        width: 10vw;
        height: 10vw;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
    }
    .icon{
        position: relative; 
        top: 3px;
    }
`}</style>
        </>
    )
}

export default React.memo(QRpage);