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
import { ModalProps } from '@/component/MyModal';

interface ProfileProps extends ModalProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Profile({setOpen}: ProfileProps) {
    const [userInfo, setUserInfo] = useAtom(userInfoAtoms);
    const [nicknameChange, setNicknameChange] = useState<boolean>(false);
    const [nickname, setNickname] = useState<string>('');
    const [isLogin, setIsLogin] = useAtom(loginAtom);

    const cookies = useCookies();
    

    const router = useRouter();
    useEffect(() => {
        setNickname(userInfo.nickname);
    }, []);

    
    const cancleEditNickname = () => { 
        setNickname(userInfo.nickname);
        setNicknameChange(false);
    }

    //Nickname changing function sends PUT request to Database
    const changeNickname =  async() => {
        if (nickname === null) {
            alert("변경할 닉네임을 입력해주세요.");
            return;
        } else if (nickname === userInfo.nickname) {
            alert("기존 닉네임과 동일합니다.");
            return;
        } else if (nickname) {
            try {
                const response = await axios.put(`${myApi}/user/`, {
                    nickname: nickname,
                    email: userInfo.email
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        "Authorization": localStorage.getItem('access_token')?.replace(/\"/gi, ''),
                        withCredentials: true
                    }
                });

                if (response.status === 200) {
                    alert("닉네임이 변경되었습니다.");
                    setNickname(nickname);
                    router.push('/');
                }
            } catch (err) {
                console.log(err);
            }

        }

    }
    //member info delete function sends DELETE request to Database
    //수정필요: 탈퇴 후 모달창이 닫힌 채로 홈 화면으로 돌아가야 함
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
                <div className='nickDiv'><TextField id="outlined-nick" variant="standard" value={nickname} disabled={!nicknameChange} 
                InputProps={{
                    startAdornment: <InputAdornment position="start" style={{fontFamily: 'myfont'}}>닉네임</InputAdornment>,
                  }} onChange={(e)=>setNickname(e.target.value)} placeholder={userInfo.nickname} style={{fontFamily: 'myfont'}}/> 
                {nicknameChange?<><Button className='editBtn' onClick={changeNickname} style={{fontFamily: 'myfont'}}>변경</Button><Button onClick={cancleEditNickname} style={{fontFamily: 'myfont'}}>취소</Button></>:<Button onClick={()=>setNicknameChange(!nicknameChange)} style={{fontFamily: 'myfont'}}>변경</Button>}</div>
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
                    startAdornment: <InputAdornment position="start" style={{fontFamily: 'myfont'}}>{`이메일 : ${userInfo.email}`}</InputAdornment>,
                  }} style={{fontFamily: 'myfont'}}/>
                <TextField id="outlined-basic" variant="standard" value='' disabled InputProps={{
                    startAdornment: <InputAdornment position="start" style={{fontFamily: 'myfont'}}>{`공급자 : ${userInfo.provider}`}</InputAdornment>,
                  }} style={{fontFamily: 'myfont'}}/>
            </Box>
            <div>
                <Button className="withdrawl" onClick={memberWithdrawl} style={{fontFamily: 'myfont'}}>회원 탈퇴</Button>
            </div>
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