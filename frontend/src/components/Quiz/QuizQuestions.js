import React from 'react';
import { Header } from '../header';
import { Button } from '../Button';

export const QuizQuestions = ({ quiz, currentPlayer }) => {
    const currentQuestion = quiz[currentPlayer.currentQuestionIndex];
    return (
        <div className='max-w-4xl mx-auto'>
            <Header>{currentQuestion.question}</Header>
            <div className='flex-2 flex-col justify-center items-center gap-4'>
                {currentQuestion.answers.map((answer, idx) => (
                    <Button key={idx} className='w-96 m-2'>
                        {answer}
                    </Button>
                ))}
            </div>
        </div>
    );
};
