import React from 'react';
import { Button } from '../Button';
import { Header } from '../Header';

export const QuizQuestions = ({ quiz, currentPlayer, socket }) => {
    const index = currentPlayer.currentQuestionIndex ?? 0;

    const answerQuestion = isCorrect => {
        socket.emit('answer', {
            name: currentPlayer.displayName,
            isCorrect,
        });
    };

    return (
        <div className='max-w-4xl mx-auto'>
            <Header>{quiz[index]?.question}</Header>
            <div className='flex-1 flex-col justify-center items-center gap-4'>
                {quiz[index]?.answers.map((answer, idx) => (
                    <Button
                        key={idx}
                        className='w-full m-2'
                        onClick={() => {
                            answerQuestion(idx === currentPlayer.correctAnswerIndex);
                        }}>
                        {answer}
                    </Button>
                ))}
            </div>
        </div>
    );
};
