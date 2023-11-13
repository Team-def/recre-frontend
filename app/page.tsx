'use client';
import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Image from 'next/image'
import Login from './login/login'
import SignUp from './signup/signup'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


export default function Home() {
  const [openSignUp, setOpenSignUp] = React.useState(false);
  const [openLogin, setOpenLogin] = React.useState(false);
  const handleOpenSignUp = () => setOpenSignUp(true);
  const handleCloseSignUp = () => setOpenSignUp(false);
  const handleOpenLogin = () => setOpenLogin(true);
  const handleCloseLogin = () => setOpenLogin(false);

  return (
    <div>
      {/* 비로그인시에 보이는 메뉴 */}
      <div className='no-login'>
          <button onClick={handleOpenSignUp}>회원가입</button>
          <Modal
            open={openSignUp}
            onClose={handleCloseSignUp}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
              <SignUp />
            </Box>
          </Modal>
          <button onClick={handleOpenLogin}>로그인</button>
          <Modal
            open={openLogin}
            onClose={handleCloseLogin}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description">
            <Box sx={style}>
              <Login />
            </Box>
          </Modal>
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
    </div>
  )
}
