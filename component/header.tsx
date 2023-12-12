"use client";
import { ReactNode, SetStateAction, useEffect, useState } from "react";
import Button from '@mui/material/Button';
import OauthButtons from "./OauthButtons";
import Profile from "../app/profile/profile";
import MyModal from "./MyModal";
import { useAtom } from 'jotai';
import { loginAtom } from "@/app/modules/loginAtoms";
import { tokenAtoms } from "@/app/modules/tokenAtoms";
import { useRouter } from "next/navigation";
import { userInfoAtoms } from "@/app/modules/userInfoAtom";
import Image from 'next/image';
import { useCookies } from 'next-client-cookies';
import { gameAtoms } from "@/app/modules/gameAtoms";
import { usePathname } from 'next/navigation';
import {isMobile} from 'react-device-detect';

export interface ModalProps {
    isOpen: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    modalHeader: string,
    setModalHeader: React.Dispatch<React.SetStateAction<string>>,
    isLogin: boolean,
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function Header() {
    const [open, setOpen] = useState<ModalProps['isOpen']>(false);
    const [modalHeader, setModalHeader] = useState<string | ReactNode>('');
    const [modalContent, setModalContent] = useState<JSX.Element>();
    const [isLogin, setIsLogin] = useAtom(loginAtom)
    const [, setToken] = useAtom(tokenAtoms)
    const [userInfo, setUserInfo] = useAtom(userInfoAtoms)
    const [, setGame] = useAtom(gameAtoms)
    const router = useRouter();
    const cookies = useCookies();
    const currentPath = usePathname()
    const notNow = ['/gameSelect','/player', '/gamePage']
    const hideHeader = notNow.includes(currentPath) ? true : false
    const isAnswer = currentPath === '/catchAnswer' ? true : false

    useEffect(() => {
        if (isLogin) {
            setModalHeader('로그인 / 회원가입');
            setOpen(false);
        }
    }, [isLogin]);

    useEffect(() => {
        if (modalHeader === '로그인 / 회원가입') {
            setModalContent(<OauthButtons/>);
        } else{
            setModalContent(<Profile setOpen={function (value: SetStateAction<boolean>): void {
                throw new Error("Function not implemented.");
            } }/>);
        }
    }, [modalHeader])

    const handleOpenLogin = () => {
        setModalHeader('로그인 / 회원가입');
        setOpen(true);
    }

    const handleOpenProfile = () => {
        setModalHeader(<div className="headerTitle"><div className="profileName"><Image src={userInfo.profileImage} width={30} height={30} alt="profileImage" unoptimized={true} /></div><h3>{userInfo.nickname}님의 프로필</h3></div>);
        setOpen(true);
    }

    const handleLogout = () => {
        setToken('');
        setUserInfo({
            id: '',
            nickname: '',
            email: '',
            profileImage: '',
            provider: '',
        });
        cookies.remove('refresh_token')
        setIsLogin(false);
        setGame(["", null])
        localStorage.removeItem('isHostPhone')
        alert("로그아웃 되었습니다.");
        if(isMobile){
            window.open("about:blank", "_self");
            window.close();
        }
        router.push("/");
    }

    const handleClose = () => { setOpen(false); }

    const setAtomLogin = () => {
        setIsLogin(true);
    }

    return (<>{hideHeader ? '' : <>
    <div className="headerContainer">
        {isAnswer ? null : <div className="logo">
            <div onClick={() => router.push("/")}>
                <Image src={"/black.png"} alt={'recre'} width={120} height={35}></Image>
            </div>
        </div>}
        <div className="userInfoBtn">
            {/* 로그인시에만 보이는 문구 */}
            {isLogin ?
                <div className="login" onClick={handleOpenProfile}>
                    <div className="profileName"><Image src={userInfo.profileImage} width={30} height={30} alt="profileImage" unoptimized={true} /></div>
                    <div>{userInfo.nickname}님
                    </div>
                </div>
                : <div></div>}
            {/* 로그인 버튼 */}
            <div className='no-login'>
                <Button onClick={isLogin ? handleLogout : handleOpenLogin} style={{fontFamily: 'myfont'}}>{isLogin ? "로그아웃" : "로그인 / 회원가입"}</Button>
            </div>
        </div>
    </div>
        <MyModal open={open} modalHeader={modalHeader} modalContent={modalContent} closeFunc={handleClose} myref={null}/></>}
        <style jsx global>{`
            .logo{
                cursor: pointer;
            }
            .headerContainer{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 20px;
                height: 60px;
                background-color: #f2f2f2;
                color: black;
            }
            .userInfoBtn{
                display: flex;
                ${isAnswer? 'width: 100%;':''}
                align-items: center;
                flex-direction: row;
                ${isAnswer ? 'justify-content: space-between;' : ''}
            }
            .login{
                display: flex;
                justify-content: center;
                align-items: center;
                gap: 2px;
                margin-right: 10px;
                pointer:cusor;
            }
            .profileName{
                margin-right: 4px;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                overflow: hidden;
            }
            .login:hover{
                scale: 1.1;
            }
        `}</style>
    </>
    )
}