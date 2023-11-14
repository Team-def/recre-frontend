"use client";
import { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import OauthButtons from "./OauthButtons";
import MyModal from "./MyModal";
import { useAtom } from 'jotai';
import { loginAtom } from "@/app/modules/loginAtoms";
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
    const [isLogin,setIsLogin] = useAtom(loginAtom)

    useEffect(() => {
        if (isLogin) {
            setModalHeader('로그인 / 회원가입');
            setOpen(false);
        }
    },[isLogin]);

    const handleOpenLogin = () => {
        setModalHeader('로그인 / 회원가입');
        setOpen(true);
    }

    const handleLogout = () => {
        setIsLogin(false);
    }

    const handleClose = () => { setOpen(false); }

    const setAtomLogin = () => {
        setIsLogin(true);
    }

    return (<><div className="headerContainer">
        <div className="logo">
            <h1>RecRe</h1>
        </div>
        <div className="userInfoBtn">
            {/* 로그인시에만 보이는 문구 */}
            {isLogin?<div className="login">username님! 안녕하세요!</div>:null}
            {/* 로그인 버튼 */}
            <div className='no-login'>
                <Button onClick={isLogin ? handleLogout : handleOpenLogin}>{isLogin?"로그아웃":"로그인 / 회원가입"}</Button>
            </div>
        </div>
    </div>
        <MyModal open={open} modalHeader={modalHeader} modalContent={<OauthButtons onLogin={setAtomLogin}/>} closeFunc={handleClose} />
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