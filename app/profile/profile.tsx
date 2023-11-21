import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { userInfoAtoms } from '../modules/userInfoAtom';
import InputAdornment from '@mui/material/InputAdornment';
import axios from 'axios';
import { myApi } from '../modules/backApi';
import { useRouter } from 'next/navigation';
import { useCookies } from 'next-client-cookies';
import { loginAtom } from '../modules/loginAtoms';


export default function Profile() {
    const [userInfo, setUserInfo] = useAtom(userInfoAtoms);
    const [nickChange, setNickChange] = useState<boolean>(false);
    const [nick, setNick] = useState<string>('');
    const [isLogin, setIsLogin] = useAtom(loginAtom);

    const cookies = useCookies();
    

    const router = useRouter();
    useEffect(() => {
        setNick(userInfo.nickname);
    }, []);

    
    const cancleEditNick = () => { 
        setNick(userInfo.nickname);
        setNickChange(false);
    }

    // //토큰(세션?)에서 현재 사용자의 nickname을 가져와야 함 (임시로 작성함)
    // const getNicknameFromToken = (token: string): string => {
    //     // const tokenPayload = token.split('.')[1];
    //     // const decodedTokenPayload = atob(tokenPayload);
    //     // const nickname = JSON.parse(decodedTokenPayload).nickname;
    //     // return nickname;
    // }

    // const [currentNickname, setNickname] = useState<string>(getNicknameFromToken("token"));
    // const [newNickname, setNewNickname] = useState<string | null>(null);

    // //DB에 PUT(PATCH?) 요청을 보내는 닉네임 변경 함수 (임시로 작성함)
    // const handleNicknameChange =  async() => {
    //     if (newNickname === null) {
    //         alert("변경할 닉네임을 입력해주세요.");
    //         return;
    //     } else if (newNickname === currentNickname) {
    //         alert("기존 닉네임과 동일합니다.");
    //         return;
    //     } else if (currentNickname) {
    //         try {
    //             const response = await axios.put("${myApi}/user/change", {
    //                 nickname: newNickname,
    //             }, {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     "Accept": "application/json",
    //                     withCredentials: true
    //                 }
    //             });

    //             if (response.status === 200) {
    //                 alert("닉네임이 변경되었습니다.");
    //                 setNickname(newNickname);
    //             }
    //         } catch (err) {
    //             console.log(err);
    //         }

    //     }

    // }
    // //DB에 DELETE 요청을 보내는 회원탈퇴 함수 (임시로 작성함)
    // const handleWithdrawal = async () => {
    //     if (currentNickname) {
    //         if (confirm("정말로 탈퇴하시겠습니까?") === false) {
    //             return;
    //         } else {
    //             const response = await axios.delete("${myApi}/user/withdrawal", {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Accept": "application/json",
    //             },
    //             data: {
    //                 nickname: currentNickname,
    //             }
    //             });
    //             alert("회원 탈퇴가 완료되었습니다.");
    //         }
    //     }
    // };
    // //현재 토큰(세션?)을 지우는 로그아웃 함수
    // const handleLogout = () => {

    // }

    const memberWithdrawl = async () => {

        if (confirm("정말로 탈퇴하시겠습니까?") === false) {
            return;
        } else {
            const response = await axios.delete(`${myApi}/user/`, {
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": localStorage.getItem('access_token')?.replace(/\"/gi, '')
            },
            data: {
                email: userInfo.email,
            }
            });
            alert("회원 탈퇴가 완료되었습니다.");
            setIsLogin(false);
            localStorage.removeItem('access_token');
            cookies.remove('refresh_token');
            router.push('/');
            router.refresh();
        }
    }

    return (<>
        <div className='textGroup'>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '30ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <div className='nickDiv'><TextField id="outlined-nick" variant="standard" value={nick} disabled={!nickChange} 
                InputProps={{
                    startAdornment: <InputAdornment position="start">닉네임</InputAdornment>,
                  }} onChange={(e)=>setNick(e.target.value)} placeholder={userInfo.nickname}/> 
                {nickChange?<><Button className='editBtn'>변경</Button><Button onClick={cancleEditNick}>취소</Button></>:<Button onClick={()=>setNickChange(!nickChange)}>변경</Button>}</div>
            </Box>
            <Box
                component="form"
                sx={{
                    '& > :not(style)': { m: 1, width: '30ch' },
                }}
                noValidate
                autoComplete="off"
            >
                <TextField id="outlined-basic" variant="standard" value='' disabled InputProps={{
                    startAdornment: <InputAdornment position="start">{`이메일 : ${userInfo.email}`}</InputAdornment>,
                  }}/>
                <TextField id="outlined-basic" variant="standard" value='' disabled InputProps={{
                    startAdornment: <InputAdornment position="start">{`공급자 : ${userInfo.provider}`}</InputAdornment>,
                  }}/>
            </Box>
            <div>
                <Button className="withdrawl" onClick={memberWithdrawl}>회원 탈퇴</Button>
            </div>

            {/* <Button onClick={handleNicknameChange}>변경하기</Button>
            <Button onClick={handleWithdrawal}>회원 탈퇴</Button>
            <Button onClick={handleLogout}>로그아웃</Button> */}
        </div>
        <style jsx>{`
            .textGroup{
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                width: 350px;
            }
            .nickDiv{
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
            }
        `}</style>
        </>
    )
}