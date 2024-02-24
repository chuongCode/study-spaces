import Image from 'next/image';
import React from 'react';

export const SpaceShip1 = ({ size, className }) => {
    return <Image src={'/spaceship1.png'} width={size} height={size * 1.4} className={className} />;
};
