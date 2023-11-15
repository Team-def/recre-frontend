"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { tokenAtoms } from "@/app/modules/tokenAtoms";
import { useAtom } from "jotai";
import { useSearchParams } from 'next/navigation'

const GetTokenParams = () => {
    const params = useSearchParams();
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    const router = useRouter();
    const [, setToken] = useAtom(tokenAtoms);

    useEffect(() => {
        if (access_token && refresh_token) {
            setToken([access_token,refresh_token]);
            router.push("/");
        }
    }, []);
    return (<></>);
}

export default GetTokenParams;