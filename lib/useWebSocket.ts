import * as Linking from 'expo-linking';

import { useEffect, useRef, useState } from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMacIP } from "@/lib/utils";

const WS_PORT = '2025';
const DEVICE_OWNER_KEY = 'is_owner_key'; // Key to identify owner's device

export const useWebSocket = () => {
  const [currentIp, setCurrentIp] = useState(""); // The IP currently being used for connection
  const [log, setLogState] = useState(""); // Internal state for log
  const [requiresManualInput, setRequiresManualInput] = useState(false); // New state for UI control
  const logTimeoutRef = useRef<number | null>(null); // Ref to store timeout ID
  const [isConnected, setIsConnected] = useState(false);
  const [isWsConnected, setIsWsConnected] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  const hasAttemptedInitialConnect = useRef(false); // New ref to track initial connection attempt
  const [isOwner, setIsOwner] = useState(true)
  const [isMac, setIsMac] = useState(false);

  // Custom setLog function with timeout
  const setLog = (message: string) => {
    setLogState(message);
    if (logTimeoutRef.current) {
      clearTimeout(logTimeoutRef.current);
    }
    logTimeoutRef.current = +(setTimeout(() => {
      setLogState(""); // Clear log after 3 seconds
    }, 3000));
  };

  const connect = (ip: string) => {
    if (!ip) {
      setLog("Cannot connect: IP address is empty.");
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

    setLog(`Initiating connection to ws://${ip}:${WS_PORT}`);
    const socket = new WebSocket(`ws://${ip}:${WS_PORT}`);

    socket.onopen = () => {
      setIsConnected(true);
      setIsWsConnected(true)
      ws.current = socket;
      setLog('WebSocket connected successfully.');
    };

    socket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      if (message.type === 'os_info') {
        setIsMac(message.isMac);
      } else {
        setLog('Received message from server: ' + event.data);
      }
    };

    socket.onerror = (error) => {
      setLog('WebSocket Error: ' + JSON.stringify(error));
      setIsConnected(false);
      setIsWsConnected(false)
      setLog('WebSocket connection error. ws.current state: ' + (ws.current ? ws.current.readyState : 'null'));
    };

    socket.onclose = (event) => {
      setIsConnected(false);
      setIsWsConnected(false)
      ws.current = null;
      setLog(`WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`);
    };
  };

  // This function only sets the IP, does not connect directly
  const setIpFromDeepLink = (ip: string) => {
    setCurrentIp(ip);
  };

  // New function to set IP and connect (for manual input)
  const setIpAndConnect = (ip: string) => {
    setCurrentIp(ip);
  };

  useEffect(() => {
    // This effect handles initial IP resolution
    if (!hasAttemptedInitialConnect.current) {
      hasAttemptedInitialConnect.current = true;

      // Handle initial deep link if the app was opened via one
      Linking.getInitialURL().then((url) => {
        if (url) {
          const { queryParams } = Linking.parse(url);
          if (queryParams && queryParams.ip) {
            setCurrentIp(queryParams.ip as string); // Only set IP, connection handled by next useEffect
          } else {
            // If no IP in initial deep link, try fallback
            resolveIpFallback();
          }
        } else {
          // If no initial deep link, try fallback
          resolveIpFallback();
        }
      });
    }

    // Handle incoming deep links while the app is running
    const subscription = Linking.addEventListener('url', ({ url }) => {
      const { queryParams } = Linking.parse(url);
      if (queryParams && queryParams.ip) {
        setCurrentIp(queryParams.ip as string); // Only set IP, connection handled by next useEffect
      }
    });

    // Fallback to getMacIP if no deep link IP is set initially
    const resolveIpFallback = async () => {
      const isOwner = await AsyncStorage.getItem(DEVICE_OWNER_KEY);
      setIsOwner(isOwner === 'true')
      if (isOwner === 'true' || true) {
        try {
          const resolvedIp = await getMacIP();
          if (resolvedIp) {
            setCurrentIp(resolvedIp); // Only set IP, connection handled by next useEffect
          } else {
            setLog('Failed to get My Mac IP. Manual input may be required.');
            setRequiresManualInput(true);
          }
        } catch (e) {
          setLog('Error during getMacIP fallback: ' + JSON.stringify(e));
          setRequiresManualInput(true);
        }
      } else {
      }
    };

    // Cleanup function for this effect
    return () => {
      subscription.remove();
      if (logTimeoutRef.current) {
        clearTimeout(logTimeoutRef.current);
      }
    };
  }, []); // Empty dependency array to run only once on mount

  // This effect runs when currentIp changes (after initial setup or deep link update)
  useEffect(() => {
    if (currentIp) {
      // This is the ONLY place where connect is called based on currentIp
      connect(currentIp);
    }
  }, [currentIp]); // Re-run this effect when currentIp changes

  // Cleanup for WebSocket connection on unmount
  useEffect(() => {
    return () => {
      if (ws.current && ws.current.readyState !== WebSocket.CLOSED) {
        setLog('Cleaning up WebSocket connection on unmount.');
        ws.current.close();
      }
    };
  }, []);

  return { 
    isConnected, 
    connectWebSocket: () => connect(currentIp), // Expose a connect function that uses currentIp
    ws, 
    isWsConnected, 
    currentIp, // Expose currentIp for display
    setIpFromDeepLink, // Expose to allow external setting of IP (e.g., from UI)
    setIpAndConnect, // Expose for manual IP input
    requiresManualInput, // Expose to control UI rendering
    setRequiresManualInput,
    log, // Expose log for display
    isOwner,
    isMac
  };
};