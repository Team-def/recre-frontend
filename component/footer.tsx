"use client";
import { useState } from "react";
import Button from '@mui/material/Button';
import MyModal from "./MyModal";
import { useAtom } from 'jotai';
import { loginAtom } from "@/app/modules/loginAtoms";
import CatchAnswer from "@/app/catchAnswer/page";
import { usePathname } from 'next/navigation';

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
    const currentPath = usePathname()
    const notNow = ['/gameSelect','/player','/catchAnswer', '/gamePage' ]
    const hideHeader = notNow.includes(currentPath) ? true : false

    const handleClose = () => { setOpen(false); }

    return (<>{hideHeader?'':<>
        <div className="footerContainer">
            <div>
                <h4>SWJUNGLE Team.def()</h4>
            </div>
            

        </div>
        <MyModal open={open} modalHeader={'캐치마인드 정답 입력'} modalContent={<CatchAnswer />} closeFunc={handleClose} myref={null}/></>}
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