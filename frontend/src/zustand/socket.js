import React, { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';

// Create a context for the socket
const SocketContext = createContext();

// Custom hook to access the socket context
export const useSocket = () => useContext(SocketContext);

// Socket provider component
export const SocketProvider = ({ url, options, children }) => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Create the socket connection
        const newSocket = io('http://localhost:3005');
        if (!newSocket.connected) {
            newSocket.connect();
        }
        // Set the socket in the state
        setSocket(newSocket);

        // Clean up the socket connection when component unmounts
        return () => newSocket.close();
    }, [url, options]);

    return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};
