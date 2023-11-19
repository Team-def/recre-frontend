"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { tokenAtoms } from "@/app/modules/tokenAtoms";
import { useAtom } from "jotai";
import { useSearchParams } from 'next/navigation';
import { useCookies } from 'next-client-cookies';

const GetTokenParams = () => {
    // const params = useSearchParams();
    // const access_token = params.get('access_token');
    // const refresh_token = params.get('refresh_token');
    const cookies = useCookies();
    const access_token = cookies.get('access_token')
    const refresh_token = cookies.get('refresh_token')

    const router = useRouter();
    const [, setToken] = useAtom(tokenAtoms);

    useEffect(() => {
        if (access_token && refresh_token) {
            setToken(access_token);
            cookies.remove('access_token')
            cookies.remove('refresh_token')
            cookies.set('refresh_token', refresh_token, {secure:true, sameSite:'Lax'})
            router.push("/");
        }else{
            alert('로그인에 실패했습니다.')
        }
    }, []);
    return (<></>);
}

export default GetTokenParams;