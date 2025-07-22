import * as ScreenOrientation from 'expo-screen-orientation';

import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View } from "react-native";
import { runOnJS, useSharedValue } from 'react-native-reanimated';

import { MaterialIcons } from '@expo/vector-icons';
import { getMacIP } from "@/lib/utils";

export default function Index() {
  const [ipAddress, setIpAddress] = useState("");
  const PORT = '2025'
  const [isConnected, setIsConnected] = useState(false);
  const [orientation, setOrientation] = useState(ScreenOrientation.Orientation.PORTRAIT_UP);
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

          // Attempt to connect WebSocket
          // Close existing connection before opening a new one
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

  useEffect(() => {
    const subscription = ScreenOrientation.addOrientationChangeListener((event) => {
      setOrientation(event.orientationInfo.orientation);
    });

    return () => {
      ScreenOrientation.removeOrientationChangeListeners();
    };
  }, []);;

  const SENSITIVITY_FACTOR = 0.15; // Adjust this value as needed

  const sendMessage = (message: { type: string; dx?: number; dy?: number; }) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      const scaledMessage = {
        ...message,
        dx: message.dx ? message.dx * SENSITIVITY_FACTOR : undefined,
        dy: message.dy ? message.dy * SENSITIVITY_FACTOR : undefined,
      };
      ws.current.send(JSON.stringify(scaledMessage));
    } else {
      console.log('WebSocket not open. Current state:', ws.current?.readyState);
    }
  };

  const panGesture = Gesture.Pan()
    .onStart((e) => {
      // No action needed on start for continuous movement
    })
    .onUpdate((e) => {
      if (isWsConnected.value) {
        let dx = e.translationX;
        let dy = e.translationY;

        // Adjust dx and dy based on current orientation
        if (orientation === ScreenOrientation.Orientation.PORTRAIT_UP) {
          [dx, dy] = [dy, -dx]
        }

        runOnJS(sendMessage)({
          type: 'mousemove',
          dx: dx,
          dy: dy,
        });
      } else {
      }
    })
    .onEnd(() => {
      // No action needed on end for continuous movement
    });

  return (
    <View className="flex-1 bg-gray-900">
      <GestureDetector gesture={panGesture}>
        <View className="flex-1 m-4 rounded-3xl bg-gray-800 shadow-lg">
        </View>
      </GestureDetector>
      
      {/* Reconnect Button */}
      <TouchableOpacity
        className={`absolute top-16 right-5 w-14 h-14 rounded-full justify-center items-center ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}
        onPress={connectWebSocket}
      >
        <MaterialIcons name="refresh" size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
}

