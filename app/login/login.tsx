"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const router = useRouter();

    const login = () => {
        console.log(username, password);
        router.push("/");
    };

    return (
        <div>
            <h1>로그인하기</h1>
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