import Image from 'next/image';
import React from 'react';

export const SpaceShip1 = ({ size, className, name }) => {
    return (
        <div className='flex flex-col'>
            <Image src={'/spaceship3.png'} width={size} height={size * 1.4} className={className} />
            {name && <h1 className='text-white'>{name}</h1>}
        </div>
    );
};
