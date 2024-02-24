import Image from 'next/image';
import React from 'react';

export const SpaceShip3 = ({ size, className }) => {
    return <Image src={'/spaceship3.png'} width={size} height={size * 1.4} className={className} />;
};
