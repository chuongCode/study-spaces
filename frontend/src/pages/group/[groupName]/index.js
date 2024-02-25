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
    const [loadingQuestionCount, setLoadingQuestionCount] = useState(0);
    const [winner, setWinner] = useState(null);
    const [tiers, setTiers] = useState(null);
    const [playersState, setPlayerState] = useState(null);
    const [quiz, setQuiz] = useState(null);

    useEffect(() => {
        socket.emit('joinGame', testName);

        socket.on('gameEnd', name => {
            if (name === testName) {
                setGameState('end');
            }
        });

        socket.on('gameTie', name => {
            setTiers(name);
        });

        socket.on('gameWon', name => {
            setWinner(name);
        });

        socket.on('loadingGame', number => {
            setLoadingQuestionCount(number);
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
            socket.close();
        };
    }, []);

    const startGame = () => {
        socket.emit('startGame');
    };

    const isQuizReady = quiz?.length > 0 && playersState;

    if (gameState === 'end') {
        return (
            <div className='w-full h-screen flex flex-col justify-center items-center'>
                <Header>{tiers}Waiting for others to finished</Header>
            </div>
        );
    }

    if (tiers) {
        return (
            <div className='w-full h-screen flex flex-col justify-center items-center'>
                <Header>{tiers} tied!</Header>
            </div>
        );
    }

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
                    <Header>Creating your next mission {loadingQuestionCount * 20}%</Header>
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
