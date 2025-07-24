import { KeyboardKey } from '@/components/KeyboardKey';
import { ModifierProvider } from '@/context/ModifierContext';
import ArrowKeys from '@/lib/ArrowKeys';
import { KEYS } from '@/lib/KEYS';
import { useWebSocketContext } from '@/context/WebSocketContext';
import { View } from 'react-native';
import { useRouter } from 'expo-router';

export default function Keyboard() {
  const { sendMessage } = useWebSocketContext();
  const router = useRouter();

  return (
    <ModifierProvider>
      <View className='flex-1 bg-neutral-900 justify-center items-center'>
        <View className='gap-1.5 portrait:rotate-90'>
          {KEYS.map((row, r) => (
            <View key={r} className='flex flex-row gap-1.5'>
              {row.map((key, i) => (
                <KeyboardKey {...key} key={i} sendMessage={sendMessage} router={router} />
              ))}
              {r === 5 && <ArrowKeys sendMessage={sendMessage} />}
            </View>
          ))}
        </View>
      </View>
    </ModifierProvider>
  );
}
