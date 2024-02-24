import { useEffect } from 'react';  
import { useState } from 'react';
import { io } from "socket.io-client";

let socket;

const JoinRoomButton = ({ room }) => {
  const [socket, setSocket] = useState(null);
  
  useEffect(() => {
    const socket = io("http://localhost:3005"); // replace with your server URL
    setSocket(socket);
    return () => {
      socket.disconnect();
    };
  }, []);

  const joinRoom = () => {
    if (socket) {
        console.log('click')
        socket.emit('join-room', room);
    }
    
  };

  return (
    <button onClick={joinRoom}>
      Join Room
    </button>
  );
};

export default JoinRoomButton;