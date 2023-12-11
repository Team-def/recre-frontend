"use client"
import { useEffect, useState } from 'react';
import { Socket } from "socket.io-client";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

interface playerInfo {
    uuid: string;
    name: string;
    distance: number;
    state: state;
    endtime: string;
    elapsed_time: number;
}

enum state {
    alive = "ALIVE",
    dead = "DEAD",
    finish = "FINISH",
}

export default function RankingBoard(
    {
        socket,
        length
    }: {
        socket: Socket;
        length: number;
    }) {

    const [playerInfo, setPlayerInfo] = useState<playerInfo[]>();
    
    useEffect(()=> {
        socket.on("players_status", (res) => {
            res.player_info.sort((a:playerInfo, b:playerInfo) => {
                if (a.distance !== b.distance) {
                    return a.distance - b.distance;
                }
                return (a.distance);
            });
            setPlayerInfo(res.playerInfo);
        });
    }, [playerInfo])
    

    return (
        <>
        <div className="ranking">
        <TableContainer component={Paper}>
                <Table sx={{  }} aria-label="simple table">
                <TableHead sx={{ backgroundColor:'antiquewhite' }}>
                  <TableRow>
                    <TableCell sx={{textAlign:'center', fontWeight:'bold'}}>순위</TableCell>
                    <TableCell sx={{textAlign:'center', fontWeight:'bold'}}>이름</TableCell>
                    <TableCell sx={{textAlign:'center', fontWeight:'bold'}}>거리</TableCell>
                    <TableCell sx={{textAlign:'center', fontWeight:'bold'}}>시간</TableCell>
                    <TableCell sx={{textAlign:'center', fontWeight:'bold'}}>상태</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                  {playerInfo?.map((player: playerInfo, index: number) => {
                    const playerFixedDistance =
                      player.distance > length ? length : player.distance;

                    return (
                      <TableRow key={`item-${index}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell
                          style={{
                            backgroundColor: index + 1 <= length ? '#ffd400' : '#f2f2f2',
                            fontWeight: index + 1 <= length ? 900 : 400,
                            color: index + 1 <= length ? 'black' : 'gray',
                            textAlign: 'center',
                          }}
                        >
                          {index + 1}등
                        </TableCell>
                        <TableCell align="right" sx={{textAlign:'center'}}>{player.name}</TableCell>
                        <TableCell align="right" sx={{textAlign:'center'}}>{playerFixedDistance}</TableCell>
                        <TableCell align="right" sx={{textAlign:'center'}}>{player.state}</TableCell>
                        </TableRow>
                    );
                  })}
                </TableBody>
                </Table>
                </TableContainer>
        </div>
        </>
    );
}