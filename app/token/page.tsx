"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { tokenAtoms } from "@/app/modules/tokenAtoms";
import { useAtom } from "jotai";
import { useSearchParams } from 'next/navigation';
import { useCookies } from 'next-client-cookies';

const GetTokenParams = () => {
    const params = useSearchParams();
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    const router = useRouter();
    const [, setToken] = useAtom(tokenAtoms);
    const cookies = useCookies();

    useEffect(() => {
        if (access_token && refresh_token) {
            setToken(access_token);
            cookies.set('refresh_token', refresh_token)
            router.push("/");
        }else{
            alert('로그인에 실패했습니다.')
        }
    }, []);
    return (<></>);
}

export default GetTokenParams;