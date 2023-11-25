import Image from "next/image"
import oauthButtonsStyle from "./oauthButtonsStyle.module.css"
import { useRouter } from 'next/navigation'
import { myApi } from "@/app/modules/backApi"


export default function OauthButtons() {
    const router = useRouter();

    // const login = (method:string) => {
    //     axios.get(`${myApi}/auth/${method}`, {
    //         headers: {
    //             'Content-type': 'application/json',
    //             'Accept': 'application/json',
    //         }
    //     }).then((response) => {
    //             redirect(response.data.url)
    //         })
    //         .catch((res) => { 
    //             alert(res) 
    //         })
    // }

    const loginWithOauth = (method:string) => {
        router.replace(`${myApi}/auth/${method}`)
    }

    return (<><div className={oauthButtonsStyle.imgDiv}>
        <Image src={"/oauth/kakao_login.png"} alt={"카카오 로그인 이미지"} sizes="100vw" width={0} height={0} className={oauthButtonsStyle.img} onClick={(e)=>loginWithOauth('kakao')}/>
        <Image src={"/oauth/naver_login.png"} alt={"네이버 로그인 이미지"} sizes="100vw" width={0} height={0} className={oauthButtonsStyle.img} onClick={(e)=>loginWithOauth('naver')}/>
        <div className={[oauthButtonsStyle.google_btn, oauthButtonsStyle.img].join(" ")} onClick={(e)=>loginWithOauth('google')}>
            <div className={oauthButtonsStyle.google_icon_wrapper}>
                <img className={oauthButtonsStyle.google_icon_svg} src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg" />
            </div>
            <p className={oauthButtonsStyle.btn_text}><b>구글 로그인</b></p>
        </div>
    </div>
        </>
    )
}