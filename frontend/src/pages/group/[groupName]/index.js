import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import Lobby from '@/components/Lobby';
import { Quiz } from '@/components/Quiz/Quiz';
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3005');

const testName = 'kayla';

const GroupPage = () => {
    const [gameState, setGameState] = useState('lobby');
    const [winner, setWinner] = useState(null);
    const [playersState, setPlayerState] = useState(null);
    const [quiz, setQuiz] = useState(null);

    useEffect(() => {
        socket.emit('joinGame', testName);

        socket.on('gameWon', name => {
            setWinner(name);
        });

        socket.on('loadingGame', () => {
            setGameState('loading');
        });

        socket.on('gameUpdate', data => {
            console.log('game update');
            setPlayerState(data);
        });

        socket.on('initialGameData', data => {
            setGameState('quiz');
            if (data) {
                setPlayerState(data.createPlayerData);
                setQuiz(data.questions);
            } else {
            }
        });

        return () => {
            socket.emit('leaveGame', testName);
        };
    }, []);

    const startGame = () => {
        socket.emit('startGame');
    };

    const isQuizReady = quiz?.length > 0 && playersState;

    if (winner) {
        return (
            <div className='w-full h-screen flex flex-col justify-center items-center'>
                <Header>{winner} won!</Header>
            </div>
        );
    }

    return (
        <div>
            {gameState === 'lobby' && <Lobby />}
            {gameState === 'loading' && (
                <div className='w-full h-screen flex flex-col justify-center items-center'>
                    <Header>Creating your next mission</Header>
                </div>
            )}
            {gameState === 'quiz' && isQuizReady && (
                <Quiz playersState={playersState} quiz={quiz} playerName={testName} socket={socket} />
            )}
            <Button onClick={startGame}>Start Game</Button>
        </div>
    );
};

export default GroupPage;
