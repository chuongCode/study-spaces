import React, { useEffect } from 'react';
import { SpaceShip1 } from '../SpaceShip1';
import { useAnimate } from 'framer-motion';

export const AnimatedShip = ({ name, score, currentPlayerQuestionIndex, currentPlayerNumber }) => {
    const [scope, animate] = useAnimate();
    console.log(name);
    useEffect(() => {
        const animateShip = async () => {
            await animate(scope.current, { x: currentPlayerQuestionIndex * 200 });
        };
        animateShip();
    }, [currentPlayerQuestionIndex]);
    return (
        <div
            className={`flex flex-col gap-10 justify-center absolute left-0`}
            style={{ top: `${currentPlayerNumber * 55}px` }}
            ref={scope}>
            <div className='relative'>
                <SpaceShip1 size={100} className='rotate-[140deg]' />
                <h3 className='absolute right-4 bottom-2'>
                    {name} ({score})
                </h3>
            </div>
        </div>
    );
};
