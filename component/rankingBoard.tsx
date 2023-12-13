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

    socket.on("players_status", (res: { player_info: playerInfo[] }) => {
        const sortedFilteredPlayerInfo = 
        res.player_info.sort((a:playerInfo, b:playerInfo) => {
            if (a.distance !== b.distance) {
                return b.distance - a.distance;
            }
            return (b.distance);
        }).filter((value, index, arr) => {
            return index < 5;
        });
        setPlayerInfo(sortedFilteredPlayerInfo);
    });

    const stateToEmoji = (state: state) => {
      if (state === 'ALIVE') {
          return "🦑";
        } else if (state === 'DEAD') {
          return "💀";
        } else if (state === 'FINISH') {
          return "🥳";
        }
    }

    return (
        <>
        <div className="ranking">
        <TableContainer component={Paper} sx={{ backgroundColor: 'transparent',fontFamily: 'myfont'}}>
                <Table sx={{  }} aria-label="simple table">
                <TableHead sx={{ backgroundColor:'#fffaebd7' }}>
                  <TableRow>
                    <TableCell sx={{textAlign:'center', fontWeight:'bold',fontFamily: 'myfont'}}>순위</TableCell>
                    <TableCell sx={{textAlign:'center', fontWeight:'bold',fontFamily: 'myfont'}}>이름</TableCell>
                    <TableCell sx={{textAlign:'center', fontWeight:'bold',fontFamily: 'myfont'}}>거리</TableCell>
                    <TableCell sx={{textAlign:'center', fontWeight:'bold',fontFamily: 'myfont'}}>상태</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                  {playerInfo?.map((player: playerInfo, index: number) => {
                    const playerFixedDistance =
                      player.distance > length ? length : player.distance;

                    return (
                      <TableRow key={`item-${index}`} sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: 'rgb(250, 249, 246, 0.8)'}}>
                        <TableCell
                          style={{
                            backgroundColor: index + 1 <= length ? 'rgba(245, 233, 86, 0.8)' : 'rgba(250, 249, 246, 0.8)',
                            fontWeight: index + 1 <= length ? 900 : 400,
                            color: index + 1 <= length ? 'black' : 'gray',
                            textAlign: 'center',
                            fontFamily: 'myfont'
                          }}
                        >
                          {index + 1}
                        </TableCell>
                        <TableCell align="right" sx={{textAlign:'center',fontFamily: 'myfont'}}>{player.name}</TableCell>
                        <TableCell align="right" sx={{textAlign:'center',fontFamily: 'myfont'}}>{playerFixedDistance}</TableCell>
                        <TableCell align="right" sx={{textAlign:'center',fontFamily: 'myfont'}}>{stateToEmoji(player.state)}</TableCell>
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