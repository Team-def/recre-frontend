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

export default function Home() {
  const [isLogin, setIsLogin] = useAtom(loginAtom)
  const [token, setToken] = useAtom(tokenAtoms);
  const [, setUserInfo] = useAtom(userInfoAtoms);
  const router = useRouter();
  const cookies = useCookies();

  useEffect(() => {
    checkLogin()
    console.log(token)
  }, []);

  const selectGame = () => {
    if (isLogin) {
      router.push("/gameSelect");
    } else {
      alert('로그인이 필요합니다.')
    }
  }

  const checkLogin = () => {
    axios.get(`${myApi}/user`, {
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
        'authorization': token,
        withCredentials: true
      }
    }).then((response) => {
      setUserInfo(response.data)
      setIsLogin(true)
    })
      .catch((res) => {
        console.log(res)
        if (res.response['status'] == 410 || res.response['status'] == 401) {
          sendRefresh()
        }
        else {
          // alert(res)
          setIsLogin(false)
          cookies.remove('refresh_token')
          setToken('')
        }
      })
  }

  const sendRefresh = () => { //customHook 으로 만들어서 모든 요청에 대한 에러 핸들링으로 써야 함
    axios.post(`${myApi}/auth/accesstoken`, {
      refresh_token: cookies.get('refresh_token')
    }, {
      headers: {
        'Content-type': 'application/json',
        'Accept': 'application/json',
        withCredentials: true
      }
    }).then((response) => {
      setToken(response.data.access_token)
      router.push("/")
    })
      .catch((res) => {
        alert('인증 시간이 만료되었습니다. 다시 로그인해주세요.')
        setToken('')
        cookies.remove('refresh_token')
        setIsLogin(false)
        router.push("/")
      })
  }

  return (<>
    <div className='container'>
      <div>
        <p className='middleLogo'>RecRe</p>
      </div>
      {/* login시에만 보이는 버튼 */}
      <div className="login">
        <Button className='start-button' onClick={selectGame}>RecRe 시작!</Button>
      </div>
    </div>
    <style jsx>{`
            .container{
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                height: 100vh;
            }
            .middleLogo{
              font-size: 10vw;
              background: #f1f1f1;
              padding: 50px;
              box-shadow: 0 0 10px rgba(0,0,0,0.5);
            }
            .middleLogo:hover{
              scale: 1.1;
              rotate: 10deg;
              cursor: pointer;
              color: gray;
            }
        `}</style>
  </>
  )
}
