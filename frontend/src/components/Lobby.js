import React, { useState } from 'react';
import { UploadPDF } from '@/components/UploadPDF';
import PlayerCard from '@/components/PlayerCard';
import { useRouter } from 'next/router';
import useStore from '@/zustand/store'; 

//import store

const Lobby = () => {
    const partyLeader = useStore(state => state.username);
    const numPlayers = 2;
    const [isReady, setIsReady] = useState(false);
    const { groupname, groupId } = useRouter().query; // Get the groupId from the URL
    const spaceName = groupname; 

    return (
        <div className='w-[1200px] mx-auto  max-h-screen'>
            <div className='flex flex-col items-center'>
                <div className='flex justify-between w-full px-20 py-10'>
                    <div>
                        <h1 style={{ letterSpacing: '0.5rem' }} className='text-4xl font-extralight'>
                            {partyLeader}'s Study Space
                        </h1>
                        {numPlayers > 1 ? (
                            <h2 className='text-2xl font-extralight'>{numPlayers}/5 Players</h2>
                        ) : (
                            <h2 className='text-2xl font-extralight'>{numPlayers}/5 Player</h2>
                        )}
                    </div>
                    <div className='flex items-center gap-5'>
                        {/* <button className='p-5 text-xl border-2 rounded'>UPLOAD PDF</button> */}
                        <UploadPDF groupId={groupId} />
                        {isReady ? (
                            <p className='text-xl text-green-500'>PDF(s) READY?</p>
                        ) : (
                            <p className='text-xl text-red-500'>PDF(s) READY?</p>
                        )}
                    </div>
                </div>
                <div className='flex justify-between w-full gap-2'>
                    <PlayerCard />
                    <PlayerCard />
                    <PlayerCard />
                </div>
                <div className='flex justify-between w-full px-20 py-10 text-3xl'>
                    <button className='w-1/4 p-5 text-xl border-2 border-solid rounded font-extralight'>
                        START LIFTOFF
                    </button>
                    <button className='w-1/4 p-5 text-xl text-red-500 border-2 border-red-500 border-solid rounded font-extralight'>
                        LEAVE STUDY SPACE
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Lobby;
