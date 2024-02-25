import Image from 'next/image';
import React from 'react';

export const SpaceShip2 = ({ size, className }) => {
    return <Image src={'/spaceship2.png'} width={size} height={size * 1.4} className={className} />;
};
