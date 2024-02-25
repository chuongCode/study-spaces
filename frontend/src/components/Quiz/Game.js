import React from 'react';
import { AnimatedShip } from './AnimatedShip';

export const Game = ({ playersState, quizLength }) => {
    return (
        <div className='relative w-3xl h-[300px]'>
            {playersState.map((player, idx) => (
                <AnimatedShip
                    currentPlayerNumber={idx}
                    currentPlayerQuestionIndex={player.currentQuestionIndex}
                    key={player.id}
                />
            ))}
        </div>
    );
};
