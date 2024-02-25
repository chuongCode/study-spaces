import React from 'react';
import { SpaceShip1 } from './SpaceShip1';

const PlayerCard = ({ playerName }) => {
    playerName = 'john smith';
    return (
        <div
            className='flex flex-col items-center justify-center p-5 h-[400px]   border-2 border-solid rounded'>
            <SpaceShip1 size={300} className='rotate-[50deg] ' />
            <h2 className='text-2xl font-extralight'>{playerName}</h2>
        </div>
    );
};

export default PlayerCard;
