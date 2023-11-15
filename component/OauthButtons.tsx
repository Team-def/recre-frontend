import Image from "next/image"
import oauthButtonsStyle from "./oauthButtonsStyle.module.css"
import axios from "axios"
import { useRouter } from 'next/navigation'


export default function OauthButtons() {
    const router = useRouter();

    // const login = (method:string) => {
    //     axios.get(`http://treepark.shop:3000/auth/${method}`, {
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
        router.replace(`http://treepark.shop:3000/auth/${method}`)
    }

    return (<><div className={oauthButtonsStyle.imgDiv}>
        <Image src={"/oauth/kakao_login.png"} alt={"카카오 로그인 이미지"} sizes="100vw" width={0} height={0} className={oauthButtonsStyle.img} onClick={(e)=>loginWithOauth('kakao')}/>
        <Image src={"/oauth/naver_login.png"} alt={"네이버 로그인 이미지"} sizes="100vw" width={0} height={0} className={oauthButtonsStyle.img} onClick={(e)=>loginWithOauth('naver')}/>
        <div className={[oauthButtonsStyle.google_btn, oauthButtonsStyle.img].join(" ")} onClick={(e)=>loginWithOauth('google')}>
            <div className={oauthButtonsStyle.google_icon_wrapper}>
                <img className={oauthButtonsStyle.google_icon_svg} src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
            </div>
            <p className={oauthButtonsStyle.btn_text}><b>구글 로그인</b></p>
        </div>
    </div>
        </>
    )
}