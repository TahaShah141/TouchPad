import { useEffect, useRef, useState } from 'react';

import { getMacIP } from "@/lib/utils";
import { useSharedValue } from 'react-native-reanimated';

export const useWebSocket = () => {
  const [log, setLog] = useState("")
  const [ipAddress, setIpAddress] = useState("");
  const PORT = '2025'
  const [isConnected, setIsConnected] = useState(false);
  const isWsConnected = useSharedValue(false);
  const ws = useRef<WebSocket | null>(null);

  const connectWebSocket = () => {
    setLog('Attempting to connectWebSocket...');
    if (!ipAddress) {
      setLog("IP address not available yet. Cannot connect.");
      return;
    }

    if (ws.current) {
      setLog('Closing existing WebSocket connection.');
      ws.current.close();
    }

    setLog(`Initiating connection to ws://${ipAddress}:${PORT}`);
    const socket = new WebSocket(`ws://${ipAddress}:${PORT}`);

    socket.onopen = () => {
      setIsConnected(true);
      isWsConnected.value = true;
      ws.current = socket;
      setLog('WebSocket connected successfully.');
    };

    socket.onmessage = (event) => {
      setLog('Received message from server:' + event.data);
    };

    socket.onerror = (error) => {
      setLog('WebSocket Error from connectWebSocket: ' + JSON.stringify(error));
      setIsConnected(false);
      isWsConnected.value = false;
      setLog('WebSocket connection error. ws.current:' + ws.current);
    };

    socket.onclose = () => {
            setIsConnected(false);
            isWsConnected.value = false;
            ws.current = null;
            setLog('WebSocket disconnected.');
            setLog('ws.current set to null on close.');
          };
  };

  useEffect(() => {
    let currentWs = ws.current; // Capture current ref value for cleanup

    const setupAndConnect = async () => {
      try {
        const ip = await getMacIP();
        if (ip) {
          setIpAddress(ip);
          setLog(`Resolved IP Address: ${ip}. Attempting initial WS connection.`);

          if (currentWs) {
            currentWs.close();
          }

          const socket = new WebSocket(`ws://${ip}:2025`);

          socket.onopen = () => {
            setIsConnected(true);
            isWsConnected.value = true;
            ws.current = socket; // Assign here
            setLog('Initial WebSocket connected successfully from useEffect.');
          };

          socket.onmessage = (event) => {
            setLog('Received message from server (useEffect):' + event.data);
          };

          socket.onerror = (error) => {
            setIsConnected(false); // Ensure state is updated on error
            isWsConnected.value = false;
            setLog('Initial WebSocket Error from useEffect: ' + JSON.stringify(error));
            setLog('WebSocket connection error. ws.current:' + ws.current);
          };

          socket.onclose = () => {
            setIsConnected(false);
            isWsConnected.value = false;
            ws.current = null;
            setLog('Initial WebSocket disconnected from useEffect.');
          };
        } else {
          setLog('Failed to get IP address from getMacIP().');
        }
      } catch (e) {
        setLog('Error during setupAndConnect: ' + JSON.stringify(e));
      }
    };
    setupAndConnect();

    // Cleanup on unmount
    return () => {
      if (currentWs) {
        setLog('Cleaning up WebSocket connection on unmount.');
        currentWs.close();
      }
    };
  }, []); // Empty dependency array means this runs once on mount

  return { isConnected, connectWebSocket, ws, isWsConnected, log };
};