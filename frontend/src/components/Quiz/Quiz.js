import React, { useState } from 'react';
import { Game } from './Game';
import { QuizQuestions } from './QuizQuestions';

const QUIZ_QUESTION = [
    { id: '1', quizId: '1', question: 'hi', answers: ['hi', 'hi2', 'hi3', 'hi4'], correctAnswerIndex: 0 },
    { id: '1', quizId: '1', question: 'hi', answers: ['hi', 'hi2', 'hi3', 'hi4'], correctAnswerIndex: 0 },
    { id: '1', quizId: '1', question: 'hi', answers: ['hi', 'hi2', 'hi3', 'hi4'], correctAnswerIndex: 0 },
    { id: '1', quizId: '1', question: 'hi', answers: ['hi', 'hi2', 'hi3', 'hi4'], correctAnswerIndex: 0 },
    { id: '1', quizId: '1', question: 'hi', answers: ['hi', 'hi2', 'hi3', 'hi4'], correctAnswerIndex: 0 },
];

const PlayerState = [
    {
        id: 1,
        displayName: 'Kayla',
        point: 0,
        currentQuestionIndex: 0,
    },
    {
        id: 2,
        displayName: 'Kayla',
        point: 0,
        currentQuestionIndex: 0,
    },
    {
        id: 3,
        displayName: 'Kayla',
        point: 0,
        currentQuestionIndex: 0,
    },
    {
        id: 4,
        displayName: 'Kayla',
        point: 0,
        currentQuestionIndex: 0,
    },
    {
        id: 5,
        displayName: 'Kayla',
        point: 0,
        currentQuestionIndex: 0,
    },
];

export const Quiz = () => {
    const [playersState, setPlayersState] = useState(PlayerState);
    const playersStateSorted = playersState.sort((a, b) => a.id > b.id);

    const currentPlayerId = 1;
    const currentPlayer = playersState.find(player => player.id === currentPlayerId);

    const moveCurrentPlayer = () => {
        setPlayersState(prev => {
            return prev.map(player => {
                if (player.id === currentPlayer.id) {
                    return {
                        ...player,
                        currentQuestionIndex: player.currentQuestionIndex + 1,
                    };
                }
                return player;
            });
        });
    };

    return (
        <div className='flex w-full h-screen justify-center items-center'>
            <div>
                <div className='flex w-full justify-end max-w-3xl uppercase font-extralight'>
                    {currentPlayer.currentQuestionIndex + 1} / {QUIZ_QUESTION.length} questions
                </div>
                <Game playersState={playersStateSorted} quizLength={QUIZ_QUESTION.length} />
                <QuizQuestions quiz={QUIZ_QUESTION} currentPlayer={currentPlayer} />
                <button onClick={moveCurrentPlayer}>test</button>
            </div>
        </div>
    );
};
