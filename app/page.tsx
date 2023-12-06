"use client";
import * as React from 'react';
import { useRouter } from 'next/navigation';
import Button from '@mui/material/Button';
import { useAtom } from 'jotai';
import { loginAtom } from "@/app/modules/loginAtoms";
import { tokenAtoms } from './modules/tokenAtoms';
import { userInfoAtoms } from './modules/userInfoAtom';
import axios from 'axios';
import { useEffect } from 'react';
import { useCookies } from 'next-client-cookies';
import { myApi } from './modules/backApi';
import { gameAtoms } from './modules/gameAtoms';
import {isMobile, isTablet} from 'react-device-detect';
import Image from 'next/image';


export default function Home() {
  const [isLogin, setIsLogin] = useAtom(loginAtom)
  const [token, setToken] = useAtom(tokenAtoms);
  const [, setUserInfo] = useAtom(userInfoAtoms);
  const [, setGame] = useAtom(gameAtoms);
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


  return (<>
    <div className='container'>
      {/* <div> */}
        <p className='middleLogo' onClick={selectGame}>Recre</p>
        <div onClick={selectGame} className='knight'>
        <div className='dialog'><Image src={'/dialog.png'} alt='dialog' width={200} height={100}></Image></div>
        <Image src={'/knight.gif'} alt='knight' width={300} height={300}></Image>
        </div>
        
      {/* </div> */}
    </div>
    <style jsx>{`
            .container{
              width: 100%;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                flex-direction: column;
                height: 100vh;
                background: url('/BG1.jpg') center / 100% repeat-x;
                background-size: 50% 100%;
                animation: movebg 2s linear infinite;
            }
            .middleLogo{
              position: absolute;
              top: 0vh;
              font-size: 7em;
              text-align: center;
              background-color: rgba(255,255,255,0.9);
              padding: 20px 50px;
              border-radius: 30px;
              box-shadow: 0 0 10px rgba(0,0,0,0.5);
              animation: shake 1.5s linear infinite;
            }
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

            @keyframes shake{
              0%{
                rotate: 0deg;
              }
              25%{
                rotate: 10deg;
              }
              50%{
                rotate: 0deg;
              }
              75%{
                rotate: -10deg;
              }
              100%{
                rotate: 0deg;
              }
            }
        `}</style>
  </>
  )
}
