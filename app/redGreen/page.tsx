"use client";
import { useAtom } from 'jotai';
import { Socket } from 'socket.io-client';
import { userInfoAtoms } from '../modules/userInfoAtom';
import { tokenAtoms } from '../modules/tokenAtoms';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { green } from '@mui/material/colors';
import MyModal from '@/component/MyModal';
import { redGreenStartAtom } from '../modules/redGreenStartAtom';
import { redGreenInfoAtom } from '../modules/redGreenAtoms';

export default function RedGreen({socket}: {socket : Socket}) {
    const [userInfo,] = useAtom(userInfoAtoms)
    const [acc_token,] = useAtom(tokenAtoms)
    const router = useRouter();
    const [openModal, setOpenModal] = useState(false);
    const [modalHeader, setModalHeader] = useState<string>('');
    const [modalContent, setModalContent] = useState<JSX.Element>(<></>);
    const [counter, setCounter] = useState<number>(3);
    const [gameInfo, setGameInfo] = useAtom(redGreenInfoAtom);
    const [isReady, setIsReady] = useAtom(redGreenStartAtom);
    const [isStart,setIsStart] = useState<boolean>(false);
    const [percentVar, setPercentVar] = useState<number>(0);

    enum state {
      alive = 'ALIVE',
      dead = 'DEAD',
      finish = 'FINISH',
    }

    const [playerInfo, setPlayerInfo] = useState<playerInfo[]>([{
      name: '',
      distance: 0,
      state: state.alive,
    }]);
    const [go,setGo] = useState(false);

    interface playerInfo {
        name: string,
        distance: number,
        state : state,
    }

    interface winnerInfo { 
      name: string,
      score: number,
    }

    useEffect(() => {
        socket.on('players_status', (res) => {

          console.log(res.player_info)
          if(res.player_info){
            setPlayerInfo(res.player_info.filter((player: playerInfo) => player.state === state.alive));
          }
        });

        setModalHeader('곧 게임이 시작됩니다!');
        setModalContent(<CounterModal/>);

        switch(gameInfo[1]){
          case 50:
            setPercentVar(2);
            break;
          case 100:
            setPercentVar(1);
            break;
          case 160:
            setPercentVar(0.625);
            break;
        }


        socket.on('game_finished', (res) => {
          setOpenModal(true);
          setModalHeader('우승자 목록');
          setModalContent(<FinishedModal winners={res.winners}/>);
            // setWinners(res.winners);
            console.log(res.winners);
            setIsStart(false);
        });

        socket.on("start_game", (response) => {
          // console.log(response)
          setOpenModal(false);
          setGo(true);
          setIsStart(true)
      });

        return () => { 
            handleBeforeUnload();
        };
    }, [])

    useEffect(() => {
      console.log(isReady);
      if(isReady){
        setOpenModal(true);
        let timer = setInterval(() => {
          // setCounter(prev => prev - 1);
        }, 1000)
        
        setTimeout(() => {  
          clearInterval(timer);
          socket.emit('start_game', {  
            result : true
          })
          setIsReady(false)
          console.log('game start')
        }, 3000)
      }
    },[isReady])


    useEffect(() => {
      if(isStart){
        if(go){
          socket.emit('resume', {
            result : go
          });
        } else {
          socket.emit('stop', {
            result : go
          });
        }
      }
    },[go])

    const handleBeforeUnload = () => {
        socket.emit('end_game', {
          result : true
        });
        socket.disconnect();
        setIsStart(false)
    };

    const leaveGame = () => {
        if(isStart){
    
          if(confirm("게임을 나가시겠습니까?")){
            setIsStart(false);
            socket.emit('end_game',{
              result : true
            });
    
            socket.emit('leave_game',{
            });
            socket.disconnect();
            setIsStart(false)
            router.push('/gameSelect');
          }
    
        } else {
          setIsStart(false);
          socket.emit('end_game',{
            result : true
          });
    
          socket.emit('leave_game',{
          });
          socket.disconnect();
          setIsStart(false)
          router.push('/gameSelect');
        }
      }

      const CounterModal = () => {
        return(
          <div>{counter}</div>
        )
      }

      const stopGame = () => {  
        socket.emit('game_finished', {
        });
      }

      const FinishedModal = ({winners}:{winners : winnerInfo[]}) => {
        return (
          <div>
            <div className="winnerInfo">
              <div className="modalText">
                {winners.map((winner, index) => {
                  return (
                    <div key={index}>
                      <div className="winners">{winner.name} : {winner.score}걸음</div>
                    </div>
                  )
                })}
              </div>
            </div>
            <Button onClick={leaveGame}>게임 끝내기</Button>
          </div>
        )
      }

      const colorArr = ['red', 'green', 'blue', 'yellow', 'purple', 'orange', 'pink', 'brown', 'black', 'magenta', 'cyan', 'lime'];
    
      return (
        <>
          <div className='redGreenContainer'>
            <div>
              <div className='signalDiv' style={{backgroundColor:go?'green':'red'}} onClick={()=>setGo(!go)}></div>
            </div>
            <div className='gameContainer' style={{borderLeft:`50px solid ${go?'green':'red'}`, borderRight:`50px solid ${go?'green':'red'}`
          ,borderTop:`20px solid ${go?'green':'red'}`, borderBottom:`20px solid ${go?'green':'red'}`}}>
              {playerInfo.map((player, index) => {
                let colorIndex = index % colorArr.length;
                return (
                  <div key={index} className='playerDiv'>
                    <div className='distanceBar' style={{width:player.distance*percentVar + `%`, backgroundColor: colorArr[colorIndex]}}></div>
                    <div className='playerInfo'>{player.name} : {player.distance} / {gameInfo[1]}</div>
                  </div>
                )
              })}
            </div>
            <div className='redGreenBtns'>
            <Button onClick={()=>{leaveGame()}}>게임 나가기</Button>
            <Button onClick={()=>{stopGame()}}>우승자 마감</Button>
            </div>
            <MyModal open={openModal} modalHeader={modalHeader} modalContent={modalContent} closeFunc={()=>{}} myref={null}/>
          </div>
          <style jsx>{`
            .redGreenContainer{
              height: 100vh;
              display: flex;
              justify-content: space-evenly;
              align-items: center;
              flex-direction: column;
              white-space: nowrap; 
              text-overflow: ellipsis;
            }

            .gameContainer{
              width:700px;
              height: 500px;
              border: 1px solid black;
              margin: 0 auto;
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
            }

            .playerDiv{
              width: 100%;
              height: 100%;
              border: 1px solid black;
              display: flex;
              justify-content: flex-start;
              align-items: center;
              border-collapse: collapse;
            }

            .playerInfo{
              width: 700px;
              font-size: 30px;
              font-weight: bold;
              color: rgb(150, 150, 150, 0.9);
              position: absolute;
              text-align: center;
            }

            .distanceBar{
              height: 100%;
              background-color: brown;
            }

            .signalDiv{
              width:120px;
              height:40px;
              border: 10px solid black;
              border-radius: 50px;
              cursor: pointer;
            }

            .signalDiv:hover{
              border: 10px solid gray;
            }

            .winners{
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .redGreenBtns{
              display: flex;
              justify-content: space-evenly;
              align-items: center;
              flex-direction: row;
            }
          `}</style>
        </>
      );

}
