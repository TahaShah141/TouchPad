import { useEffect, useRef, useState } from 'react';

import { getMacIP } from "@/lib/utils"; // Assuming this is still needed for dynamic IP resolution
import { useSharedValue } from 'react-native-reanimated';

export const useWebSocket = () => {
  const [log, setLog] = useState("");
  const [httpTestLog, setHttpTestLog] = useState(""); // New state for HTTP test logs
  const [ipAddress, setIpAddress] = useState("");
  const WS_PORT = '2025';
  const HTTP_PORT = '8000'; // Define HTTP port to match your server
  const [isConnected, setIsConnected] = useState(false);
  const isWsConnected = useSharedValue(false);
  const ws = useRef<WebSocket | null>(null); // Type inferred, or use WebSocket | null

  // Function to test HTTP connectivity
  const testFetch = async () => {
    setHttpTestLog('Attempting HTTP fetch...');
    const targetIp = ipAddress; // Use the resolved IP address directly

    if (!targetIp) {
      setHttpTestLog("IP address not available for HTTP test. Cannot fetch.");
      return;
    }

    const testUrl = `http://${targetIp}:${HTTP_PORT}`;
    setHttpTestLog(`Fetching from: ${testUrl}`);

    try {
      const response = await fetch(testUrl);
      if (response.ok) {
        const text = await response.text();
        setHttpTestLog(`HTTP Fetch Success: ${text.substring(0, 50)}...`); // Show first 50 chars
      } else {
        setHttpTestLog(`HTTP Fetch Failed: Status ${response.status} - ${response.statusText}`);
      }
    } catch (error: any) {
      setHttpTestLog(`HTTP Fetch Error: ${error.message}`);
      console.error('HTTP Fetch Error:', error);
    }
  };

  const connectWebSocket = () => {
    setLog('Attempting to connectWebSocket...');
    const targetIp = ipAddress; // Use the resolved IP address directly
    
    if (!targetIp) {
      setLog("IP address not available yet. Cannot connect.");
      return;
    }

    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      setLog('Existing WebSocket connection is open. Not reconnecting.');
      return;
    }
    
    if (ws.current && ws.current.readyState !== WebSocket.CLOSED) {
      setLog('Closing existing WebSocket connection before new attempt.');
      ws.current.close();
      ws.current = null;
    }

    setLog(`Initiating connection to ws://${targetIp}:${WS_PORT}`);
    const socket = new WebSocket(`ws://${targetIp}:${WS_PORT}`);

    socket.onopen = () => {
      setIsConnected(true);
      isWsConnected.value = true;
      ws.current = socket;
      setLog('WebSocket connected successfully.');
    };

    socket.onmessage = (event) => {
      setLog('Received message from server: ' + event.data);
    };

    socket.onerror = (error) => {
      setLog('WebSocket Error from connectWebSocket: ' + JSON.stringify(error));
      setIsConnected(false);
      isWsConnected.value = false;
      setLog('WebSocket connection error. ws.current state: ' + (ws.current ? ws.current.readyState : 'null'));
    };

    socket.onclose = (event) => {
      setIsConnected(false);
      isWsConnected.value = false;
      ws.current = null;
      setLog(`WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`);
    };
  };

  useEffect(() => {
    let currentWsInstance = ws.current;

    const setupAndConnect = async () => {
      try {
        const resolvedIp = await getMacIP(); // Rely solely on getMacIP()
        if (!resolvedIp) {
          setLog('Failed to get IP address from getMacIP().');
          return;
        }

        setIpAddress(resolvedIp);
        setLog(`Resolved IP Address: ${resolvedIp}.`);

        // --- Perform HTTP test first ---
        await testFetch(); 
        // -------------------------------

        setLog(`Attempting initial WS connection to ${resolvedIp}:${WS_PORT}.`);
        if (currentWsInstance && currentWsInstance.readyState !== WebSocket.CLOSED) {
          setLog('Closing existing WebSocket connection from useEffect cleanup.');
          currentWsInstance.close();
        }

        const socket = new WebSocket(`ws://${resolvedIp}:${WS_PORT}`);

        socket.onopen = () => {
          setIsConnected(true);
          isWsConnected.value = true;
          ws.current = socket;
          setLog('Initial WebSocket connected successfully from useEffect.');
        };

        socket.onmessage = (event) => {
          setLog('Received message from server (useEffect): ' + event.data);
        };

        socket.onerror = (error) => {
          setIsConnected(false);
          isWsConnected.value = false;
          setLog('Initial WebSocket Error from useEffect: ' + JSON.stringify(error));
          setLog('WebSocket connection error. ws.current state: ' + (ws.current ? ws.current.readyState : 'null'));
        };

        socket.onclose = (event) => {
          setIsConnected(false);
          isWsConnected.value = false;
          ws.current = null;
          setLog(`Initial WebSocket disconnected from useEffect. Code: ${event.code}, Reason: ${event.reason}`);
        };
      } catch (e) {
        setLog('Error during setupAndConnect: ' + JSON.stringify(e));
      }
    };
    
    setupAndConnect();

    return () => {
      if (ws.current && ws.current.readyState !== WebSocket.CLOSED) {
        setLog('Cleaning up WebSocket connection on unmount.');
        ws.current.close();
      }
    };
  }, [ipAddress]);

  return { isConnected, connectWebSocket, ws, isWsConnected, log, httpTestLog, testFetch };
};
