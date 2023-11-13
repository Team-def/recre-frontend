"use client";

import Link from "next/link";
import { useState } from "react";

interface LoginModalProps {
    onClose: () => void;
}

export function LoginModal({ onClose }: LoginModalProps) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        // handle login logic
        console.log("로그인:", username, password);
        onClose();
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h2>로그인</h2>
                <label>
                    username:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </label>
                <label>
                    password:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <button onClick={handleLogin}>Login</button>
            </div>
        </div>
    );
};

export default LoginModal;

