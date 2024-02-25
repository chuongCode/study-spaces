import React, { useEffect, useState } from 'react';
import { Game } from './Game';
import { QuizQuestions } from './QuizQuestions';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3005');

export const Quiz = ({ playersState, quiz, playerName }) => {
    const playersStateSorted = playersState.sort((a, b) => a.id > b.id);

    useEffect(() => {}, []);

    const currentPlayer = playersState.find(player => player.displayName === playerName);
    console.log('currentPlayer');
    console.log(currentPlayer);

    const moveCurrentPlayer = () => {
        setPlayersState(prev => {
            return prev.map(player => {
                if (player.displayName === currentPlayer.displayName) {
                    return {
                        ...player,
                        currentQuestionIndex: player.currentQuestionIndex + 1,
                    };
                }
                return player;
            });
        });
    };

    console.log('quiz from quiz');
    console.log(quiz);

    return (
        <div className='flex w-full h-screen justify-center items-center'>
            <div>
                <div className='flex w-full justify-end max-w-3xl uppercase font-extralight'>
                    {currentPlayer.currentQuestionIndex + 1} / {quiz.length} questions
                </div>
                <Game playersState={playersStateSorted} quizLength={quiz.length} />
                <QuizQuestions quiz={quiz} currentPlayer={currentPlayer} />
                <button onClick={moveCurrentPlayer}>test</button>
            </div>
        </div>
    );
};
