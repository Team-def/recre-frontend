"use client";
import { useState } from "react";
import Button from '@mui/material/Button';
import OauthButtons from "./OauthButtons";
import MyModal from "./MyModal";
import Login from "@/app/login/login";
import SignUp from "@/app/signup/signup";

export interface ModalProps {
    isOpen : boolean,
    setOpen : React.Dispatch<React.SetStateAction<boolean>>,
    modalHeader : string,
    setModalHeader : React.Dispatch<React.SetStateAction<string>>,
  }

export default function Header() {
    const [open, setOpen] = useState<ModalProps['isOpen']>(false);
    const [modalHeader, setModalHeader] = useState('');
  
    const handleOpenLogin = () => {
      setModalHeader('로그인 / 회원가입');
      setOpen(true);
    }
    const handleClose = () => {setOpen(false);}
    
    return (<>
        <div>
            <h1>RecRe</h1>
        </div>
              {/* 비로그인시에 보이는 메뉴 */}
      <div className='no-login'>
      <Button onClick={handleOpenLogin}>로그인 / 회원가입</Button>
    </div>
    {/* 로그인시에만 보이는 문구 */}
    <div className="login">
      username님! 안녕하세요!
    </div>
    <MyModal open={open} modalHeader={modalHeader} modalContent={<OauthButtons/>} closeFunc = {handleClose}/></>
    )
}