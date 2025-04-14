
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '@clerk/nextjs';

export const useSocket = (): Socket | null => {
  const socketRef = useRef<Socket | null>(null);
  const {getToken} = useAuth()
  let token:string;
  const gettoken = async () => {
    const token = await getToken()
    return token
  }
  useEffect(() => {
    gettoken().then(token=>{
      // Initialize socket connection
      socketRef.current = io(process.env.NEXT_PUBLIC_WS_URL!, {
        transports: ['websocket'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        auth: {
          token: token
        }
      });
    })

    // Socket event listeners
    socketRef?.current?.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socketRef?.current?.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    socketRef?.current?.on('message', (message) => {
      console.log('Received message:', message);
    });

    

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return socketRef.current;
}; 