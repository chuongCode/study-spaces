import React from 'react';
import { SpaceShip1 } from '../SpaceShip1';

export const Game = ({ playersState, quizLength }) => {
    return (
        <div>
            {playersState.map(player => (
                <div key={player.id} className='flex gap-10 justify-center'>
                    {Array.from({ length: quizLength }).map((board, idx) => {
                        if (idx === player.currentQuestionIndex) {
                            return <SpaceShip1 size={50} className='rotate-[120deg]' />;
                        }
                        return <div className='w-24 h-24' />;
                    })}
                </div>
            ))}
        </div>
    );
};
