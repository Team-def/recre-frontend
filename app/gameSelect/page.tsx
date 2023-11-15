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
    const [isLogin,] = useAtom(loginAtom)
    const [numberOfPeople, setNumberOfPeople] = useState<number | null>(null);
    const [isReady, setIsReady] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (!isLogin) {
            alert('로그인이 필요합니다.')
            router.push("/")
        }
    },[]);

    useEffect(() => {
        if (numberOfPeople && numberOfPeople > 0 && selectedGame) {
            setIsReady(true);
        }
        else {
            setIsReady(false);
        }
    }, [numberOfPeople,selectedGame]);

    const handleGameSelect = (game: string) => {
        if (selectedGame === game) {
            setSelectedGame(null);
        } else {
            setSelectedGame(game);
        }
    };

    return (<>
        <div className='gameSelectContainer'>
            <h1>게임 선택</h1>
            <div>
                <Box sx={{ width: '100%' }}>
                    <Grid container spacing={12}>
                        {/* xs는 12가 최대 */}
                        <Grid className='gameGrid ${}' xs={4} onClick={() => handleGameSelect(`'그림 맞추기'`)}>
                                <div className={`gameDiv ${selectedGame === "'그림 맞추기'" ? "gameDivClicked" : ""}`}><Item>
                                    {/* {selectedGame === '게임 1' ? '선택 해제' : '게임 1 선택'} */}
                                    <Image src='/drawGame.jpeg' alt='그림 맞추기' layout='fill' width={0} height={0}/>
                                    <p className='gameTitle'>그림 맞추기</p>
                                    </Item></div>
                        </Grid>
                        <Grid className='gameGrid' xs={4} onClick={() => handleGameSelect(`'무궁화 꽃이 피었습니다'`)}>
                            <div className={`gameDiv ${selectedGame === "'무궁화 꽃이 피었습니다'" ? "gameDivClicked" : ""}`}><Item>
                                {/* {selectedGame === '게임 2' ? '선택 해제' : '게임 2 선택'} */}
                                <Image src='/greenLightGame.png' alt='무궁화 꽃이 피었습니다' layout='fill' width={0} height={0}/>
                                <p className='gameTitle'>무궁화 꽃이 피었습니다</p>
                                </Item></div>
                        </Grid>
                        <Grid className='gameGrid' xs={4} onClick={() => handleGameSelect(`'줄넘기'`)}>
                        <div className={`gameDiv ${selectedGame === "'줄넘기'" ? "gameDivClicked" : ""}`}><Item>
                            {/* {selectedGame === '게임 3' ? '선택 해제' : '게임 3 선택'} */}
                            <Image src='/jumpRope.jpeg' alt='줄넘기' layout='fill' width={0} height={0}/>
                            <p className='gameTitle'>줄넘기</p>
                            </Item></div>
                        </Grid>
                    </Grid>
                </Box>
            </div>
            <TextField
          id="outlined-number"
          label="인원 수"
          placeholder='인원 수를 입력해주세요'
          type="number"
          value={numberOfPeople}
          onChange={(e) => setNumberOfPeople(e.target.value as unknown as number)}
          InputLabelProps={{
            shrink: true,
          }}
        />
            <Button disabled={!isReady}>{selectedGame ? `${selectedGame} 게임 시작하기` : '게임을 선택해주세요'}</Button>
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
                width:10vw;
                height:10vw;
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
            }
            .gameDiv:hover{
                scale: 1.05;
                border: 5px solid red;
            }
            .gameDivClicked{
                scale: 1.05;
                border: 5px solid #ff7878;
            }
            .gameTitle{
                z-index: 3;
                position: relative;
                font-size: 1.5vw;
                font-weight: bold;
                filter: blur(1rem);
                transition: filter 0.2s ease-in-out;
            }
            .gameDiv:hover .gameTitle{
                filter: blur(0);
            }
            Image{
                z-index:1;
                filter: blur(0);
                transition: filter 0.2s ease-in-out;
            }
            .gameDiv:hover Image{
                filter: blur(1rem);
            }
        `}</style>
    </>
    );
}
