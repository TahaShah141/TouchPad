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
    let currentWs = ws.current;

    const setupAndConnect = async () => {
      try {
        const ip = await getMacIP();
        if (ip) {
          setIpAddress(ip);
          console.log('IP address obtained:', ip);

          console.log('Attempting to connectWebSocket...');
          if (currentWs) {
            console.log('Closing existing WebSocket connection.');
            currentWs.close();
          }

          console.log(`Initiating connection to ws://${ip}:2025`);
          const socket = new WebSocket(`ws://${ip}:2025`);

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
            console.log('WebSocket disconnected.');
            ws.current = null;
            console.log('ws.current set to null on close.');
          };
        } else {
          console.log("Could not get IP address.");
        }
      } catch (e) {
        console.error("Failed to get IP address or connect:", e);
      }
    };
    setupAndConnect();

    return () => {
      if (currentWs) {
        console.log('Cleaning up WebSocket on unmount.');
        currentWs.close();
      }
    };
  }, []);

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
    })
    .onUpdate((e) => {
      if (isWsConnected.value) {

        runOnJS(sendMessage)({
          type: 'mousemove',
          dx: e.translationX,
          dy: e.translationY,
        });
      } else {
        console.log('WebSocket instance is null or not connected.');
      }
    })
    .onEnd(() => {
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

