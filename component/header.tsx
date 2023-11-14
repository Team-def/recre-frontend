"use client";
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import OauthButtons from "./OauthButtons";
import Profile from "../app/profile/profile";
import MyModal from "./MyModal";
import Login from "@/app/login/login";
import SignUp from "@/app/signup/signup";

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
    const [modalHeader, setModalHeader] = useState('');
    const [modalContent, setModalContent] = useState<JSX.Element>();
    const [isLogin, setIsLogin] = useState<boolean>(false);

    useEffect(() => {
        if (modalHeader === '로그인 / 회원가입') {
            setModalContent(<OauthButtons />);
        } else if (modalHeader === '프로필') {
            setModalContent(<Profile />);
        }
    },[modalHeader])

    const handleOpenLogin = () => {
        setModalHeader('로그인 / 회원가입');
        setOpen(true);
    }

    const handleOpenProfile = () => {
        setModalHeader('프로필');
        setOpen(true);
    }
    const handleClose = () => { setOpen(false); }

    return (<><div className="headerContainer">
        <div className="logo">
            <h1>RecRe</h1>
        </div>
        <div className="userInfoBtn">
            {/* 로그인시에만 보이는 문구 */}
            {isLogin?<div className="login" onClick={handleOpenProfile}>username님! 안녕하세요!</div>:null}
            {/* 로그인 버튼 */}
            <div className='no-login'>
                <Button onClick={handleOpenLogin}>{isLogin?"로그아웃":"로그인 / 회원가입"}</Button>
            </div>
        </div>
    </div>
        <MyModal open={open} modalHeader={modalHeader} modalContent={modalContent} closeFunc={handleClose} />
        <style jsx>{`
            .headerContainer{
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 0 20px;
                height: 60px;
                background-color: #f2f2f2;
            }
            .userInfoBtn{
                display: flex;
                align-items: center;
                flex-direction: row;
            }
        `}</style>
    </>
    )
}