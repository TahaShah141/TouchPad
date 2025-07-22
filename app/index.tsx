import * as ScreenOrientation from 'expo-screen-orientation';

import React, { useEffect, useRef, useState } from 'react';
import { TouchableOpacity, View } from "react-native";
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { runOnJS, useSharedValue } from 'react-native-reanimated';

import { getMacIP } from "@/lib/utils";
import { MaterialIcons } from '@expo/vector-icons';

export default function Index() {
  const [ipAddress, setIpAddress] = useState("");
  const PORT = '2025'
  const [isConnected, setIsConnected] = useState(false);
  const [orientation, setOrientation] = useState(ScreenOrientation.Orientation.PORTRAIT_UP);
  const isWsConnected = useSharedValue(false);
  const prevPanX = useSharedValue(0);
  const prevPanY = useSharedValue(0);
  const prevTwoFingerPanX = useSharedValue(0);
  const prevTwoFingerPanY = useSharedValue(0);
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
  }, []);

  const SENSITIVITY_FACTOR = 3; // Adjust this value as needed
  const SCROLL_SENSITIVITY_FACTOR = 2.5; // Adjust this value as needed for scrolling

  const sendMessage = (message: { type: string; dx?: number; dy?: number; }) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      let finalDx = message.dx;
      let finalDy = message.dy;

      if (message.type === 'mousemove') {
        finalDx = message.dx ? message.dx * SENSITIVITY_FACTOR : undefined;
        finalDy = message.dy ? message.dy * SENSITIVITY_FACTOR : undefined;
      } else if (message.type === 'scroll') {
        finalDx = message.dx ? message.dx * SCROLL_SENSITIVITY_FACTOR : undefined;
        finalDy = message.dy ? message.dy * SCROLL_SENSITIVITY_FACTOR : undefined;
      }

      const scaledMessage = {
        ...message,
        dx: finalDx,
        dy: finalDy,
      };
      ws.current.send(JSON.stringify(scaledMessage));
    } else {
      console.log('WebSocket not open. Current state:', ws.current?.readyState);
    }
  };

  const panGesture = Gesture.Pan()
    .minPointers(1)
    .maxPointers(1)
    .onStart((e) => {
      prevPanX.value = e.translationX;
      prevPanY.value = e.translationY;
    })
    .onUpdate((e) => {
      if (isWsConnected.value) {
        let dx = e.translationX - prevPanX.value;
        let dy = e.translationY - prevPanY.value;

        prevPanX.value = e.translationX;
        prevPanY.value = e.translationY;

        // Adjust dx and dy based on current orientation
        if (orientation === ScreenOrientation.Orientation.PORTRAIT_UP) {
          [dx, dy] = [dy, -dx];
        }

        runOnJS(sendMessage)({
          type: 'mousemove',
          dx: dx,
          dy: dy,
        });
      }
    });

  const twoFingerPanGesture = Gesture.Pan()
    .minPointers(2)
    .maxPointers(2)
    .onStart((e) => {
      prevTwoFingerPanX.value = e.translationX;
      prevTwoFingerPanY.value = e.translationY;
    })
    .onUpdate((e) => {
      if (isWsConnected.value) {
        let dx = e.translationX - prevTwoFingerPanX.value;
        let dy = e.translationY - prevTwoFingerPanY.value;

        prevTwoFingerPanX.value = e.translationX;
        prevTwoFingerPanY.value = e.translationY;

        // Adjust dx and dy based on current orientation
        if (orientation === ScreenOrientation.Orientation.PORTRAIT_UP) {
          [dx, dy] = [dy, -dx];
        }

        runOnJS(sendMessage)({
          type: 'scroll',
          dx: dx,
          dy: dy,
        });
      }
    });

  const doubleTapGesture = Gesture.Tap()
    .minPointers(3)
    .maxDuration(250)
    .maxDelay(300)
    .onEnd(() => {
      if (isWsConnected.value) {
        runOnJS(sendMessage)({
          type: 'doubleclick',
        });
      }
    });

  const singleTapGesture = Gesture.Tap()
    .maxDuration(250)
    .maxDeltaX(5)
    .maxDeltaY(5)
    .onEnd(() => {
      if (isWsConnected.value) {
        runOnJS(sendMessage)({
          type: 'click',
        });
      }
    });

  const twoFingerTapGesture = Gesture.Tap()
    .minPointers(2)
    .maxDuration(250)
    .maxDeltaX(10)
    .maxDeltaY(10)
    .onEnd(() => {
      if (isWsConnected.value) {
        runOnJS(sendMessage)({
          type: 'rightclick',
        });
      }
    });

  const composedGesture = Gesture.Race(
    doubleTapGesture,
    twoFingerTapGesture,
    singleTapGesture,
    panGesture,
    twoFingerPanGesture
  );

  return (
    <View className="flex-1 bg-gray-900">
      <GestureDetector gesture={composedGesture}>
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

