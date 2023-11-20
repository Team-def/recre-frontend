"use client";
import { useState } from "react";
import Button from '@mui/material/Button';
import MyModal from "./MyModal";

import { useAtom } from 'jotai';
import { loginAtom } from "@/app/modules/loginAtoms";

export interface ModalProps {
    isOpen: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
    modalHeader: string,
    setModalHeader: React.Dispatch<React.SetStateAction<string>>,
    isLogin: boolean,
    setIsLogin: React.Dispatch<React.SetStateAction<boolean>>,
}

export default function Footer() {
    const [open, setOpen] = useState<ModalProps['isOpen']>(false);
    const [isLogin,setIsLogin] = useAtom(loginAtom)

    const handleClose = () => { setOpen(false); }
    const catch_answer = () => { setOpen(true); }

    return (<>
        <div className="footerContainer">
            <div>
                <h4>SWJUNGLE Team.def()</h4>
            </div>
            

        </div>
        <style jsx>{`
                .footerContainer{
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 60px;
                    background-color: #f2f2f2;
                    color: gray;
                }
            `}</style>
        </>
    )
}