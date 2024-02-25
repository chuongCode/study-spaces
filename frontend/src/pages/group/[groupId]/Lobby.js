import React from 'react';
import PlayerCard from '@/components/PlayerCard';

const Lobby = () => {
    const name = 'John Smith';
    const numPlayers = 2;

    return (
        <div class='flex flex-col h-screen items-center'>
            <div class='flex justify-between w-full px-20 py-10'>
                <div>
                    <h1 style={{ letterSpacing: '0.5rem' }} class='text-4xl font-extralight'>
                        {name}'s Study Space
                    </h1>
                    {numPlayers > 1 ? (
                        <h2 class='text-2xl font-extralight'>{numPlayers}/5 Players</h2>
                    ) : (
                        <h2 class='text-2xl font-extralight'>{numPlayers}/5 Player</h2>
                    )}
                </div>
                <div class='flex items-center gap-10'>
                    <button class='text-xl border-2 rounded p-5'>UPLOAD PDF</button>
                    <p class='text-xl'>PDF(s) READY</p>
                </div>
            </div>

            <div class='flex w-full justify-between px-20'>
                <PlayerCard />
                <PlayerCard />
                <PlayerCard />
                <PlayerCard />
                <PlayerCard />
            </div>
            <div class='flex text-3xl justify-between w-full px-20 py-10'>
                <button class='border-solid border-2 rounded p-5 font-extralight'>START LIFTOFF</button>
                <button class='border-solid border-2 rounded p-5 font-extralight border-red-500 text-red-500'>
                    LEAVE STUDY SPACE
                </button>
            </div>
        </div>
    );
};

export default Lobby;
