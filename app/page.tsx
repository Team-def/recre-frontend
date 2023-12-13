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


export default function Home() {
  const [isLogin, setIsLogin] = useAtom(loginAtom)
  const [token, setToken] = useAtom(tokenAtoms);
  const [, setUserInfo] = useAtom(userInfoAtoms);
  const [, setGame] = useAtom(gameAtoms);
  const [isWinter, setIsWinter] = useState<boolean>(true);
  const router = useRouter();
  const cookies = useCookies();

  useEffect(() => {
    if(!cookies.get('refresh_token')){
      checkIsHostPhone()
      return
    }
    const acc_token : string = localStorage.getItem('access_token')??''
    // console.log("acc_token: ")
    // console.log(acc_token)
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
        // console.log("checkLogin2 error")
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
      console.log("checkLogin")
      setUserInfo(response.data)
      setIsLogin(true)
      checkIsHostPhone()
    })
      .catch((res) => {
        // console.log(res)
        // console.log("checkLogin error")
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
      // console.log("sendRefresh")
      // console.log("response.data.access_token: ")
      // console.log(response.data.access_token)
      setToken(response.data.access_token)
      checkLogin2(response.data.access_token)
    })
      .catch((res) => {
        // console.log("sendRefresh error")
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
          backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
            '#fff',
          )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
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
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          '#fff',
        )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
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
        <div className='middleLogo' onClick={selectGame}>
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
              height: 100vh;
              background: url('/BG_04.png') center / 100% repeat-x;
              background-size: 50% 100%;
              animation: movebg 2s linear infinite;
            }
            .container-winter{
              width: 100%;
              display: flex;
              justify-content: flex-end;
              align-items: center;
              flex-direction: column;
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
