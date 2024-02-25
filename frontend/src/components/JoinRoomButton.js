import { useEffect } from 'react';
import { useState } from 'react';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3005', {
    autoConnect: false,
});

const JoinRoomButton = ({ room }) => {
    const connectSocket = () => {
        socket.connect();
    };

    const joinRoom = () => {
        if (socket.connected) {
            console.log('socket connected call');
        } else {
            console.log('socket not connected');
        }
        if (socket) {
            console.log('click');
            socket.emit('join-room', room);
            socket.emit('start-game', 1);
        }
    };

    return (
        <>
            <button onClick={connectSocket}>connect socket</button>

            <button onClick={joinRoom}>Join Room</button>
        </>
    );
};

export default JoinRoomButton;
