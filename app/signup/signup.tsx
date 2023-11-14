"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios'

export default function SignUp() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const router = useRouter();

    const signUp = () => {
        if (password !== passwordConfirm) {
            alert("비밀번호가 일치하지 않습니다.");
            return;
        }
        axios.post(`http://treepark.shop:3000/user`, {
            name: username,
            password: password,
        }, {
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
                withCredentials: true
            }
        }).then((Response) => {
                alert('회원가입 되었습니다..')
                router.push("/");
            })
            .catch((res) => { alert(res.response.data.message) })
        console.log(username, password);
        router.push("/");
    }
    
    return (
        <div>
            <h1>회원가입하기</h1>
            <div>
                <label>
                    아이디:
                    <input
                        type="text"
                        placeholder="아이디"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    비밀번호:
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    비밀번호 확인:
                    <input
                        type="password"
                        placeholder="비밀번호 확인"
                        value={passwordConfirm}
                        onChange={(e) => setPasswordConfirm(e.target.value)}
                    />
                </label>
            </div>
            <button onClick={signUp}>로그인</button>
        </div>
    )
    
}