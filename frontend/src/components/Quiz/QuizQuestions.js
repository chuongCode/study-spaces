import React from 'react';

export const QuizQuestions = ({ quiz, currentPlayer }) => {
    const currentQuestion = quiz[currentPlayer.currentQuestionIndex];
    return (
        <div>
            <h1 className='uppercase'>{currentQuestion.question}</h1>
            <ul>
                {currentQuestion.answers.map(answer => (
                    <li>answer</li>
                ))}
            </ul>
        </div>
    );
};
