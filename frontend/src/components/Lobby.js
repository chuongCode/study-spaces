import React, { useEffect, useState } from 'react';
import { UploadPDF } from '@/components/UploadPDF';
import PlayerCard from '@/components/PlayerCard';
import { useRouter } from 'next/router';
import { useSocket } from '@/zustand/socket';
import { Button } from './Button';

//import store

const Lobby = ({ startGame }) => {
    const { groupId } = useRouter().query; // Get the groupId from the URL
    const { socket } = useSocket();
    const [playersState, setPlayersState] = useState(null);

    useEffect(() => {
        if (socket) {
            socket.on('lobby', playersState => {
                setPlayersState(playersState);
            });
        }
    }, [socket]);

    return (
        <div className='mx-auto max-w-[1000px] max-h-screen'>
            <div className='flex flex-col gap-5 items-center'>
                <div className='flex justify-between h-full w-full py-10 '>
                    <div>
                        <h1 style={{ letterSpacing: '0.5rem' }} className='text-4xl font-extraligh uppercase'>
                            Study Space
                        </h1>
                    </div>
                    <div className='flex items-center gap-2'>
                        <UploadPDF groupId={groupId} />
                    </div>
                </div>
                <div className='flex justify-between pt-10 min-h-2.5 w-full gap-6 '>
                    {Array.from({ length: 3 })?.map((_, idx) => {
                        const player = playersState?.at(idx);
                        if (player) {
                            return <PlayerCard idx={idx} playerName={player.displayName} key={idx} />;
                        }
                        return <PlayerCard idx={idx} key={idx} />;
                    })}
                </div>
                <div className=' flex justify-center w-full px-20 py-5 uppercase'>
                    <Button onClick={startGame}>Start Lift off</Button>
                </div>
            </div>
        </div>
    );
};

export default Lobby;
