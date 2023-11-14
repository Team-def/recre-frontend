"use client";
import * as React from 'react';
import { useState } from "react";
import Image from 'next/image'
import Button from '@mui/material/Button';
import MyModal from '@/component/MyModal';
import OauthButtons from '@/component/OauthButtons';
import Login from './login/login';
import SignUp from './signup/signup';

export interface ModalProps {
  isOpen : boolean,
  setOpen : React.Dispatch<React.SetStateAction<boolean>>,
  modalHeader : string,
  setModalHeader : React.Dispatch<React.SetStateAction<string>>,
}

export default function Home() {
  const [open, setOpen] = useState<ModalProps['isOpen']>(false);
  const [modalHeader, setModalHeader] = useState('');

  const handleOpenLogin = () => {
    setModalHeader('로그인 / 회원가입');
    setOpen(true);
  }
  const handleClose = () => {setOpen(false);}

  return (
    <div>
      {/* 비로그인시에 보이는 메뉴 */}
      <div className='no-login'>
        <Button onClick={handleOpenLogin}>로그인 / 회원가입</Button>

      </div>
      {/* 로그인시에만 보이는 문구 */}
      <div className="login">
        username님! 안녕하세요!
      </div>
      <Image
        src="/vercel.svg"
        alt="Picture of the author"
        width={500}
        height={500}
      />
      <MyModal open={open} modalHeader={modalHeader} modalContent={<OauthButtons/>} closeFunc = {handleClose}/>
    </div>
  )
}
