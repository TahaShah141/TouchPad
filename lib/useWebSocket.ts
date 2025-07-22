import { useEffect, useRef, useState } from 'react';
import { getMacIP } from "@/lib/utils";
import { useSharedValue } from 'react-native-reanimated';

export const useWebSocket = () => {
  const [ipAddress, setIpAddress] = useState("");
  const PORT = '2025'
  const [isConnected, setIsConnected] = useState(false);
  const isWsConnected = useSharedValue(false);
  const ws = useRef<WebSocket | null>(null);

  const connectWebSocket = () => {
    console.log('Attempting to connectWebSocket...');
    if (!ipAddress) {
      console.log("IP address not available yet. Cannot connect.");
      return;
    }
    
    if (ws.current) {
      console.log('Closing existing WebSocket connection.');
      ws.current.close();
    }

    console.log(`Initiating connection to ws://${ipAddress}:${PORT}`);
    const socket = new WebSocket(`ws://${ipAddress}:${PORT}`);

    socket.onopen = () => {
      setIsConnected(true);
      isWsConnected.value = true;
      ws.current = socket;
    };

    socket.onmessage = (event) => {
      console.log('Received message from server:', event.data);
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error during connection:', error);
      setIsConnected(false);
      isWsConnected.value = false;
      console.log('WebSocket connection error. ws.current:', ws.current);
    };

    socket.onclose = () => {
            setIsConnected(false);
            isWsConnected.value = false;
            ws.current = null;
            console.log('WebSocket disconnected.');
            console.log('ws.current set to null on close.');
          };
  };

  useEffect(() => {
    let currentWs = ws.current; // Capture current ref value for cleanup

    const setupAndConnect = async () => {
      try {
        const ip = await getMacIP();
        if (ip) {
          setIpAddress(ip);

          if (currentWs) {
            currentWs.close();
          }

          const socket = new WebSocket(`ws://${ip}:2025`);

          socket.onopen = () => {
            setIsConnected(true);
            isWsConnected.value = true;
            ws.current = socket; // Assign here
          };

          socket.onmessage = (event) => {
          };

          socket.onerror = (error) => {
            setIsConnected(false); // Ensure state is updated on error
            isWsConnected.value = false;
          };

          socket.onclose = () => {
            setIsConnected(false);
            isWsConnected.value = false;
            ws.current = null;
          };
        } else {
        }
      } catch (e) {
      }
    };
    setupAndConnect();

    // Cleanup on unmount
    return () => {
      if (currentWs) {
        currentWs.close();
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  return { isConnected, connectWebSocket, ws, isWsConnected };
};