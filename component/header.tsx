export default function Header() {
    return (
        <div>
            <div>
                <h1>RecRe</h1>
            </div>
            <div className='no-login'>
                <button>회원가입</button>
                <button>로그인</button>
            </div>
            <div className="login">
                username님! 안녕하세요!
            </div>
        </div>
    )
}