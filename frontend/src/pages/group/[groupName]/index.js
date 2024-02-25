import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import Lobby from '@/components/Lobby';
import { Quiz } from '@/components/Quiz/Quiz';
import { useSocket } from '@/zustand/socket';
import { useUserName } from '@/zustand/store';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const GroupPage = () => {
    const [gameState, setGameState] = useState('lobby');
    const [loadingQuestionCount, setLoadingQuestionCount] = useState(0);
    const [winner, setWinner] = useState(null);
    const [tiers, setTiers] = useState(null);
    const [playersState, setPlayerState] = useState(null);
    const [quiz, setQuiz] = useState(null);
    const { username } = useUserName();
    const router = useRouter();
    const { socket } = useSocket();
    console.log('socket');
    console.log(socket);

    useEffect(() => {
        if (!username) {
            router.push('/');
        } else {
            socket.emit('joinGame', username);

            socket.on('gameEnd', () => {
                console.log('game end');
                setGameState('end');
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
        }

        return () => {
            if (socket) {
                socket.emit('leaveGame', username);
                socket.close();
            }
        };
    }, []);

    const startGame = () => {
        console.log('emit start game');
        socket?.emit('startGame');
    };

    const isQuizReady = quiz?.length > 0 && playersState;

    if (tiers) {
        return (
            <div className='flex flex-col items-center justify-center w-full h-screen'>
                <Header>{tiers} tied!</Header>
            </div>
        );
    }

    if (winner) {
        return (
            <div className='flex flex-col items-center justify-center w-full h-screen'>
                <Header>{winner} won!</Header>
            </div>
        );
    }

    if (!winner && !tiers && gameState === 'end') {
        return (
            <div className='flex flex-col items-center justify-center w-full h-screen'>
                <Header>Waiting for others to finished!</Header>
            </div>
        );
    }

    if (gameState === 'lobby') {
        return <Lobby startGame={startGame} />;
    }

    if (gameState === 'loading') {
        return (
            <div className='flex flex-col items-center justify-center w-full h-screen'>
                <Header>Creating your next mission {loadingQuestionCount * 20}%</Header>
            </div>
        );
    }
    return (
        <div>
            {gameState === 'quiz' && isQuizReady && (
                <Quiz playersState={playersState} quiz={quiz} playerName={username} socket={socket} />
            )}
        </div>
    );
};

export default GroupPage;
