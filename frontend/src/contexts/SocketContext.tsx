'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { io, Socket } from 'socket.io-client';
import { ArbitrageOpportunity } from '@/types';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:5000';

interface SocketContextType {
  socket: Socket | null;
  connected: boolean;
  opportunities: ArbitrageOpportunity[];
  subscribeToOpportunities: () => void;
  unsubscribeFromOpportunities: () => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [opportunities, setOpportunities] = useState<ArbitrageOpportunity[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    const socketInstance = io(WS_URL, {
      auth: {
        token: token || '',
      },
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      console.log('Socket connected:', socketInstance.id);
      setConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket disconnected');
      setConnected(false);
    });

    socketInstance.on('opportunities:update', (data: { data: ArbitrageOpportunity[] }) => {
      setOpportunities(data.data);
    });

    socketInstance.on('trade:update', (data: any) => {
      console.log('Trade update:', data);
    });

    socketInstance.on('alert:notification', (data: any) => {
      console.log('Alert:', data);
    });

    socketInstance.on('system:message', (data: any) => {
      console.log('System message:', data);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const subscribeToOpportunities = () => {
    if (socket && connected) {
      socket.emit('subscribe:opportunities', {});
    }
  };

  const unsubscribeFromOpportunities = () => {
    if (socket && connected) {
      socket.emit('unsubscribe:opportunities');
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connected,
        opportunities,
        subscribeToOpportunities,
        unsubscribeFromOpportunities,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
}
