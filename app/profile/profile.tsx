import Button from '@mui/material/Button';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Profile() {
    //DB에서 현재 사용자의 nickname을 가져와야 함 (임시로 작성함)
    const getNicknameFromToken = (token: string): string | null => {
        const tokenPayload = token.split('.')[1];
        const decodedTokenPayload = atob(tokenPayload);
        const nickname = JSON.parse(decodedTokenPayload).nickname;
        return nickname;
    }

    const [nickname, setNickname] = useState<string | null>(getNicknameFromToken("token"));
    const [newNickname, setNewNickname] = useState<string | null>(null);

    //DB에 PUT(PATCH?) 요청을 보내는 닉네임 변경 함수 (임시로 작성함)
    const handleNicknameChange =  async() => {
        if (newNickname === null) {
            alert("변경할 닉네임을 입력해주세요.");
            return;
        } else if (newNickname === nickname) {
            alert("기존 닉네임과 동일합니다.");
            return;
        } else if (nickname) {
            try {
                const response = await axios.put("http://treepark.shop:3000/user/change", {
                    nickname: newNickname,
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        withCredentials: true
                    }
                });

                if (response.status === 200) {
                    alert("닉네임이 변경되었습니다.");
                    setNickname(newNickname);
                }
            } catch (err) {
                console.log(err);
            }

        }
        
    }
    //DB에 DELETE 요청을 보내는 회원탈퇴 함수
    const handleWithdrawal = () => {
        
    }
    //현재 토큰을 지우는 로그아웃 함수
    const handleLogout = () => {
        
    }

    return (
        <div>
            <h1>{nickname || "사용자" } 님의 프로필</h1>
            <label>닉네임 :</label>
            <input type="text" name="nickname" placeholder="기존 닉네임" onChange={(e) => setNewNickname(e.target.value)}/>
            <Button onClick={handleNicknameChange}>변경하기</Button>

            <Button onClick={handleWithdrawal}>회원 탈퇴</Button>
            <Button onClick={handleLogout}>로그아웃</Button>
        </div>
    )
}