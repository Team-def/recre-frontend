import Button from '@mui/material/Button';

export default function Footer() {
    return (
        <div>
            <div>
                <h4>SWJUNGLE Team.def()</h4>
            </div>
            {/* login시에만 보이는 버튼 */}
            <div className="login">
                <Button className='start-button'>RecRe 시작!</Button>
            </div>
        </div>
    )
}