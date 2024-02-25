import React from 'react';
import { SpaceShip1 } from './SpaceShip1';

const PlayerCard = ({ playerName }) => {
    return (
        <div className='flex flex-col items-center justify-center p-5 h-[400px]   border-2 border-solid rounded'>
            <div style={{ opacity: playerName ? '100%' : '30%' }}>
                <SpaceShip1 size={300} className='rotate-[50deg] relative left-[50px]' />
            </div>
            {playerName ? (
                <h2 className='text-2xl font-extralight uppercase'>{playerName}</h2>
            ) : (
                <h2 className='text-lg font-extralight bg-white text-black uppercase px-4 py-2'>Invite Friend</h2>
            )}
        </div>
    );
};

export default PlayerCard;
