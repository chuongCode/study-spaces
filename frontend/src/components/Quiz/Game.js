import React from 'react';
import { AnimatedShip } from './AnimatedShip';

export const Game = ({ playersState, quizLength }) => {
    return (
        <div className='relative w-3xl h-[300px] flex flex-col gap-20'>
            {playersState.map((player, idx) => (
                <AnimatedShip
                    name={player?.displayName ?? 'test'}
                    currentPlayerNumber={idx}
                    score={player?.point}
                    currentPlayerQuestionIndex={player.currentQuestionIndex}
                    key={player.id}
                />
            ))}
        </div>
    );
};
