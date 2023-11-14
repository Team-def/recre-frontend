"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from 'axios'

interface LoginProps {
    name: string,
    setUsername: React.Dispatch<React.SetStateAction<string>>,
    password: string,
    setPassword: React.Dispatch<React.SetStateAction<string>>,
}

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const login = () => {
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
                alert('로그인 되었습니다..')
                router.push("/");
            })
            .catch((res) => { alert(res.response.data.message) })
    }

    return (
        <div>
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
            <button onClick={login}>로그인</button>
        </div>
    )
}