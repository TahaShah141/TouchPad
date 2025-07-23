import { useEffect, useRef, useState } from 'react';

import { getMacIP } from "@/lib/utils";
import { useSharedValue } from 'react-native-reanimated';

export const useWebSocket = () => {
  const [ipAddress, setIpAddress] = useState("");
  const WS_PORT = '2025';
  const [isConnected, setIsConnected] = useState(false);
  const isWsConnected = useSharedValue(false);
  const ws = useRef<WebSocket | null>(null);

  const connectWebSocket = () => {
    console.log('Attempting to connectWebSocket...');
    const targetIp = ipAddress;
    
    if (!targetIp) {
      console.log("IP address not available yet. Cannot connect.");
      return;
    }

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log('Existing WebSocket connection is open. Not reconnecting.');
      return;
    }
    
    if (ws.current && ws.current.readyState !== WebSocket.CLOSED) {
      console.log('Closing existing WebSocket connection before new attempt.');
      ws.current.close();
      ws.current = null;
    }

    console.log(`Initiating connection to ws://${targetIp}:${WS_PORT}`);
    const socket = new WebSocket(`ws://${targetIp}:${WS_PORT}`);

    socket.onopen = () => {
      setIsConnected(true);
      isWsConnected.value = true;
      ws.current = socket;
      console.log('WebSocket connected successfully.');
    };

    socket.onmessage = (event) => {
      console.log('Received message from server: ' + event.data);
    };

    socket.onerror = (error) => {
      console.error('WebSocket Error from connectWebSocket: ' + JSON.stringify(error));
      setIsConnected(false);
      isWsConnected.value = false;
      console.log('WebSocket connection error. ws.current state: ' + (ws.current ? ws.current.readyState : 'null'));
    };

    socket.onclose = (event) => {
      setIsConnected(false);
      isWsConnected.value = false;
      ws.current = null;
      console.log(`WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`);
    };
  };

  useEffect(() => {
    const setupAndConnect = async () => {
      try {
        const resolvedIp = await getMacIP();
        if (!resolvedIp) {
          console.log('Failed to get IP address from getMacIP().');
          return;
        }

        setIpAddress(resolvedIp);
        console.log(`Resolved IP Address: ${resolvedIp}.`);

        if (ws.current && ws.current.readyState !== WebSocket.CLOSED) {
          console.log('Closing existing WebSocket connection from useEffect cleanup.');
          ws.current.close();
        }
        
        console.log(`Attempting initial WS connection to ${resolvedIp}:${WS_PORT}.`);
        const socket = new WebSocket(`ws://${resolvedIp}:${WS_PORT}`);

        socket.onopen = () => {
          setIsConnected(true);
          isWsConnected.value = true;
          ws.current = socket;
          console.log('Initial WebSocket connected successfully from useEffect.');
        };

        socket.onmessage = (event) => {
          console.log('Received message from server (useEffect): ' + event.data);
        };

        socket.onerror = (error) => {
          setIsConnected(false);
          isWsConnected.value = false;
          console.error('Initial WebSocket Error from useEffect: ' + JSON.stringify(error));
          console.log('WebSocket connection error. ws.current state: ' + (ws.current ? ws.current.readyState : 'null'));
        };

        socket.onclose = (event) => {
          setIsConnected(false);
          isWsConnected.value = false;
          ws.current = null;
          console.log(`Initial WebSocket disconnected from useEffect. Code: ${event.code}, Reason: ${event.reason}`);
        };
      } catch (e) {
        console.error('Error during setupAndConnect: ' + JSON.stringify(e));
      }
    };
    
    setupAndConnect();

    return () => {
      if (ws.current && ws.current.readyState !== WebSocket.CLOSED) {
        console.log('Cleaning up WebSocket connection on unmount.');
        ws.current.close();
      }
    };
  }, [ipAddress]);

  return { isConnected, connectWebSocket, ws, isWsConnected };
};