import React, { useEffect, useState } from 'react';
import { Header } from './Header';
import Confetti from 'react-confetti';
import { Button } from './Button';
import Link from 'next/link';

export const WinScreen = ({ children }) => {
    return (
        <div className='flex flex-col items-center justify-center w-full h-screen'>
            <Header>{children}</Header>
            <Link href='/'>
                <Button>Leave Game</Button>
            </Link>
            <Confetti />
        </div>
    );
};
