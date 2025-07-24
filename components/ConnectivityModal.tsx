import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useWebSocketContext } from '@/context/WebSocketContext';
import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';

export const ConnectivityModal = () => {
  const { isConnected, currentIp, log, requiresManualInput, setIpAndConnect, setRequiresManualInput, connectWebSocket, isOwner } = useWebSocketContext();
  const [manualIp, setManualIp] = React.useState("");

  if (isConnected) {
    return null; // Don't render if connected
  }

  return (
    <View className="absolute inset-0 bg-black/20 justify-center items-center">
      <View className="bg-neutral-900 w-full max-w-xs mx-8 rounded-xl p-6 border border-neutral-700">
        {!requiresManualInput ? (
          <>
            <MaterialIcons name="wifi-off" size={48} color="#d4d4d4" className="self-center mb-4" />
            <Text className="text-neutral-300 text-center mb-4">
              Connection Lost
            </Text>
            <Text className="text-neutral-400 text-center text-xs mb-4">
              Server IP: {currentIp ? currentIp : !isOwner ? "Change the IP" : "Attempting to connect..."}
            </Text>
            <View className='flex flex-row gap-4'>
              <TouchableOpacity
                className="bg-neutral-700 flex-1 rounded-lg py-3 px-6"
                onPress={() => setRequiresManualInput(true)}
                >
                <Text className="text-neutral-200 text-center">
                  Change IP
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-neutral-700 flex-1 rounded-lg py-3 px-6"
                onPress={connectWebSocket}
                >
                <Text className="text-neutral-200 text-center">
                  Reconnect
                </Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <Text className="text-neutral-300 text-center mb-4 text-lg font-bold">
              Connect to Server
            </Text>
            <Text className="text-neutral-400 text-center text-xs mb-4">
              Enter Server IP or scan QR code from server terminal.
            </Text>
            <TextInput
              className="w-full bg-neutral-700 text-white rounded-lg p-3 mb-4 text-center"
              placeholder="Enter IP Address"
              placeholderTextColor="#a3a3a3"
              value={manualIp}
              onChangeText={setManualIp}
              keyboardType="numeric"
            />
            <TouchableOpacity
              className="bg-neutral-700 rounded-lg py-3 px-6 w-full"
              onPress={() => setIpAndConnect(manualIp)}
            >
              <Text className="text-neutral-200 text-center">
                Connect
              </Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};