import React, { ReactNode, createContext, useContext } from 'react';

import { useWebSocket } from '@/lib/useWebSocket';
import { MessagePayload, sendMessageWrapper } from '@/lib/utils';

interface WebSocketContextType {
  isConnected: boolean;
  isWsConnected: boolean;
  sendMessage: (message: MessagePayload) => void;
  connectWebSocket: () => void;
  currentIp: string | null;
  log: string | null;
  requiresManualInput: boolean;
  setIpAndConnect: (ip: string) => void;
  setRequiresManualInput: (value: boolean) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const WebSocketProvider = ({ children }: { children: ReactNode }) => {
  const { isConnected, connectWebSocket, ws, isWsConnected, currentIp, log, requiresManualInput, setIpAndConnect, setRequiresManualInput } = useWebSocket();
  const sendMessage = sendMessageWrapper(ws);

  const contextValue = {
    isConnected,
    isWsConnected,
    sendMessage,
    connectWebSocket,
    currentIp,
    log,
    requiresManualInput,
    setIpAndConnect,
    setRequiresManualInput,
  };

  return (
    <WebSocketContext.Provider value={contextValue}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error('useWebSocketContext must be used within a WebSocketProvider');
  }
  return context;
};