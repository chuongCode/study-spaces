import React from 'react';
import { SpaceShip1 } from './SpaceShip1';
import { spaceShip } from './../../public/spaceship1.png';

const PlayerCard = () => {
    const playerName = 'John Smith';
    return (
        <div
            style={{ height: '651px' }}
            class='flex flex-col gap-10 justify-center items-center w-60 border-solid border-2 rounded'>
            <img src='./../../public/spaceship1.png' />
            <h2>{playerName}</h2>
        </div>
    );
};

export default PlayerCard;
