import React, { useEffect, useState } from 'react';
import { Game } from './Game';
import { QuizQuestions } from './QuizQuestions';

export const Quiz = ({ playersState, quiz, playerName, socket }) => {
    const playersStateSorted = playersState.sort((a, b) => a.id > b.id);

    const currentPlayer = playersState.find(player => player.displayName === playerName);

    return (
        <div className='flex w-full h-screen justify-center items-center'>
            <div>
                <div className='flex w-full justify-end w-3xl uppercase font-extralight'>
                    {currentPlayer.currentQuestionIndex + 1} / {quiz.length} questions
                </div>
                <Game playersState={playersStateSorted} quizLength={quiz.length} currentPlayer={currentPlayer} />
                <QuizQuestions quiz={quiz} currentPlayer={currentPlayer} socket={socket} />
            </div>
        </div>
    );
};
