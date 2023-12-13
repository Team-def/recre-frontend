"use client"
import Button from '@mui/material/Button';
import io from 'socket.io-client';
import { useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { userInfoAtoms } from "@/app/modules/userInfoAtom";
import { tokenAtoms } from '../modules/tokenAtoms';
import { answerAtom } from '../modules/answerAtom';
import OauthButtons from '@/component/OauthButtons';
import { loginAtom } from '../modules/loginAtoms';
import {v4 as uuidv4} from 'uuid';
import { socketApi } from '../modules/socketApi';
import { Alert, TextField, styled } from '@mui/material';
import useVH from 'react-viewport-height';
import {isMobile} from 'react-device-detect';
import MyModal from '@/component/MyModal';
import Image from 'next/image';

const BootstrapButton = styled(Button)(({colorStyle}:{colorStyle:string})=>({
    boxShadow: '0 0 10px rgba(0,0,0,0.3)',
    textTransform: 'none',
    fontWeight: 'bold',
    backgroundColor: colorStyle,
    fontFamily:'myfont',
    color: 'rgb(48,67,143)',
    '&:hover': {
        backgroundColor: colorStyle,
        boxShadow: '0 0 12px rgba(0,0,0,0.7)',
    },
    '&:active': {
        boxShadow: 'none',
        backgroundColor: colorStyle,
        borderColor: '#005cbf',
    },
    '&:focus': {
        boxShadow: '0 0 12px rgba(0,0,0,0.7)',
    },
}));

const TextInfoCustom = styled(TextField)(({colorStyle}:{colorStyle:string})=>({
    width: 200,
    textAlign: 'center',
    fontFamily: 'myfont',
    "& .MuiOutlinedInput-input": {
        color: colorStyle,
        textAlign: 'center',
        fontFamily: 'myfont',
    },

    "&:hover .MuiOutlinedInput-input": {
        color: colorStyle,
        fontFamily: 'myfont',
    },
    "&:hover .MuiInputLabel-root": {
        color: colorStyle,
        fontFamily: 'myfont',
    },
    "&:hover .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline": {
        borderColor: colorStyle
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-input": {
        color: colorStyle,
        fontFamily: 'myfont',
    },
    "& .MuiInputLabel-root.Mui-focused": {
        color: colorStyle,
        fontFamily: 'myfont',
    },
    "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderColor: colorStyle
    },
    "& .MuiInputLabel-root": {
        color: colorStyle,
        fontFamily: 'myfont',
    },
    "& .MuiOutlinedInput-notchedOutline": {
        borderColor: colorStyle,
        borderWidth: 2,
        fontFamily: 'myfont',
    },

    "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: colorStyle,
    },
}));

//Answer setting page (for host)
export default function CatchAnswer() {
    const [userInfo,] = useAtom(userInfoAtoms);
    const [catchAnswer, setCatchAnswer] = useState<string>('');
    const [token,] = useAtom(tokenAtoms);
    const [,setAnswer] = useAtom(answerAtom);
    const [isLogin,] = useAtom(loginAtom);
    const [uuId,] = useState<string>(uuidv4());
    const vh = useVH();
    const [open, setOpen] = useState<boolean>(!(JSON.parse(localStorage.getItem('login') || 'null')));
    const [colorStyle, setColorStyle] = useState<string>('orange');

    const socket = useRef(io(`${socketApi}/catch?uuId=${uuId}`,{
        withCredentials: true,
        transports: ["websocket"],
        autoConnect: false,
    }));

    useEffect(()=>{
        if(!isMobile){
            alert('모바일 환경에서만 정답 입력이 가능합니다.')
            window.open("about:blank", "_self");
            window.close();
        }
        

        socket.current.on("set_catch_answer", (res)=>{

            if (res.type === 'answer_success') {

                socket.current.disconnect()
                alert('정답이 설정되었습니다.')
                window.open("about:blank", "_self");
                window.close();

            } else if(res.type === 'already_started'){
                alert('이미 게임이 시작되었습니다.')
            }
            else {
                alert('아직 방이 안 만들어졌습니다.')
            }
        });
    },[])


    const handleAnswerSubmit = () => {
        if (catchAnswer === '') {
            alert('정답을 입력해주세요!')
            return;
        }
        if(catchAnswer.length > 10){
            alert('10글자 이하로 작성해주세요!')
            setCatchAnswer('')
            return;
        }
        socket.current.connect();
        setAnswer(catchAnswer)
        socket.current.emit("set_catch_answer", { room_id : (JSON.parse(localStorage.getItem('userInfo') || 'null')).id , ans : catchAnswer , access_token : (localStorage.getItem("access_token")||'null') });
    }

    return (
        <>
            <div className="nickname-container">
                    <div className="p_headerContainer">
                        <div className="logo">
                        <Image src={"/yellow_!.png"} alt={'recre'} width={220} height={60}></Image>
                            <span className='teamdef'>정답 입력 화면</span>
                        </div>
                    </div>
                    <div className='alertDiv'><Alert severity="info" style={{fontFamily:'myfont', backgroundColor:'orange'}}>문제의 정답을 입력해주시고 아래 '정답 제출' 버튼을 눌러주세요!</Alert></div>
                    <div className='nickDiv'>
                <TextInfoCustom
                            className="catchAnswer-input nickname-input"
                            id="outlined-number1"
                            label={isLogin?'문제의 정답을 입력해주세요!':'로그인이 필요합니다.'}
                            type="text"
                            value={catchAnswer}
                            onChange={(e) => setCatchAnswer(e.target.value)}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            color='primary'
                            colorStyle={colorStyle}
                        />
                        <BootstrapButton className="nickname-change" onClick={handleAnswerSubmit} disabled={!isLogin} colorStyle={colorStyle}>제출</BootstrapButton></div>
                </div>
                <MyModal open={open} modalHeader={'먼저 로그인을 해주세요'} modalContent={<OauthButtons/>} closeFunc={()=>{}} myref={null}/>
            <style jsx>{`
                .nickname-container {
                    height: ${100 * vh - 60}px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: space-evenly;
                    background-color: rgb(48,67,143);
                }

                .nickname-label {
                    font-size: 20px;
                    font-weight: bold;
                    margin-bottom: 10px;
                    color:orange
                }

                .nickname-input {
                    width: 200px;
                    height: 30px;
                    padding: 5px;
                    border: 1px solid #CCCCCC;
                    border-radius: 5px;
                    margin-bottom: 10px;
                    text-align: center;
                    font-size: 16px;
                }
                .p_headerContainer{
                    background-color: rgb(48,67,143)
                }
                .nickname-change {
                    width: 120px;
                    height: 40px;
                    background-color: #FF6B6B;
                    color: #FFFFFF;
                    font-size: 16px;
                    font-weight: bold;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s ease;
                }
                .logo{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    font-size: 32px;
                    bakcground-color: rgb(48,67,143);
                }
                .nickDiv{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                }
                .alertDiv{
                    width: 70%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    text-align: center;
                }
                .logo{
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    background-color: transparent;
                }
                .teamdef{
                    font-size: 22px;
                    font-weight: 500;
                    color: orange;
                    background-color:rgb(48,67,143);
                    margin-top:20px;
                }
            `}</style>
            <style jsx global>{`
                body {
                    overflow: hidden !important;
                }
            `}</style>
        </>
    )
}