import React from 'react';
import { Button } from '../Button';
import { Header } from '../Header';

export const QuizQuestions = ({ quiz, currentPlayer, socket }) => {
    const index = currentPlayer.currentQuestionIndex ?? 0;
    console.log(quiz[index]?.correctAnswerIndex);

    const answerQuestion = isCorrect => {
        socket.emit('answer', {
            name: currentPlayer.displayName,
            isCorrect,
        });
    };

    return (
        <div className='max-w-4xl mx-auto h-[300px]'>
            <h1 className='uppercase tracking-widest text-xl font-extralight pb-8' style={{ letterSpacing: '0.5rem' }}>
                {quiz[index]?.question} ({quiz[index]?.correctAnswerIndex})
            </h1>
            <div className='flex-1 flex-col justify-center items-center gap-4'>
                {quiz[index]?.answers.map((answer, idx) => (
                    <Button
                        key={idx}
                        className='w-full m-2'
                        onClick={() => {
                            answerQuestion(idx === quiz[index]?.correctAnswerIndex);
                        }}>
                        {answer}
                    </Button>
                ))}
            </div>
        </div>
    );
};
