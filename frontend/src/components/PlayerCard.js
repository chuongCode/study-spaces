import React from 'react';
import { SpaceShip1 } from './SpaceShip1';

const PlayerCard = ({ playerName }) => {
    playerName = 'john smith';
    return (
        <div
            style={{ height: '651px' }}
            className='flex flex-col items-center justify-center w-1/3 gap-10 border-2 border-solid rounded'>
            <SpaceShip1 size={200000000000} className='rotate-[90deg]' />
            <h2 className='text-2xl font-extralight'>{playerName}</h2>
        </div>
    );
};

export default PlayerCard;
