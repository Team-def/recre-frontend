"use client";
import { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Image from 'next/image';
import Button from '@mui/material/Button';
import { useAtom } from 'jotai';
import { loginAtom } from "@/app/modules/loginAtoms";
import { numberOfPeopleAtom } from '../modules/numberOfPeopleAtoms';
import { gameAtoms } from '../modules/gameAtoms';
import { useRouter } from "next/navigation";
import TextField from '@mui/material/TextField';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));


export default function GameSelect() {
    const [selectedGame, setSelectedGame] = useState<string | null>(null);
    const [isLogin,] = useAtom(loginAtom);
    const [numberOfPeople, setNumberOfPeople] = useAtom(numberOfPeopleAtom);
    const [isReady, setIsReady] = useState<boolean>(false);
    const router = useRouter();
    const [isHovering, setIsHovered] = useState(false);
    const [hoverElement, setHoverElement] = useState('');

    const onMouseEnter = (gameName:string) => {
        setIsHovered(true);
        setHoverElement(gameName);
    }
    const onMouseLeave = () => setIsHovered(false);

    useEffect(() => {
        if (!isLogin) {
            alert('로그인이 필요합니다.')
            router.push("/")
        }
    }, []);

    useEffect(() => {
        console.log(numberOfPeople)
        console.log(typeof (numberOfPeople))
        if (numberOfPeople && numberOfPeople > 0 && selectedGame) {
            setIsReady(true);
        }
        else {
            setIsReady(false);
        }
    }, [numberOfPeople, selectedGame]);

    const handleGameSelect = (game: string) => {
        if (selectedGame === game) {
            setSelectedGame(null);
        } else {
            setSelectedGame(game);
        }
    };

    const goQRPage = () => {
        if (isReady === false) {
            alert('게임과 인원 수를 선택해주세요.')
        } else {
            router.push("/QRPage");
        }
    }

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
        name: '줄넘기',
        image: '/jumpRope.jpeg'
    }

    const gameList: Game[] = [drawGame, greenLightGame, jumpRope]

    return (<>
        <div className='gameSelectContainer'>
            <h1>게임 선택</h1>
            <div>
                <Box sx={{ width: '100%' }}>
                    <Grid container spacing={12}>{/* xs는 12가 최대 */}
                        {gameList.map((game) => {
                            return (
                                <Grid className='gameGrid ${}' xs={4} onClick={() => handleGameSelect(game.name)}>
                                    <div onMouseEnter={()=>onMouseEnter(game.name)}
                                        onMouseLeave={onMouseLeave} className={`gameDiv ${selectedGame === game.name ? "gameDivClicked" : ""}`}><Item>
                                            <div className={`imageDiv ${isHovering&&hoverElement===game.name ? 'imgBlur' : ''}`}><Image src={game.image} alt={game.name} layout='fill' width={0} height={0} /></div>
                                            <p className='gameTitle'>{game.name}</p>
                                        </Item></div>
                                </Grid>
                            )
                        })}

                    </Grid>
                </Box>
            </div>
            <TextField
                id="outlined-number"
                label="인원 수"
                placeholder='인원 수를 입력해주세요'
                type="number"
                value={numberOfPeople}
                onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                InputLabelProps={{
                    shrink: true,
                }}
            />
            <Button onClick={goQRPage} disabled={!isReady}>{selectedGame ? `${selectedGame} 게임 시작하기` : '게임을 선택해주세요'}</Button>
        </div>
        <style jsx>{`
            .gameSelectContainer{
                height: 100vh;
                display: flex;
                flex-direction: column;
                justify-content: space-evenly;
                align-items: center;
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
                font-size: 2vw;
                font-weight: bold;
                filter: opacity(0);
                transition: filter 0.2s ease-in-out;
                color: white;
                text-shadow: 0 0 12px rgba(0,0,0,0.5);
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
        `}</style>
    </>
    );
}
