import Image from "next/image"
import oauthButtonsStyle from "./oauthButtonsStyle.module.css"

export default function OauthButtons({isLoginClicked} : {isLoginClicked : boolean}) {
    return (<><div className={oauthButtonsStyle.imgDiv}>
        <Image src={isLoginClicked?"/oauth/kakao_login.png":"/oauth/kakao_signup.png"} alt={isLoginClicked?"카카오 로그인 이미지":"카카오 회원가입 이미지"} sizes="100vw" width={0} height={0} className={oauthButtonsStyle.img} />
        <Image src={isLoginClicked?"/oauth/naver_login.png":"/oauth/naver_signup.png"} alt={isLoginClicked?"네이버 로그인 이미지":"네이버 회원가입 이미지"} sizes="100vw" width={0} height={0} className={oauthButtonsStyle.img} />
        <div className={[oauthButtonsStyle.google_btn, oauthButtonsStyle.img].join(" ")}>
            <div className={oauthButtonsStyle.google_icon_wrapper}>
                <img className={oauthButtonsStyle.google_icon_svg} src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" />
            </div>
            <p className={oauthButtonsStyle.btn_text}><b>{isLoginClicked?"구글 로그인":"구글로 시작하기"}</b></p>
        </div>
    </div>
        </>
    )
}