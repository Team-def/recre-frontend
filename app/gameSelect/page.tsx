"use client";
import { useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Image from 'next/image';
import Button from '@mui/material/Button';
import { useAtom } from 'jotai';
import { loginAtom } from "@/app/modules/loginAtoms";
import { gameAtoms } from '../modules/gameAtoms';
import { useRouter } from "next/navigation";
import TextField from '@mui/material/TextField';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { InputLabel, MenuItem, Select } from '@mui/material';
import { redGreenInfoAtom } from '../modules/redGreenAtoms';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

export default function GameSelect() {
    const [gameInfo, setGameInfo] = useAtom(gameAtoms);
    const [isLogin,] = useAtom(loginAtom);
    const [isReady, setIsReady] = useState<boolean>(false);
    const router = useRouter();
    const [isHovering, setIsHovered] = useState(false);
    const [hoverElement, setHoverElement] = useState('');
    const [redGreenInfo, setRedGreenInfo] = useAtom(redGreenInfoAtom);
    const containerRef = useRef<HTMLDivElement>(null);
    const circleRef = useRef<HTMLDivElement>(null);
    const [addClass, setAddClass] = useState(false);

    const onMouseEnter = (gameName: string) => {
        setIsHovered(true);
        setHoverElement(gameName);
    }
    const onMouseLeave = () => setIsHovered(false);

    // useEffect(() => {
    //     if (!isLogin) {
    //         // console.log(isLogin)
    //         alert('로그인이 필요합니다.')
    //         router.push("/")
    //     }
    // }, []);

    useEffect(() => {

        if (gameInfo[1] && gameInfo[1] > 0 && gameInfo[0]) {
            if (gameInfo[1] > 1000) {
                alert('한 게임 당 참여가능한 인원은 1000명 이하입니다.')
                setGameInfo([gameInfo[0], 0])
            }
            else {
                if(gameInfo[0] === '무궁화 꽃이 피었습니다'){
                    if(redGreenInfo[0] && redGreenInfo[0] > 0){
                        if(redGreenInfo[0] > gameInfo[1]){
                            alert('우승자 수가 참여 인원보다 많습니다.')
                            setRedGreenInfo([gameInfo[1],redGreenInfo[1]])
                        }
                        else{
                            setIsReady(true);
                        }
                    }
                    else setIsReady(false);
                }
                else setIsReady(true);
            }
        }
        else {
            setIsReady(false);
        }
    }, [gameInfo, redGreenInfo]);

    const handleGameSelect = (game: string) => {
        if(game === '서비스 준비중') {
            alert('현재 서비스 준비중입니다.')
            return;
        }
        if (gameInfo[0] === game) {
            setGameInfo(["", gameInfo[1]]);
            if(circleRef.current && containerRef.current){
                containerRef.current.style.setProperty('background-color', '#f8f8f8')
                circleRef.current.style.setProperty('background-color', '#f8f8f8')
            }
        } else {
            setGameInfo([game, gameInfo[1]]);
            if(circleRef.current && containerRef.current){
                if(game === '무궁화 꽃이 피었습니다'){
                    containerRef.current.style.setProperty('background-color', 'rgb(189, 228, 255)')
                    circleRef.current.style.setProperty('background-color', 'rgb(189, 228, 255)')
                } else if(game === '그림 맞추기'){
                    containerRef.current.style.setProperty('background-color', 'rgb(255, 227, 227)')
                    circleRef.current.style.setProperty('background-color', 'rgb(255, 227, 227)')
                }
            }
        }
        setAddClass(true)
    };

    useEffect(() => {
        if (addClass) {
            setTimeout(() => {
                setAddClass(false)
            }, 500)
        }
    }, [addClass])


    type Game = {
        name: string,
        image: string
    }

    const drawGame: Game = {
        name: '그림 맞추기',
        image: '/drawGame.jpeg'
    }
    const greenLightGame: Game = {
        name: '무궁화 꽃이 피었습니다',
        image: '/greenLightGame.png'
    }
    const jumpRope: Game = {
        name: '서비스 준비중',
        image: '/jumpRope.jpeg',
    }

    const gameList: Game[] = [drawGame, greenLightGame, jumpRope]

    return (<>
        <div className='gameSelectContainer' ref={containerRef}>
        <div className={`circleDiv ${addClass ? 'active' : ''}`} ref={circleRef}></div>
            <h1 className='gameSelectLogo'>게임 선택</h1>
            <div>
                <Box sx={{ width: '100%' }}>
                    <Grid container spacing={12}>{/* xs는 12가 최대 */}
                        {gameList.map((game) => {
                            return (
                                <Grid className='gameGrid' xs={4} onClick={() => {handleGameSelect(game.name)}}>
                                    <div onMouseEnter={() => onMouseEnter(game.name)}
                                        onMouseLeave={onMouseLeave} className={`gameDiv ${gameInfo[0] === game.name ? "gameDivClicked" : ""}`} id={`${game.name==='서비스 준비중'?'notService':''}`}><Item>
                                            <div className={`imageDiv ${isHovering && hoverElement === game.name ? 'imgBlur' : ''}`}><Image src={game.image} alt={game.name} layout='fill' width={0} height={0} /></div>
                                            <div className='gameTitle'>{game.name}</div>
                                        </Item></div>
                                </Grid>
                            )
                        })}

                    </Grid>
                </Box>
            </div>
            <div className='gameInfoDiv'>
                <div className='input_alert'>
                    {(gameInfo[0] === '' || gameInfo[0] === null)?'':
                    <TextField
                        id="outlined-number"
                        label="인원 수"
                        placeholder='인원 수를 입력해주세요'
                        type="number"
                        value={gameInfo[1]}
                        onChange={(e) => setGameInfo([gameInfo[0], parseInt(e.target.value)])}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />}{gameInfo[0] === '무궁화 꽃이 피었습니다'?<>
                    <TextField
                        id="outlined-number"
                        label="우승자"
                        placeholder='우승자 수를 입력해주세요'
                        type="number"
                        value={redGreenInfo[0]}
                        onChange={(e) => setRedGreenInfo([parseInt(e.target.value),redGreenInfo[1]])}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <FormControl >
  <InputLabel id="demo-simple-select-label">거리</InputLabel>
  <Select
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={redGreenInfo[1]}
    label="Age"
    onChange={(e)=>setRedGreenInfo([redGreenInfo[0],parseInt(e.target.value as string)])}
  >
    <MenuItem value={50}>짧게</MenuItem>
    <MenuItem value={100}>중간</MenuItem>
    <MenuItem value={160}>길게</MenuItem>
  </Select>
</FormControl></>:''}
                </div>
            </div>
            <Button variant='outlined' size="large" onClick={() => router.push("/gamePage")} disabled={!isReady}>{gameInfo[0] ? `${gameInfo[0]} 게임 시작하기` : '게임을 선택해주세요'}</Button>
        </div>
        <style jsx>{`
            .gameSelectContainer{
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                transition-delay: 0.5s;
                align-items: center;
            }
            .circleDiv{
                position: absolute;
                width: 100%;
                height: 100%;
                background: orange;
                transition: clip-path 0.5s ease-out;
                clip-path: circle(0% at 0 0);
                z-index: 0;
            }
            .circleDiv.active{
                clip-path: circle(141.4% at 0 0);
            }
            .gameSelectLogo{
                position: relative;
                font-size: 50px;
                font-weight: bold;
            }
            .gameGrid{
                width:20vw;
                height:20vw;
            }
            .gameDiv{
                width: 20vw;
                height: 20vw;
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                position: relative;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
                border: 5px solid transparent;
                overflow: hidden;
                background-color: transparent;
            }
            .gameDiv:hover{
                scale: 1.05;
                border: 5px solid #ff7878;
                z-index: 6;
            }
            .gameDivClicked{
                scale: 1.05;
                border: 5px solid #ff7878;
            }
            .gameTitle{
                z-index: 3;
                position: relative;
                font-size: 3vw;
                font-weight: bold;
                filter: opacity(0);
                transition: filter 0.2s ease-in-out;
                color: white;
                text-shadow: 0 0 12px rgba(0,0,0,0.5);
                background-color: transparent;
            }
            .gameDiv:hover .gameTitle{
                filter: opacity(1);
            }
            .imgBlur{
                filter: blur(8px);
                transition: filter 0.2s ease-in-out;
            }
            .imageDiv{
                width: 20vw;
                height: 20vw;
                position: absolute;
                left: 0;
                top: 0;
                z-index: 1;
            }
            .gameInfoDiv{
                width: 70%;
                display: flex;  
                align-items: center;
                justify-content: space-evenly;
            }
            .input_alert{
                height: 100%;
                display: flex;
                flex-direction: row; 
                align-items: center;
                justify-content: space-evenly;
                gap: 20px;
            }
            #notService{
                filter: opacity(0.3) drop-shadow(0 0 0 rgba(0,0,0,1));
                background-color: rgba(0,0,0,0.5);
            }
        `}</style>
    </>
    );
}
