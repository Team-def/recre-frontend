"use client";
import * as React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import { useAtom } from 'jotai';
import { loginAtom } from "@/app/modules/loginAtoms";
import { tokenAtoms } from './modules/tokenAtoms';
import { userInfoAtoms } from './modules/userInfoAtom';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useCookies } from 'next-client-cookies';
import { myApi } from './modules/backApi';
import { gameAtoms } from './modules/gameAtoms';
import {isMobile, isTablet} from 'react-device-detect';
import Image from 'next/image';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import useVH from 'react-viewport-height';


export default function Home() {
  const [isLogin, setIsLogin] = useAtom(loginAtom)
  const [token, setToken] = useAtom(tokenAtoms);
  const [, setUserInfo] = useAtom(userInfoAtoms);
  const [, setGame] = useAtom(gameAtoms);
  const [isWinter, setIsWinter] = useState<boolean>(true);
  const router = useRouter();
  const cookies = useCookies();
  const vh = useVH();

  useEffect(() => {
    if(!cookies.get('refresh_token')){
      checkIsHostPhone()
      return
    }
    const acc_token : string = localStorage.getItem('access_token')??''
      checkLogin(acc_token)
  }, []);

  const selectGame = () => {
    if (isLogin) {
      router.push("/gameSelect");
    } else {
      alert('로그인이 필요합니다.')
    }
  }

  const checkLogin2 = (acc_token : string) => {
    axios.get(`${myApi}/user`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Content-type': 'application/json',
        'Accept': 'application/json',
        'authorization': acc_token,
        withCredentials: true
      }
    }).then((response) => {
      setUserInfo(response.data)
      setIsLogin(true)
      checkIsHostPhone()
    })
      .catch((res) => {
        alert('로그인에 실패했습니다. 다시 로그인해주세요.\n 문제가 있을 시 캐시를 삭제해보세요.')
        checkIsHostPhone()
      })
  }

  const checkLogin = (acc_token : string) => {
    axios.get(`${myApi}/user`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Content-type': 'application/json',
        'Accept': 'application/json',
        'authorization': acc_token,
        withCredentials: true
      }
    }).then((response) => {
      setUserInfo(response.data)
      setIsLogin(true)
      checkIsHostPhone()
    })
      .catch((res) => {
        if (res.response['status'] === 410 || res.response['status'] === 401) {
            sendRefresh()
        }
        else {
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
        setGame(["",null])
        checkIsHostPhone()
        }
      })
  }

  const sendRefresh = () => { //customHook 으로 만들어서 모든 요청에 대한 에러 핸들링으로 써야 함
    axios.post(`${myApi}/auth/accesstoken`, {
      refresh_token: cookies.get('refresh_token')
    }, {
      headers: {
        'Cache-Control': 'no-cache',
        'Content-type': 'application/json',
        'Accept': 'application/json',
        withCredentials: true
      }
    }).then((response) => {
      setToken(response.data.access_token)
      checkLogin2(response.data.access_token)
    })
      .catch((res) => {
        alert('인증 시간이 만료되었습니다. 다시 로그인해주세요.')
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
        setGame(["",null])
        if(isMobile){
          router.push("/catchAnswer");
        }
        else router.push("/")
      })
  }

  const checkIsHostPhone = () => {
    if(isMobile){
      router.push("/catchAnswer");
    }
  }

  const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
      margin: 1,
      padding: 0,
      transform: 'translateX(6px)',
      '&.Mui-checked': {
        color: '#fff',
        transform: 'translateX(22px)',
        '& .MuiSwitch-thumb:before': {
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 16 16"><path fill="${encodeURIComponent(
            '#fff',
          )}" d="M8 16a.5.5 0 0 1-.5-.5v-1.293l-.646.647a.5.5 0 0 1-.707-.708L7.5 12.793V8.866l-3.4 1.963-.496 1.85a.5.5 0 1 1-.966-.26l.237-.882-1.12.646a.5.5 0 0 1-.5-.866l1.12-.646-.884-.237a.5.5 0 1 1 .26-.966l1.848.495L7 8 3.6 6.037l-1.85.495a.5.5 0 0 1-.258-.966l.883-.237-1.12-.646a.5.5 0 1 1 .5-.866l1.12.646-.237-.883a.5.5 0 1 1 .966-.258l.495 1.849L7.5 7.134V3.207L6.147 1.854a.5.5 0 1 1 .707-.708l.646.647V.5a.5.5 0 1 1 1 0v1.293l.647-.647a.5.5 0 1 1 .707.708L8.5 3.207v3.927l3.4-1.963.496-1.85a.5.5 0 1 1 .966.26l-.236.882 1.12-.646a.5.5 0 0 1 .5.866l-1.12.646.883.237a.5.5 0 1 1-.26.966l-1.848-.495L9 8l3.4 1.963 1.849-.495a.5.5 0 0 1 .259.966l-.883.237 1.12.646a.5.5 0 0 1-.5.866l-1.12-.646.236.883a.5.5 0 1 1-.966.258l-.495-1.849-3.4-1.963v3.927l1.353 1.353a.5.5 0 0 1-.707.708l-.647-.647V15.5a.5.5 0 0 1-.5.5z"/></svg>')`,
        },
        '& + .MuiSwitch-track': {
          opacity: 1,
          backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        },
      },
    },
    '& .MuiSwitch-thumb': {
      backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
      width: 32,
      height: 32,
      '&:before': {
        content: "''",
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: 0,
        top: 0,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 2 16 16"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M13.405 8.527a5.001 5.001 0 0 0-9.499-1.004A3.5 3.5 0 1 0 3.5 14.5H13a3 3 0 0 0 .405-5.973zM8.5 5.5a4 4 0 0 1 3.976 3.555.5.5 0 0 0 .5.445H13a2 2 0 0 1-.001 4H3.5a2.5 2.5 0 1 1 .605-4.926.5.5 0 0 0 .596-.329A4.002 4.002 0 0 1 8.5 5.5z"/></svg>')`,
      },
    },
    '& .MuiSwitch-track': {
      opacity: 1,
      backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      borderRadius: 20 / 2,
    },
  }));

  const handleSwitchChange = () => {
    setIsWinter((prevIsWinter) => !prevIsWinter);
  };

  return (<>
            <FormGroup >
              <FormControlLabel 
                className='switch'
                control={<MaterialUISwitch sx={{ m: 1, position:'absolute', bottom:'3vh', right:'3vh'}} defaultChecked={isWinter} onChange={handleSwitchChange} />}
                label=""
              />
            </FormGroup>
    {isWinter? 
      <div className='container-winter'>
        <div className='middleLogo'>
          <Image src={'/xmasRecRe.png'} alt='logo' width={300} height={100}></Image>
        </div>
        <div onClick={selectGame} className='knight'>
          <div className='dialog'>
            <Image src={'/dialog.png'} alt='dialog' width={200} height={100}></Image>
          </div>
          <Image src={'/knight.gif'} alt='knight' width={300} height={300}></Image>
        </div>
      </div> : 
      <div className='container'>
        <div className='middleLogo' onClick={selectGame}>
          <Image src={'/brickRecRe.png'} alt='logo' width={300} height={100}></Image>
        </div>
        <div onClick={selectGame} className='knight'>
          <div className='dialog'>
            <Image src={'/dialog.png'} alt='dialog' width={200} height={100}></Image>
          </div>
          <Image src={'/knight.gif'} alt='knight' width={300} height={300}></Image>
        </div>
      </div> }
    <style jsx>{`
            .container{
              width: 100%;
              display: flex;
              justify-content: flex-end;
              align-items: center;
              flex-direction: column;
              // height: ${100 * vh - 120}px;
              height: 100vh;
              background: url('/BG_04.png') center / 100% repeat-x;
              background-size: 50% 100%;
              animation: movebg 2s linear infinite;
              font-family : 'retro_dupna';
            }
            .container-winter{
              width: 100%;
              display: flex;
              justify-content: flex-end;
              align-items: center;
              flex-direction: column;
              // height: ${100 * vh - 120}px;
              height: 100vh;
              background: url('/BG_03.png') center / 100% repeat-x;
              background-size: 50% 100%;
              animation: movebg 2s linear infinite;
              font-family : 'retro_dupna';
            }
            .middleLogo{
              width:40vw;
              height:12vw;
              position: absolute;
              top: 100px;
              text-align: center;
              background-color: transparent;
              animation: scaleAnimation 2s linear infinite;
            }
            // .middleLogo:hover{
            //   transform: scale(1.2);
            // }
            .knight{
              display: flex;
              flex-direction: column;
              justify-content: center;
              align-items: center;
              z-index: 55;
            }
            .knight:hover{
              width: 500px;
              height: 400px;
              scale: 1.2;
              cursor: pointer;
            }
            .dialog{
              position : relative;
              left: 25px;
              top: 30px;
            }

            @keyframes movebg{
              0%{
                background-position: 0 center;
              }
              100%{
                background-position: -100% center;
              }
            }

            @keyframes scaleAnimation{
              0%{
                transform: scale(1);
              }
              25%{
                transform: scale(1.05);
              }
              50%{
                transform: scale(1);
              }
              75%{
                transform: scale(1.05);
              }
              100%{
                transform: scale(1);
              }
            }
            }
        `}</style>
  </>
  )
}
